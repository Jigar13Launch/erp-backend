const Firm = require('../models/AdvocateFirm')
var schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.tz = 'Asia/Calcutta';
var run_continue_30_sec_cron1 = schedule.scheduleJob(rule, async function () {
    await Firm.updateMany({}, { downloads: 0 });
})