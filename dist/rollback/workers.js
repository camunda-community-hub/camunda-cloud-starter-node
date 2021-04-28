"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorkers = void 0;
function startWorkers(zbc) {
    console.log('Starting workers for Rollback Compensation scenario...');
    zbc.createWorker({
        taskType: "collect-payment",
        taskHandler: job => {
            const { metadata, outcome } = job.variables;
            // Business logic for collecting payment goes here
            if (metadata.chargeSucceed) {
                console.log(`Charged customer $${metadata.customerCharge}`);
                return job.complete({
                    metadata,
                    outcome: Object.assign(Object.assign({}, outcome), { customerChargeAmount: metadata.customerCharge })
                });
            }
            else {
                console.log('Customer payment method declined.');
                return job.error("PAYMENT_FAILED");
            }
        }
    });
    zbc.createWorker({
        taskType: "ship-product",
        taskHandler: job => {
            const { metadata, outcome } = job.variables;
            // Business logic for shipping implementation goes here
            if (metadata.shippingSucceed) {
                console.log("Shipping product to customer");
                return job.complete({ metadata, outcome: Object.assign(Object.assign({}, outcome), { productShipped: true }) });
            }
            else {
                console.log("Shipping failed");
                return job.error("SHIPPING_FAILED");
            }
        },
    });
    zbc.createWorker({
        taskType: "reverse-charge",
        taskHandler: job => {
            const { metadata, outcome } = job.variables;
            // Business logic to reverse payment goes here
            console.log(`Compensating customer payment method with $${metadata.customerCharge}`);
            return job.complete({ metadata, outcome: Object.assign(Object.assign({}, outcome), { customerChargeAmount: 0 }) });
        }
    });
}
exports.startWorkers = startWorkers;
