# Claude Project Context — ERP Frontend + Backend

You are working on an existing ERP application with an Angular frontend and a Node.js/Express/Mongoose backend. Your job is to understand the existing architecture and preserve current behavior while implementing requested changes.

## Stack and layout

### Frontend
- Angular 17-era application using NgModules and Angular Router.
- ERP feature module: `src/app/pages/ERP_System/`.
- Feature components: company, product, buy, sell, earnings, po-form, delivery-challan, expense, ledger, dashboard, and reports.
- Feature routes are declared in `src/app/pages/ERP_System/erp-system-routing.module.ts` and mounted under `/erpSystem` through `src/app/pages/pages-routing.module.ts`.
- Most ERP business API calls use `HelperService` in `src/app/core/services/helper.service.ts`.
- `HelperService.http_post_method_requester()` sends POST to `environment.BASE_URL + endpoint`; `http_get_method_requester()` sends GET to `environment.BASE_URL + endpoint + parameter`.
- API base and upload URL configuration are in `src/environments/environment.ts` and `environment.prod.ts`. Do not hardcode URLs in components.
- Upload screens use `FormData`; image/PDF links use the environment's image/PDF base URL.
- `restApiService` / `GlobalComponent` contain Velzon starter-template/demo API code. Do not assume those methods power ERP screens; trace the actual feature component.

### Backend
- Node.js + Express + Mongoose/MongoDB.
- `server.js` configures middleware, serves `/uploads`, mounts route modules, starts Socket.IO, initializes settings/super-company setup and loads `script.js`.
- Route files live in `app/routes/`, controllers in `app/controllers/`, models in `app/models/`, middleware in `app/middleware/`.
- ERP routes currently mounted with `app/middleware/authenticate.js`: company, product, buy, sell, earning, poForm, deliveryChallan, expense, and ledger.
- User routes are mounted separately without that middleware in the supplied source. Many other route modules exist but are commented out in `server.js`; check route mounting before using them.
- Backend business endpoints use the `/api/admin/` prefix. The frontend base URL already includes `/api/admin/`, so pass endpoint names such as `getCompany`, not `/api/admin/getCompany`.

## Business domain and cross-module dependencies
- **Company**: master company records referenced by transactional screens.
- **Product**: catalog used by Buy, Sell and PO Form line items.
- **Buy**: purchase transactions with multiple product rows and attachments.
- **PO Form**: purchase-order form with product/company lookups.
- **Sell**: sales transactions with multiple product rows and attachments; provides invoice and sales aggregates.
- **Delivery Challan**: dispatch/delivery document related to sales and products.
- **Earnings**: income records.
- **Expense**: expenses with optional image/PDF attachments and GST-related aggregate.
- **Ledger**: accounting entries, company ledger, receivables, monthly earnings and balance-sheet reporting.
- **Dashboard/Reports**: consume summary and aggregate APIs; inspect their component methods to establish exact dependencies.

Typical operational sequence: maintain Company and Product masters → record Buy/PO transactions → record Sell transactions → create Delivery Challans when required → record Earnings and Expenses → review Ledger, Dashboard and Reports. This is a conceptual map, not a substitute for controller-specific business rules.

## Main API routes
- **User**: POST `create-user`, GET `get-users`, POST `update-user`, POST `login-user` (full paths begin `/api/admin/`).
- **Company**: `createCompany`, `updateCompany`, `deleteCompany`, `getCompany`.
- **Product**: `createProduct`, `updateProduct`, `deleteProduct`, `getProduct`.
- **Buy**: `createBuy`, `updateBuy`, `deleteBuy`, `getBuy`.
- **Sell**: `createSell`, `updateSell`, `deleteSell`, `getSell`, `getLastInvoiceNumber`, `getMonthlyCompanySales`, `getTopsoldproducts`, `getMonthlyOrderQuantity`.
- **Earnings**: `createEarning`, `updateEarning`, `deleteEarning`, `getEarning`.
- **PO Form**: `createPoForm`, `updatePoForm`, `deletePoForm`, `getPoForm`.
- **Delivery Challan**: `createDeliveryChallan`, `updateDeliveryChallan`, `deleteDeliveryChallan`, `getDeliveryChallan`.
- **Expense**: `createExpense`, `updateExpense`, `deleteExpense`, `getExpense`, `getPayableGstByMonth`.
- **Ledger**: `createLedger`, `updateLedger`, `deleteLedger`, `deleteLedgers`, `getLedger`, `getCompanyLeger`, `getMonthlyEarnings`, `getRecevableBalances`, `getBalanceSheet`.

