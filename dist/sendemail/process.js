"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startProcessInstance = exports.deployProcess = void 0;
const path_1 = __importDefault(require("path"));
function deployProcess(zbc) {
    const modelPath = path_1.default.join(__dirname, "..", "..", "bpmn", "send-welcome-email.bpmn");
    zbc.deployProcess(modelPath).then(console.log).catch(console.error);
}
exports.deployProcess = deployProcess;
function startProcessInstance(zbc, { name, email }) {
    return zbc.createProcessInstance('send-welcome-email', {
        name, email
    });
}
exports.startProcessInstance = startProcessInstance;
