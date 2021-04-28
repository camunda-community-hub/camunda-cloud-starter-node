"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startProcessInstance = exports.deployProcess = void 0;
const zeebe_node_1 = require("zeebe-node");
const path_1 = __importDefault(require("path"));
function deployProcess(zbc) {
    const modelPath = path_1.default.join(__dirname, "..", "..", "bpmn", "rollback.bpmn");
    zbc.deployProcess(modelPath).then(console.log).catch(console.error);
}
exports.deployProcess = deployProcess;
function startProcessInstance(zbc, payload) {
    // Note the use of createProcessInstanceWithResult - this returns a Promise of the eventual outcome of the process
    return zbc.createProcessInstanceWithResult({
        bpmnProcessId: 'rollback',
        requestTimeout: zeebe_node_1.Duration.milliseconds.from(zeebe_node_1.Duration.minutes.of(3)),
        variables: Object.assign(Object.assign({}, payload), { outcome: { customerChargeAmount: 0, productShipped: false } })
    });
}
exports.startProcessInstance = startProcessInstance;