Check the actual route file for HTTP method, upload middleware and exact field names before making an API change. API spelling such as `getCompanyLeger` and `getRecevableBalances` is part of the existing contract unless intentionally migrated.

## Required workflow for every change

### Before editing
1. Restate the requested behavior and identify affected screens, API endpoints, controllers, models and related calculations.
2. Trace the flow end to end: route → component TS/HTML → HelperService call and endpoint → Express route → controller → Mongoose model/related models → response → UI update.
3. Check whether the route is actually mounted in `server.js` and whether auth middleware applies.
4. Inspect neighboring features that share fields, totals, company/product references, invoice numbers, GST, ledger balances or file paths.
5. Identify the existing response contract (success, data, error fields) and preserve it unless all consumers are updated.
6. For uploads, match the exact frontend FormData keys with Multer `.single()` / `.fields()` configuration and controller `req.file` / `req.files` handling.

### Implementation rules
- Make the smallest safe change; do not refactor unrelated code.
- Preserve existing routes, payload fields, response fields, UI workflows, validation, permissions and accounting side effects unless the request explicitly changes them.
- Do not invent endpoints or model fields. Confirm them in source first.
- Do not put API URLs, secrets or credentials directly in components or source-controlled prompts.
- Keep business logic in the existing appropriate layer; do not duplicate backend calculations in the UI as a substitute for server logic.
- For monetary calculations, GST, balances, invoice sequencing and ledger entries, inspect controller/model logic and explain side effects before editing.
- For UI-only changes, avoid changing payloads or backend logic unless required.
- If a requirement is ambiguous or a change could alter accounting/security behavior, ask a concise clarification instead of guessing.

### After editing
1. Summarize changed files and explain the end-to-end behavior.
2. List API and payload changes, if any.
3. Run available lint/build/tests where possible; report commands and actual results honestly.
4. Provide a manual QA checklist for success, validation failures, empty state, edit/delete, auth failure, uploads/previews and affected dashboard/report aggregates.
5. Call out untested assumptions and risks.

## Known issues to verify before touching auth or networking
- `AuthGuard.canActivate()` in the supplied source has an unconditional `return true` before its intended redirect, so unauthenticated route protection appears bypassed.
- Backend `authenticate.js` expects `userid` and `token` headers. The frontend request interceptor appears intended to attach these from session-stored user data. Verify interceptor registration and actual Network headers.
- `HelperService` has a separate `localStorage.adminid` header branch; the shown backend auth middleware does not use `adminid`.
- Request encryption uses `environment.encryption`, while response decryption checks `environment.ENCRYPTION`. Confirm consistency before changing encryption.
- Backend login hashes passwords with MD5. This is not suitable for password storage; do not make a quick incompatible change without planning a safe password migration.
- The backend wraps JSON responses in an encrypted `{ response: ... }` envelope only when its encryption environment flag is enabled.
- Several route modules are present but not mounted. Existence of a controller/route file does not mean an endpoint is active.
- `sell.js` appears to register `/api/admin/disableAllSell` twice.
- The frontend development base URL and backend `PORT` must be aligned in local setup; verify actual environment files without exposing secrets.

## First response when asked to implement a feature
Start by providing:
- **Flow understood**: the current frontend-to-backend request path.
- **Files to change**: exact existing files and why.
- **Dependencies/risks**: shared modules, auth, uploads, accounting side effects or aggregates.
- **Plan**: minimal ordered steps.

Then implement only after verifying the relevant source. Do not merely give generic advice when the codebase contains the answer.
