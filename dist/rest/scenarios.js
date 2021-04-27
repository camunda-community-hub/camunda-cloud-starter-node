"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarioNames = exports.scenarios = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
console.log('Location:', __dirname);
exports.scenarios = {
    "Basic": {
        description: "A single worker task that sends an email",
        bpmnXML: fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "bpmn", "send-welcome-email.bpmn"), "utf-8")
    }
};
exports.scenarioNames = Object.keys(exports.scenarios);
