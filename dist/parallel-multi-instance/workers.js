"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorkers = void 0;
const zeebe_node_1 = require("zeebe-node");
function startWorkers(zbc) {
    console.log('Starting workers for Parallel Multi-instance scenario...');
    zbc.createWorker({
        taskType: "compute-heavy",
        taskHandler: job => {
            console.log("Worker 1 doing some CPU heavy work...");
            const { file } = job.variables;
            // Here we would use the file id to retrieve some large file over REST or from a DB or similar
            return new Promise(res => setTimeout(() => res(job.complete({
                processedFile: `${file}-processed`
            })), zeebe_node_1.Duration.milliseconds.from(zeebe_node_1.Duration.seconds.of(30))));
        },
        maxJobsToActivate: 1,
        timeout: zeebe_node_1.Duration.seconds.of(120)
    });
    zbc.createWorker({
        taskType: "compute-heavy",
        taskHandler: job => {
            console.log("Worker 2 doing some CPU heavy work...");
            const { file } = job.variables;
            // Here we would use the file id to retrieve some large file over REST or from a DB or similar
            return new Promise(res => setTimeout(() => res(job.complete({
                processedFile: `${file}-processed`
            })), zeebe_node_1.Duration.milliseconds.from(zeebe_node_1.Duration.seconds.of(30))));
        },
        maxJobsToActivate: 1,
        timeout: zeebe_node_1.Duration.seconds.of(120)
    });
    zbc.createWorker({
        taskType: "compute-heavy",
        taskHandler: job => {
            console.log("Worker 3 doing some CPU heavy work...");
            const { file } = job.variables;
            // Here we would use the file id to retrieve some large file over REST or from a DB or similar
            return new Promise(res => setTimeout(() => res(job.complete({
                processedFile: `${file}-processed`
            })), zeebe_node_1.Duration.milliseconds.from(zeebe_node_1.Duration.seconds.of(30))));
        },
        maxJobsToActivate: 1,
        timeout: zeebe_node_1.Duration.seconds.of(120)
    });
}
exports.startWorkers = startWorkers;
