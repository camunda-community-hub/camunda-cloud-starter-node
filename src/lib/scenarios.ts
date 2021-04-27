import fs from "fs"
import path from "path"

interface Scenario {
    description: string;
    bpmnXML: string;
    workers: string[]
}

console.log('Location:', __dirname);

export const scenarios: { [key: string]: Scenario } = {
    "Send Email": {
        description: "A single worker task that sends an email",
        bpmnXML: fs.readFileSync(path.join(__dirname, "..", "..", "bpmn", "send-welcome-email.bpmn"), "utf-8"),
        workers: ['send-email']
    }
};

export const scenarioNames = Object.keys(scenarios);