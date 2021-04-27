import { ZBClient } from "zeebe-node";
import path from "path"

export function deployProcess(zbc: ZBClient) {
    const modelPath = path.join(__dirname, "..", "..", "bpmn", "send-welcome-email.bpmn")
    zbc.deployProcess(modelPath).then(console.log).catch(console.error)
}

export function startProcessInstance(zbc: ZBClient, { name, email }: WelcomeEmailPayload) {
    return zbc.createProcessInstance<WelcomeEmailPayload>('send-welcome-email', {
        name, email
    })
}

export interface WelcomeEmailPayload {
    name: string
    email: string
}