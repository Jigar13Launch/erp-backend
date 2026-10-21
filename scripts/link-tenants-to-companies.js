// One-time: for every existing TENANT user create a linked Company row under the super admin's books
// (with an opening-balance ledger row), and set User.createdBy = super admin.
//
// A Company already in the super admin's books with the same GSTIN or mobile as a tenant is treated as a
// duplicate and soft-deleted (isDelete:true, its ledger rows deactivated) - but only if it has no transactions.
// Otherwise it is reported and the tenant is skipped.
//
// Usage (dry run, changes nothing):  node scripts/link-tenants-to-companies.js <superAdminLoginId> <openingBalance>
// Usage (apply):                     node scripts/link-tenants-to-companies.js <superAdminLoginId> <openingBalance> --apply
const User = require("../app/models/User");
const Company = require("../app/models/Company");
const Ledger = require("../app/models/ledger");
const Sell = require("../app/models/sell");
const Buy = require("../app/models/buy");
const Earning = require("../app/models/earning");
const PoForm = require("../app/models/poForm");
const DeliveryChallan = require("../app/models/deliveryChallan");

async function transactionCount(companyId) {
    const counts = await Promise.all([
        Sell.countDocuments({ companyId }),
        Buy.countDocuments({ companyId }),
        Earning.countDocuments({ companyId }),
        PoForm.countDocuments({ $or: [{ buyerCompany: companyId }, { sellerCompany: companyId }] }),
        DeliveryChallan.countDocuments({ companyId }),
        Ledger.countDocuments({ companyId, isOpningBal: { $ne: true } })
    ]);
    return counts.reduce((a, b) => a + b, 0);
}

(async () => {
    const loginId = process.argv[2];
    const openingBalance = Number(process.argv[3]);
    const apply = process.argv.includes("--apply");
    if (!loginId || loginId.startsWith("--") || !Number.isFinite(openingBalance)) {
        console.log("Usage: node scripts/link-tenants-to-companies.js <superAdminLoginId> <openingBalance> [--apply]");
        process.exit(1);
    }
    try {
        const admin = await User.findOne({ loginId, role: "SUPER_ADMIN", isDelete: false });
        if (!admin) {
            console.log(`No SUPER_ADMIN with loginId "${loginId}". Run migrate-user-roles.js first. Nothing changed.`);
            process.exit(1);
        }
        const adminUser = { _id: admin._id, name: admin.name, companyName: admin.companyName, loginId: admin.loginId, email: admin.email };
        const tenants = await User.find({ role: "TENANT", isDelete: false });
        const today = new Date().toISOString().split("T")[0];
        let created = 0, removed = 0, skipped = 0;

        for (const t of tenants) {
            const label = `${t.loginId} (${t.companyName.trim()})`;
            const already = await Company.findOne({ tenantUserId: t._id, isDelete: false });
            if (already) {
                console.log(`SKIP    ${label}: already linked to company ${already._id}`);
                skipped++;
                continue;
            }
            const gst = (t.gst || "").trim();
            const mobile = Number(t.phone);
            const dupQuery = [{ mobileNumber: mobile }];
            if (gst) dupQuery.push({ gstin: gst });
            const dups = await Company.find({ userId: admin._id, isDelete: false, tenantUserId: null, $or: dupQuery });

            let blocked = false;
            for (const d of dups) {
                const n = await transactionCount(d._id);
                if (n > 0) {
                    console.log(`BLOCKED ${label}: duplicate company "${d.name}" (${d._id}) has ${n} transactions. Resolve manually.`);
                    blocked = true;
                } else {
                    console.log(`DELETE  duplicate company "${d.name}" (${d._id}, gstin=${d.gstin}, mobile=${d.mobileNumber}) - no transactions`);
                    if (apply) {
                        await Company.updateOne({ _id: d._id }, { $set: { isDelete: true } });
                        await Ledger.updateMany({ companyId: d._id }, { $set: { isActive: false, isDelete: true } });
                    }
                    removed++;
                }
            }
            if (blocked) { skipped++; continue; }

            console.log(`CREATE  company "${t.companyName.trim()}" gstin=${gst || "-"} mobile=${mobile} openingBalance=${openingBalance} -> tenant ${t.loginId}`);
            if (apply) {
                const company = await Company.create({
                    userId: admin._id,
                    user: adminUser,
                    name: t.companyName.trim(),
                    mobileNumber: mobile,
                    gstin: gst,
                    address: t.address,
                    email: t.email,
                    openingBalance,
                    tenantUserId: t._id
                });
                await Ledger.create({
                    userId: admin._id,
                    user: adminUser,
                    companyId: company._id,
                    sellId: null,
                    buyId: null,
                    earningId: null,
                    isOpningBal: true,
                    companyName: company.name,
                    date: today,
                    amount: openingBalance,
                    paymentType: "SELL",
                    amountType: "DEB",
                    notes: "Sales Payment",
                    isActive: true
                });
                await User.updateOne({ _id: t._id }, { $set: { createdBy: admin._id } });
            }
            created++;
        }
        console.log(`\n${apply ? "APPLIED" : "DRY RUN"}: create=${created} deleteDuplicates=${removed} skipped=${skipped}`);
        if (!apply) console.log("Re-run with --apply to write changes.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
