import { ZBClient } from "zeebe-node";
import { config } from "dotenv";
import * as path from "path";

config();

async function main() {
  const zbc = new ZBClient();
  const filename = path.join(__dirname, "..", "bpmn", "test-process.bpmn");
  await zbc.deployWorkflow(filename);
  const res = await zbc.createWorkflowInstanceWithResult({
    bpmnProcessId: "test-process",
    variables: {
      name: "Josh Wulf",
    },
    requestTimeout: 60000,
  });
  console.log(`Process Completed: ${res.variables.say}`);
}

main();
