import express from 'express'
import path from 'path'
import fileUpload from 'express-fileupload'
import { getSendGridApiKey, getZBClient, setConfig, setCredentials } from '../lib/credentials';
import { scenarioNames, scenarios } from '../lib/scenarios';

export const app = express()
const port = 3000

app.use(express.json());
app.use(fileUpload({
    useTempFiles: false,
}));

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'public')))

let maybeCredentials = getZBClient()

/**
 * Credentials endpoints
 */
app.post('/camundaCloudClusterCredentials', (req, res) => {
    if (!req.files || !req.files.credentials) {
        return res.status(400).send('Missing credentials file')
    }
    const credentialsData: fileUpload.UploadedFile = req.files.credentials as fileUpload.UploadedFile
    maybeCredentials = setCredentials(credentialsData.data.toString()!)
    res.json({ exists: true })
})
app.get('/camundaCloudClusterConnection', async (_, res) =>
    maybeCredentials.exists ?
        res.json({ exists: true, topology: await maybeCredentials.zbc.topology() }) : res.json({ exists: false })
);

app.get("/sendGridSenderEmail", async (_, res) => {
    res.json({ senderEmail: process.env.SENDGRID_SENDER_EMAIL })
})
app.post("/sendGridSenderEmail", async (req, res) => {
    const { senderEmail } = req.body;
    setConfig([['SENDGRID_SENDER_EMAIL', senderEmail]])
    res.sendStatus(200)
})
app.get("/sendGridApiKey", async (_, res) => {
    res.json({ exists: !!getSendGridApiKey() })
});
app.post("/sendGridApiKey", (req, res) => {
    const { key } = req.body
    setConfig([['SENDGRID_API_KEY', key]])
    res.sendStatus(200)
})

app.get('/scenarios', (_, res) => res.json({ scenarios, scenarioNames }));

app.get('/confirm', (_, res) => {
    res.send("Confirmed your subscription!")
})

export const server = app.listen(port, () => console.log(`REST Server listening on http://localhost:${port}`));

