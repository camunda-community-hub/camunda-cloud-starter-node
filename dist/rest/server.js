"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const credentials_1 = require("../lib/credentials");
const scenarios_1 = require("../lib/scenarios");
exports.app = express_1.default();
const port = 3000;
exports.app.use(express_1.default.json());
exports.app.use(express_fileupload_1.default({
    useTempFiles: false,
}));
exports.app.use(express_1.default.static(path_1.default.join(__dirname, '..', '..', 'client', 'public')));
let maybeCredentials = credentials_1.getZBClient();
/**
 * Credentials endpoints
 */
exports.app.post('/camundaCloudClusterCredentials', (req, res) => {
    if (!req.files || !req.files.credentials) {
        return res.status(400).send('Missing credentials file');
    }
    const credentialsData = req.files.credentials;
    maybeCredentials = credentials_1.setCredentials(credentialsData.data.toString());
    res.json({ exists: true });
});
exports.app.get('/camundaCloudClusterConnection', async (_, res) => maybeCredentials.exists ?
    res.json({ exists: true, topology: await maybeCredentials.zbc.topology() }) : res.json({ exists: false }));
exports.app.get("/sendGridSenderEmail", async (_, res) => {
    res.json({ senderEmail: process.env.SENDGRID_SENDER_EMAIL });
});
exports.app.post("/sendGridSenderEmail", async (req, res) => {
    const { senderEmail } = req.body;
    credentials_1.setConfig([['SENDGRID_SENDER_EMAIL', senderEmail]]);
    res.sendStatus(200);
});
exports.app.get("/sendGridApiKey", async (_, res) => {
    res.json({ exists: !!credentials_1.getSendGridApiKey() });
});
exports.app.post("/sendGridApiKey", (req, res) => {
    const { key } = req.body;
    credentials_1.setConfig([['SENDGRID_API_KEY', key]]);
    res.sendStatus(200);
});
exports.app.get('/scenarios', (_, res) => res.json({ scenarios: scenarios_1.scenarios, scenarioNames: scenarios_1.scenarioNames }));
exports.app.get('/confirm', (_, res) => {
    res.send("Confirmed your subscription!");
});
exports.server = exports.app.listen(port, () => console.log(`REST Server listening on http://localhost:${port}`));
