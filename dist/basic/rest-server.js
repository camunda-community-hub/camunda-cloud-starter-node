"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const credentials_1 = require("./credentials");
const app = express_1.default();
const port = 3000;
app.use(express_1.default.json());
app.use(express_fileupload_1.default({
    useTempFiles: false,
}));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', '..', 'client', 'public')));
let maybeCredentials = credentials_1.hydrateCredentials();
app.post('/camundaCloudClusterCredentials', (req, res) => {
    if (!req.files || !req.files.credentials) {
        return res.status(400).send('Missing credentials file');
    }
    const credentialsData = req.files.credentials;
    maybeCredentials = credentials_1.setCredentials(credentialsData.data.toString());
    res.json({ exists: true });
});
app.get('/camundaCloudClusterCredentials', async (_, res) => maybeCredentials.exists ?
    res.json({ exists: true, topology: await maybeCredentials.zbc.topology() }) : res.json({ exists: false }));
app.listen(port, () => console.log(`REST Server listening on http://localhost:${port}`));
