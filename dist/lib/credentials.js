"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCredentials = exports.setConfig = exports.getZBClient = exports.getSendGridApiKey = void 0;
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = require("dotenv");
const zeebe_node_1 = require("zeebe-node");
const clientCredentials = {
    zeebeAddress: undefined,
    zeebeClientId: undefined,
    zeebeClientSecret: undefined,
    zeebeAuthorizationServerUrl: undefined
};
let zbc;
function getSendGridApiKey() {
    dotenv_1.config();
    return process.env.SENDGRID_API_KEY;
}
exports.getSendGridApiKey = getSendGridApiKey;
/**
 *
 * This uses the zero-conf constructor to read the Camunda Cloud credentials from the environment
 */
function getZBClient() {
    // Read the .env file into the environment
    dotenv_1.config();
    const zeebeAddress = process.env.ZEEBE_ADDRESS;
    const zeebeClientId = process.env.ZEEBE_CLIENT_ID;
    const zeebeClientSecret = process.env.ZEEBE_CLIENT_SECRET;
    const zeebeAuthorizationServerUrl = process.env.ZEEBE_AUTHORIZATION_SERVER_URL;
    if (!zeebeAddress || !zeebeClientId || !zeebeClientSecret || !zeebeAuthorizationServerUrl) {
        console.log('Client credentials missing in environment. Please set in .env or upload from client application.');
        return { exists: false, value: null };
    }
    if (zeebeAddress !== clientCredentials.zeebeAddress || zeebeClientId !== clientCredentials.zeebeClientId || zeebeClientSecret !== clientCredentials.zeebeClientSecret) {
        console.log(`Retrieved cluster credentials from the environment.`);
        zbc === null || zbc === void 0 ? void 0 : zbc.close();
        zbc = new zeebe_node_1.ZBClient();
    }
    clientCredentials.zeebeAddress = zeebeAddress;
    clientCredentials.zeebeClientId = zeebeClientId;
    clientCredentials.zeebeClientSecret = zeebeClientSecret;
    clientCredentials.zeebeAuthorizationServerUrl = zeebeAuthorizationServerUrl;
    return {
        exists: true,
        value: {
            zeebeAddress,
            zeebeClientId,
            zeebeAuthorizationServerUrl,
            zeebeClientSecret
        },
        zbc: zbc
    };
}
exports.getZBClient = getZBClient;
function setConfig(config) {
    const envFileExists = fs_1.default.existsSync(`.env`);
    const existingContent = envFileExists ? fs_1.default.readFileSync('.env', 'utf-8') : '';
    const removeExistingConfig = (pair, config) => config.split('\n').filter(l => !l.trimStart().startsWith(pair[0])).join('\n');
    const scrubbedContent = config.reduce((prev, curr) => removeExistingConfig(curr, prev), existingContent);
    const newContent = config.reduce((prev, pair) => `${prev}
${pair[0]}=${pair[1]}`, scrubbedContent);
    if (envFileExists) {
        backupEnv();
    }
    fs_1.default.writeFileSync('.env', newContent);
}
exports.setConfig = setConfig;
function setCredentials(credentialsFile) {
    // Strip out leading 'export' from all lines and write credentials to .env
    const normalisedCredentials = credentialsFile
        .split('\n')
        .map(l => l.startsWith('export ') ? l.replace('export ', '') : l)
        .map((l) => {
        const key = l.split('=')[0];
        const value = l.replace(`${key}=`, '');
        return [key, value];
    });
    setConfig(normalisedCredentials);
    return getZBClient();
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
