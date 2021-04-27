"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorkers = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const templates_1 = require("./templates");
const credentials_1 = require("../lib/credentials");
const Mailgen = require("mailgen");
const { render } = require('micromustache');
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Camunda Cloud',
        link: 'https://camunda.io',
    },
});
function startWorkers(zbc) {
    console.log('Starting worker for Send Email scenario...');
    zbc.createWorker({
        taskType: 'send-email',
        taskHandler: job => {
            console.log('Received job for send-email', job.variables);
            mail_1.default.setApiKey(credentials_1.getSendGridApiKey());
            const from = process.env.SENDGRID_SENDER_EMAIL;
            if (!from) {
                console.log("Warning: no SENDGRID_SENDER_EMAIL set in environment. SendGrid will reject this email.");
            }
            const { email, name } = job.variables;
            const { templateName } = job.customHeaders;
            const template = templates_1.templates[templateName];
            if (!template) {
                return job.fail(`Template ${templateName} not found!`);
            }
            const emailBody = mailGenerator.generate(template);
            const emailText = mailGenerator.generatePlaintext(template);
            const emailHtml = render(emailBody, {
                email,
                name,
                baseUrl: 'http://localhost:3000',
            });
            const msg = {
                to: email,
                from: from,
                subject: 'Email from Camunda Cloud Starter',
                text: emailText,
                html: emailHtml
            };
            return mail_1.default.send(msg).then(() => job.complete())
                .catch(e => job.fail(e.toString()));
        }
    });
}
exports.startWorkers = startWorkers;
