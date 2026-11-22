# AWS EC2 Node.js Backend CI/CD with GitHub Actions, OIDC and Systems Manager

A hands-on DevOps lab documenting automated deployment of a
Node.js/Express backend from GitHub to an Ubuntu EC2 instance. GitHub
Actions authenticates to AWS with OpenID Connect (OIDC), invokes AWS
Systems Manager (SSM) Run Command, updates the server's `main` branch
checkout, installs production dependencies, restarts PM2, and verifies
the service through an HTTP health check.

> **Scope:** Backend deployment only. The Angular frontend remained
> local during this implementation and was not deployed by this
> workflow.

## 1. Project details

  -----------------------------------------------------------------------
  Component                           Lab configuration
  ----------------------------------- -----------------------------------
  GitHub repository                   `Jigar13Launch/erp-backend`

  Branch / trigger                    `main` push; manual
                                      `workflow_dispatch`

  AWS region                          `ap-south-1`

  Compute                             Ubuntu 24.04 LTS on Amazon EC2

  Runtime                             Node.js `v22.23.3` observed

  Application                         Node.js / Express

  Application directory               `/var/www/erp-backend`

  Process manager                     PM2, process name `erp-backend`

  Reverse proxy                       Nginx

  App port                            `8000` (localhost health check)

  Health endpoint                     `http://127.0.0.1:8000/health`

  Deployment transport                AWS Systems Manager Run Command

  CI/CD                               GitHub Actions

  AWS authentication                  GitHub OIDC / IAM role

  Database                            MongoDB Atlas, connection supplied
                                      via server-side environment
  -----------------------------------------------------------------------

## 2. Architecture

``` mermaid
flowchart LR
  DEV[Developer] -->|push main| GH[GitHub repository]
  GH --> GA[GitHub Actions]
  GA -->|OIDC token| STS[AWS STS]
  STS -->|temporary credentials| IAM[Deployment IAM role]
  GA -->|SSM SendCommand| SSM[AWS Systems Manager]
  SSM -->|Run Command| EC2[Ubuntu EC2]
  EC2 -->|fetch/reset main| REPO[Backend source]
  EC2 --> NPM[npm ci --omit=dev]
  NPM --> PM2[PM2 restart]
  PM2 --> APP[Express API :8000]
  APP -->|health check| SSM
  APP --> DB[(MongoDB Atlas)]
  CLIENT[Angular frontend - local] --> NGINX[Nginx reverse proxy]
  NGINX --> APP
```

## 3. End-to-end deployment flow

1.  Developer pushes backend changes to `main`.
2.  GitHub Actions starts the deployment workflow.
3.  GitHub issues an OIDC token; the workflow assumes the configured AWS
    IAM role for temporary credentials.
4.  GitHub Actions calls SSM `SendCommand` for the EC2 managed instance.
5.  The EC2 SSM Agent executes the deployment commands.
6.  The server fetches `origin/main`, checks out `main`, and resets the
    working tree to `origin/main`.
7.  `npm ci --omit=dev` installs production dependencies from the
    lockfile.
8.  PM2 restarts `erp-backend` with updated environment variables.
9.  The workflow waits three seconds and calls
    `http://127.0.0.1:8000/health`.
10. GitHub Actions polls the SSM command status. `Success` completes the
    workflow; `Failed`, `Cancelled`, `TimedOut`, or polling timeout
    fails it.

## 4. AWS configuration

### EC2 instance and SSM

The lab used an Ubuntu 24.04 LTS EC2 instance in `ap-south-1`. The
server application directory is `/var/www/erp-backend`. An EC2 instance
role named `EC2-ERP-SSM-Role` was attached for Systems Manager access.

The SSM Agent was managed as a Snap service. Verify it with:

``` bash
sudo snap services amazon-ssm-agent
```

The service should be enabled and active. The instance also needs
outbound HTTPS (TCP 443) connectivity to Systems Manager endpoints.

### GitHub OIDC identity provider and deployment role

Create an IAM OIDC identity provider with:

-   Provider URL: `https://token.actions.githubusercontent.com`
-   Audience: `sts.amazonaws.com`

Create an IAM role for GitHub Actions (the lab role name was
`GitHubActions-ERP-Deploy-Role`). Restrict its trust policy to the
intended repository and `main` branch. Example only:

``` json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub": "repo:Jigar13Launch/erp-backend:ref:refs/heads/main"
      }
    }
  }]
}
```

Replace `<AWS_ACCOUNT_ID>` and verify the exact OIDC `sub` claim format
for your repository before using this policy. GitHub's subject claim can
vary with repository/organization settings and environment usage.

The deployment role requires narrowly scoped permissions for
`ssm:SendCommand` and `ssm:GetCommandInvocation` on the intended managed
instance and approved SSM document. Avoid broad `ssm:*` permissions
where possible.

