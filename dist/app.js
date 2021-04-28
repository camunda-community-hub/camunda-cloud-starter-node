"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config();
const { app } = require('./rest/server');
const sendemail = __importStar(require("./sendemail"));
const decision = __importStar(require("./decision-gateway"));
const parallelmulti = __importStar(require("./parallel-multi-instance"));
const rollback = __importStar(require("./rollback"));
const credentials_1 = require("./lib/credentials");
/**
 * Package.json uses nodemon when started with npm start
 * This reloads the entire application when the Camunda Cloud credentials are updated
 * in the .env file.
 */
const hydratedClient = credentials_1.getZBClient();
if (hydratedClient.exists) {
    const { zbc, value: { zeebeAddress } } = hydratedClient;
    sendemail.startWorkers(zbc);
    sendemail.deployProcess(zbc);
    sendemail.createRestEndpoints({ zbc, zeebeAddress, app });
    decision.deployProcess(zbc);
    decision.startWorkers(zbc);
    decision.createRestEndpoints({ app, zbc, zeebeAddress });
    parallelmulti.deployProcess(zbc);
    parallelmulti.startWorkers(zbc);
    parallelmulti.createRestEndpoints({ app, zbc, zeebeAddress });
    rollback.deployProcess(zbc);
    rollback.startWorkers(zbc);
    rollback.createRestEndpoints({ app, zbc, zeebeAddress });
}
