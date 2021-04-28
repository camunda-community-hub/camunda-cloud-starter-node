import { ZBClient } from "zeebe-node"

export function startWorkers(zbc: ZBClient) {
    console.log('Starting workers for Decision Gateway scenario...')
    zbc.createWorker({
        taskType: "process-without-attachment",
        taskHandler: job => {
            console.log("Processing a payload without an attachment...")
            return job.complete({
                outcome: "Processed without attachment"
            })
        }
    })
    zbc.createWorker({
        taskType: "process-with-attachment",
        taskHandler: job => {
            console.log("Processing a payload with an attachment...")
            return job.complete({
                outcome: "Processed with attachment"
            })
        }
    })
}