### GitHub repository variable

In **GitHub → Settings → Secrets and variables → Actions → Variables**,
configure:

  Variable         Value
  ---------------- ----------------------------------------
  `AWS_ROLE_ARN`   ARN of `GitHubActions-ERP-Deploy-Role`

The workflow below uses the EC2 instance ID as a placeholder. Replace it
or define a repository variable such as `EC2_INSTANCE_ID`. No long-lived
AWS access key is required when OIDC is configured.

## 5. GitHub Actions workflow

Create `.github/workflows/deploy.yml` in the backend repository:

``` yaml
name: Deploy ERP Backend to EC2

on:
  push:
    branches:
      - main
    paths-ignore:
      - "README.md"
      - "CLAUDE.md"
      - ".gitignore"
      - ".github/**"
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

concurrency:
  group: erp-backend-production
  cancel-in-progress: false

jobs:
  deploy:
    name: Deploy backend through AWS SSM
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Configure AWS credentials using OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: ap-south-1

      - name: Deploy to EC2 through SSM
        env:
          INSTANCE_ID: i-REPLACE_WITH_YOUR_EC2_INSTANCE_ID
        shell: bash
        run: |
          set -euo pipefail

          COMMAND_ID=$(aws ssm send-command \
            --instance-ids "$INSTANCE_ID" \
            --document-name "AWS-RunShellScript" \
            --comment "GitHub Actions ERP backend deployment" \
            --parameters 'commands=[
              "set -eu",
              "cd /var/www/erp-backend",
              "git fetch origin main",
              "git checkout main",
              "git reset --hard origin/main",
              "npm ci --omit=dev",
              "pm2 restart erp-backend --update-env",
              "sleep 3",
              "curl --fail --silent --show-error http://127.0.0.1:8000/health"
            ]' \
            --query 'Command.CommandId' \
            --output text)

          echo "SSM command ID: $COMMAND_ID"

          for attempt in $(seq 1 30); do
            STATUS=$(aws ssm get-command-invocation \
              --command-id "$COMMAND_ID" \
              --instance-id "$INSTANCE_ID" \
              --query 'Status' \
              --output text 2>/dev/null || true)

            echo "Deployment status: ${STATUS:-Pending}"

            case "$STATUS" in
              Success)
                echo "Deployment and health check succeeded."
                exit 0
                ;;
              Failed|Cancelled|TimedOut)
                aws ssm get-command-invocation \
                  --command-id "$COMMAND_ID" \
                  --instance-id "$INSTANCE_ID" \
                  --query '{Status:Status,Stdout:StandardOutputContent,Stderr:StandardErrorContent}' \
                  --output json || true
                exit 1
                ;;
            esac

            sleep 10
          done

          echo "Timed out waiting for the SSM command."
          exit 1
```

**Before running:** replace the EC2 instance ID placeholder. Ensure
`AWS_ROLE_ARN` is configured and the IAM trust/policy, EC2 role, SSM
Agent and server prerequisites are ready.

## 6. EC2 application setup

### Install and verify Node.js / PM2

The session recorded NVM-managed Node.js `v22.23.3`.

``` bash
node --version
npm --version
npm install -g pm2
pm2 --version
```

### Clone the backend

``` bash
sudo mkdir -p /var/www
sudo chown ubuntu:ubuntu /var/www
cd /var/www
git clone git@github.com:Jigar13Launch/erp-backend.git
cd erp-backend
```

For a private repository, configure a dedicated read-only GitHub deploy
key on EC2. Keep its private key on the server with restrictive
permissions; never commit it or print it in workflow logs.

### Configure environment variables

The backend used `constants.env`. Create it on the server, not in Git:

``` env
PORT=8000
MONGODB_URI=<YOUR_MONGODB_ATLAS_CONNECTION_STRING>
ENCRYPTION=false
ENCRIPTION_KEY=<YOUR_SECRET_KEY>
ENCRIPTION_IV=<YOUR_SECRET_IV>
```

Use the exact variable names expected by the application. Protect the
file and confirm Git ignores it:

``` bash
chmod 600 constants.env
git check-ignore constants.env
```

Never commit MongoDB credentials, encryption keys, private keys or
`constants.env`. For production, consider AWS Secrets Manager or SSM
Parameter Store with least-privilege access.

### Install dependencies and start PM2

``` bash
npm ci --omit=dev
pm2 start server.js --name erp-backend
pm2 save
pm2 status
pm2 startup
```

Run the exact startup command printed by PM2, then run `pm2 save` again.

### Health check

``` bash
curl -i --max-time 10 http://127.0.0.1:8000/health
```

Observed response in the lab:

``` http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ok","service":"erp-backend"}
```

### Nginx verification

