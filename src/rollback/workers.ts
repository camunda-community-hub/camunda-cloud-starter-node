import { ZBClient } from "zeebe-node"
import { RollbackPayload } from "./process"

export function startWorkers(zbc: ZBClient) {
    console.log('Starting workers for Rollback Compensation scenario...')
    zbc.createWorker<RollbackPayload, any, RollbackPayload>({
        taskType: "collect-payment",
        taskHandler: job => {
            const { metadata, outcome } = job.variables
            // Business logic for collecting payment goes here
            if (metadata.chargeSucceed) {
                console.log(`Charged customer $${metadata.customerCharge}`)
                return job.complete({
                    metadata, outcome: {
                        ...outcome,
                        customerChargeAmount: metadata.customerCharge
                    }
                })
            } else {
                console.log('Customer payment method declined.')
                return job.error("PAYMENT_FAILED")
            }
        }
    })
    zbc.createWorker<RollbackPayload, any, RollbackPayload>({
        taskType: "ship-product",
        taskHandler: job => {
            const { metadata, outcome } = job.variables
            // Business logic for shipping implementation goes here
            if (metadata.shippingSucceed) {
                console.log("Shipping product to customer")
                return job.complete({ metadata, outcome: { ...outcome, productShipped: true } })
            } else {
                console.log("Shipping failed")
                return job.error("SHIPPING_FAILED")
            }
        },
    })
    zbc.createWorker<RollbackPayload, any, RollbackPayload>({
        taskType: "reverse-charge",
        taskHandler: job => {
            const { metadata, outcome } = job.variables
            // Business logic to reverse payment goes here
            console.log(`Compensating customer payment method with $${metadata.customerCharge}`)
            return job.complete({ metadata, outcome: { ...outcome, customerChargeAmount: 0 } })
        }
    })
}