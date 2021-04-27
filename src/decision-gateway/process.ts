import { ZBClient } from "zeebe-node";
import path from "path"

export function deployProcess(zbc: ZBClient) {
    const modelPath = path.join(__dirname, "..", "..", "bpmn", "process-attachment.bpmn")
    zbc.deployProcess(modelPath).then(console.log).catch(console.error)
}

export function startProcessInstance(zbc: ZBClient, { hasAttachment }: DecisionGatewayPayload) {
    // Note the use of createProcessInstanceWithResult - this returns a Promise of the eventual outcome of the process
    return zbc.createProcessInstanceWithResult<DecisionGatewayPayload>('process-attachment', {
        hasAttachment
    })
}

interface DecisionGatewayPayload {
    hasAttachment: boolean
}