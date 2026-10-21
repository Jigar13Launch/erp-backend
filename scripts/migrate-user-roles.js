// One-time migration: adds role / isActive / logo / createdBy defaults to existing users
// and marks one user as SUPER_ADMIN.
//
// Usage (dry run, changes nothing):  node scripts/migrate-user-roles.js <superAdminLoginId>
// Usage (apply):                     node scripts/migrate-user-roles.js <superAdminLoginId> --apply
const User = require("../app/models/User");

(async () => {
    const loginId = process.argv[2];
    const apply = process.argv.includes("--apply");
    if (!loginId || loginId.startsWith("--")) {
        console.log("Usage: node scripts/migrate-user-roles.js <superAdminLoginId> [--apply]");
        process.exit(1);
    }
    try {
        const superAdmin = await User.findOne({ loginId, isDelete: false });
        if (!superAdmin) {
            console.log(`No user found with loginId "${loginId}". Nothing changed.`);
            process.exit(1);
        }
        const users = await User.find({ isDelete: false }).lean();
        const needRole = users.filter(u => !u.role && String(u._id) !== String(superAdmin._id));
        const needActive = users.filter(u => u.isActive === undefined);
        console.log(`Super admin       : ${superAdmin.loginId} (${superAdmin.companyName}) _id=${superAdmin._id}`);
        console.log(`Users total       : ${users.length}`);
        console.log(`Will set TENANT   : ${needRole.length} -> ${needRole.map(u => u.loginId).join(", ")}`);
        console.log(`Will set isActive : ${needActive.length}`);
        if (!apply) {
            console.log("Dry run only. Re-run with --apply to write changes.");
            process.exit(0);
        }
        await User.updateOne({ _id: superAdmin._id }, { $set: { role: "SUPER_ADMIN" } });
        await User.updateMany({ isDelete: false, role: { $exists: false }, _id: { $ne: superAdmin._id } }, { $set: { role: "TENANT" } });
        await User.updateMany({ isActive: { $exists: false } }, { $set: { isActive: true } });
        await User.updateMany({ logo: { $exists: false } }, { $set: { logo: "" } });
        await User.updateMany({ createdBy: { $exists: false } }, { $set: { createdBy: null } });
        console.log("Migration applied.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
