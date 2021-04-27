import { Duration, ZBClient } from "zeebe-node";
import path from "path"

export function deployProcess(zbc: ZBClient) {
    const modelPath = path.join(__dirname, "..", "..", "bpmn", "parallel-multi-instance.bpmn")
    zbc.deployProcess(modelPath).then(console.log).catch(console.error)
}

export function startProcessInstance(zbc: ZBClient, { files }: FilePayload) {
    // Note the use of createProcessInstanceWithResult - this returns a Promise of the eventual outcome of the process
    return zbc.createProcessInstanceWithResult<FilePayload>({
        bpmnProcessId: 'parallel-multi-instance',
        requestTimeout: Duration.milliseconds.from(Duration.minutes.of(3)),
        variables: { files }
    })

}

interface FilePayload {
    files: string[]
}