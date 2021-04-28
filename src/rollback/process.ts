import { Duration, ZBClient } from "zeebe-node";
import path from "path"

export function deployProcess(zbc: ZBClient) {
    const modelPath = path.join(__dirname, "..", "..", "bpmn", "rollback.bpmn")
    zbc.deployProcess(modelPath).then(console.log).catch(console.error)
}

export function startProcessInstance(zbc: ZBClient, payload: Pick<RollbackPayload, 'metadata'>) {
    // Note the use of createProcessInstanceWithResult - this returns a Promise of the eventual outcome of the process
    return zbc.createProcessInstanceWithResult<RollbackPayload>({
        bpmnProcessId: 'rollback',
        requestTimeout: Duration.milliseconds.from(Duration.minutes.of(3)),
        variables: { ...payload, outcome: { customerChargeAmount: 0, productShipped: false } }
    })

}

export interface RollbackPayload {
    metadata: {
        chargeSucceed: boolean;
        shippingSucceed: boolean;
        customerCharge: number
    },
    outcome: {
        customerChargeAmount: number;
        productShipped: boolean;
    }
}