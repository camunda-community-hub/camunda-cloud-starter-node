"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorkers = void 0;
function startWorkers(zbc) {
    console.log('Starting workers for Decision Gateway scenario...');
    zbc.createWorker({
        taskType: "process-without-attachment",
        taskHandler: job => {
            console.log("Processing a payload without an attachment...");
            return job.complete({
                outcome: "Processed without attachment"
            });
        }
    });
    zbc.createWorker({
        taskType: "process-with-attachment",
        taskHandler: job => {
            console.log("Processing a payload with an attachment...");
            return job.complete({
                outcome: "Processed with attachment"
            });
        }
    });
}
exports.startWorkers = startWorkers;
