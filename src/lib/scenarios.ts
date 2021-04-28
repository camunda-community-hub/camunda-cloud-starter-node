import fs from "fs"
import path from "path"

interface Scenario {
    description: string;
    bpmnXML: string;
}

console.log('Location:', __dirname);

const getModelPath = (filename: string) => path.join(__dirname, "..", "..", "bpmn", filename)
const getModel = (filename: string) => fs.readFileSync(getModelPath(filename), "utf-8")
export const scenarios: { [key: string]: Scenario } = {
    "Send Email": {
        description: "A single worker task that sends an email",
        bpmnXML: getModel("send-welcome-email.bpmn"),
    },
    "Decision Gateway": {
        description: "A decision gateway with multiple pathways",
        bpmnXML: getModel("process-attachment.bpmn"),

    },
    "Parallel Multi-instance": {
        description: "A parallel multi-instance to parallelize work",
        bpmnXML: getModel("parallel-multi-instance.bpmn")
    },
    "Rollback Compensation": {
        description: "Modeling rollback compensation with BPMN boundary error events",
        bpmnXML: getModel("rollback.bpmn")
    }
};

export const scenarioNames = Object.keys(scenarios);