Nginx was configured as a reverse proxy in front of the Node.js
application.

``` bash
sudo nginx -t
sudo systemctl status nginx --no-pager
sudo systemctl reload nginx
curl -i http://localhost/health
```

The session recorded an HTTP 200 response through Nginx.

## 7. Push and trigger the workflow

From the backend repository on Windows:

``` powershell
git status
git add .
git commit -m "Configure AWS EC2 CI/CD deployment"
git push origin main
```

Then open **GitHub → Actions** and inspect the
`Deploy ERP Backend to EC2` run. The workflow can also be started
manually using `workflow_dispatch`.

## 8. Results recorded during the lab

  Verification                   Observed result
  ------------------------------ -------------------------------------------------------
  PM2                            `erp-backend` process displayed as `online`
  Local health endpoint          HTTP `200 OK`
  Health payload                 `{"status":"ok","service":"erp-backend"}`
  Nginx config test              Syntax OK; test successful
  Nginx proxied health request   HTTP `200 OK`
  Git remote                     `git@github.com:Jigar13Launch/erp-backend.git`
  Deployment path                GitHub Actions → OIDC → SSM → EC2
  Frontend                       Angular remained local; not deployed in this pipeline

These are results recorded in the shared lab conversation, not a
guarantee that the EC2 instance or workflow is still active.

## 9. Troubleshooting encountered

### SSM Agent service not found in systemd

The lab used the Snap-managed agent. Check:

``` bash
sudo snap services amazon-ssm-agent
```

### Git fetch permission issue

The session found a root-owned `.git/FETCH_HEAD`. Inspect repository
ownership:

``` bash
ls -ld /var/www/erp-backend
ls -ld /var/www/erp-backend/.git
ls -l /var/www/erp-backend/.git/FETCH_HEAD
```

Keep the repository and `.git` metadata owned by the deployment user.
Avoid mixing root and `ubuntu` Git operations.

### GitHub SSH authentication

The EC2 host used a dedicated SSH deploy key and `~/.ssh/config`.

``` bash
ssh -T git@github.com
git -C /var/www/erp-backend remote -v
```

### `npm ci` killed by the OOM killer

The lab recorded `npm ci` being killed on a small instance with
approximately 909 MiB RAM and a 2 GiB swap file.

``` bash
free -h
swapon --show
sudo dmesg -T | grep -i -E 'oom|out of memory|killed process' | tail -20
```

The backend later showed as online and returned HTTP 200. Small EC2
instances may still be memory-constrained during dependency
installation. Monitor memory and consider building
dependencies/artifacts in CI or using a larger instance.

### Low disk space

The lab recorded root filesystem usage reaching 98%.

``` bash
df -h /
sudo du -xhd1 /var /home/ubuntu 2>/dev/null | sort -h
sudo journalctl --disk-usage
```

Only remove caches/logs after identifying them. Do not delete
application uploads, database data or unknown files.

## 10. Security notes

-   Prefer OIDC short-lived credentials over long-lived AWS access keys.
-   Scope the OIDC trust policy to the exact repository and
    branch/environment.
-   Keep the GitHub Actions deployment role separate from the EC2
    instance role.
-   Restrict SSM actions and resources to the intended instance and
    document.
-   Keep secrets and private keys out of Git and Actions logs.
-   Limit public ingress to the ports actually required; keep the
    Node.js app port private behind Nginx.
-   Protect `main` with branch rules and review requirements.
-   Review CloudTrail and SSM command history.
-   Use dependency scanning and tests before deployment as future
    pipeline improvements.

## 11. Implemented scope vs. future work

**Implemented and evidenced in the shared chat** - GitHub Actions
push-to-main and manual triggers. - OIDC authentication to AWS. - SSM
Run Command deployment to EC2. - Git fetch/reset, production dependency
installation and PM2 restart. - HTTP health check and SSM status
polling. - Nginx reverse proxy verification.

**Not demonstrated as implemented** - Automated unit/integration test
stage. - Code-quality or vulnerability scanning stage. - Blue/green or
rolling deployment. - Automated rollback to a previous release. -
Angular frontend deployment. - Terraform provisioning as part of this
workflow.

**Suggested next improvements** 1. Add linting and automated tests
before deployment. 2. Add dependency/security scanning. 3. Add release
directories and rollback support instead of deploying only with
`git reset --hard`. 4. Move secrets to Secrets Manager or Parameter
Store. 5. Add CloudWatch logs, metrics and alarms. 6. Create a separate
frontend workflow when the Angular frontend is ready.

## References

-   [GitHub documentation: OIDC in
    AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)
-   [AWS credentials action for GitHub
    Actions](https://github.com/aws-actions/configure-aws-credentials)
-   [AWS Systems Manager Run
    Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html)
-   [Systems Manager managed
    instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/managed_instances.html)
