import { ZBClient, ZBWorker } from "zeebe-node";
import mail from '@sendgrid/mail';
import { templates } from "./templates";
import { getSendGridApiKey } from "../lib/credentials";
import Mailgen = require('mailgen');
import { WelcomeEmailPayload } from "./process";
const { render } = require('micromustache');


const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Camunda Cloud',
        link: 'https://camunda.io',
    },
});

interface WelcomeEmailHeaders {
    templateName: string
}

export function startWorkers(zbc: ZBClient) {
    console.log('Starting worker for Basic scenario...')
    zbc.createWorker<WelcomeEmailPayload, WelcomeEmailHeaders>({
        taskType: 'send-email',
        taskHandler: job => {
            console.log('Received job for send-email', job.variables)
            mail.setApiKey(getSendGridApiKey());
            const from = process.env.SENDGRID_SENDER_EMAIL;

            if (!from) {
                console.log("Warning: no SENDGRID_SENDER_EMAIL set in environment. SendGrid will reject this email.")
            }

            const { email, name } = job.variables;
            const { templateName } = job.customHeaders;
            const template = templates[templateName]
            if (!template) {
                return job.fail(`Template ${templateName} not found!`)
            }

            const emailBody = mailGenerator.generate(template)
            const emailText = mailGenerator.generatePlaintext(template);

            const emailHtml = render(emailBody, {
                email,
                name,
                baseUrl: 'http://localhost:3000',
            });
            const msg = {
                to: email,
                from: from!,
                subject: 'Email from Camunda Cloud Starter',
                text: emailText,
                html: emailHtml
            }

            return mail.send(msg).then(() => job.complete())
                .catch(e => job.fail(e.toString()))
        }
    })
}
