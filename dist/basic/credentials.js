"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCredentials = exports.hydrateCredentials = void 0;
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = require("dotenv");
const zeebe_node_1 = require("zeebe-node");
function hydrateCredentials() {
    dotenv_1.config();
    const zeebeAddress = process.env.ZEEBE_ADDRESS;
    const zeebeClientId = process.env.ZEEBE_CLIENT_ID;
    const zeebeClientSecret = process.env.ZEEBE_CLIENT_SECRET;
    const zeebeAuthorizationServerUrl = process.env.ZEEBE_AUTHORIZATION_SERVER_URL;
    const clientCredentials = {
        zeebeAddress,
        zeebeClientId,
        zeebeClientSecret,
        zeebeAuthorizationServerUrl
    };
    if (!zeebeAddress || !zeebeClientId || !zeebeClientSecret || !zeebeAuthorizationServerUrl) {
        console.log('Client credentials missing in environment. Please set in .env or upload from client application.');
        return { exists: false, value: null };
    }
    console.log(`Retrieved cluster credentials from the environment.`);
    return {
        exists: true,
        value: clientCredentials,
        zbc: new zeebe_node_1.ZBClient()
    };
}
exports.hydrateCredentials = hydrateCredentials;
function setCredentials(credentialsFile) {
    // Strip out leading 'export' from all lines and write credentials to .env
    const envExists = fs_1.default.existsSync(`.env`);
    if (envExists) {
        backupEnv();
    }
    const normalisedCredentials = credentialsFile
        .split('\n')
        .map(l => l.startsWith('export ') ? l.replace('export ', '') : l)
        .join('\n');
    console.log(`Credentials`, normalisedCredentials);
    fs_1.default.writeFileSync('.env', normalisedCredentials);
    return hydrateCredentials();
}
exports.setCredentials = setCredentials;
function backupEnv() {
    let prefix = 1;
    const name = (num) => `.env_${num.toString().padStart(3, '0')}`;
    while (fs_1.default.existsSync(name(prefix))) {
        prefix++;
    }
    fs_1.default.renameSync('.env', name(prefix));
}
