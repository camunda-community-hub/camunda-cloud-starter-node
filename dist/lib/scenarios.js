"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarioNames = exports.scenarios = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
console.log('Location:', __dirname);
const getModelPath = (filename) => path_1.default.join(__dirname, "..", "..", "bpmn", filename);
const getModel = (filename) => fs_1.default.readFileSync(getModelPath(filename), "utf-8");
exports.scenarios = {
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
    }
};
exports.scenarioNames = Object.keys(exports.scenarios);
