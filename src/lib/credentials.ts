import fs from 'fs'
import { config } from 'dotenv'
import { ZBClient } from 'zeebe-node'

interface ClientCredentials {
    zeebeAddress: undefined | string,
    zeebeClientId: undefined | string,
    zeebeClientSecret: undefined | string,
    zeebeAuthorizationServerUrl: undefined | string
}

const clientCredentials: ClientCredentials = {
    zeebeAddress: undefined,
    zeebeClientId: undefined,
    zeebeClientSecret: undefined,
    zeebeAuthorizationServerUrl: undefined
}

let zbc: ZBClient | undefined;

export function getSendGridApiKey() {
    config()
    return process.env.SENDGRID_API_KEY!;
}

/**
 * 
 * This uses the zero-conf constructor to read the Camunda Cloud credentials from the environment
 */
export function getZBClient(): MaybeClientCredentials {
    // Read the .env file into the environment
    config()
    const zeebeAddress = process.env.ZEEBE_ADDRESS!
    const zeebeClientId = process.env.ZEEBE_CLIENT_ID!
    const zeebeClientSecret = process.env.ZEEBE_CLIENT_SECRET!
    const zeebeAuthorizationServerUrl = process.env.ZEEBE_AUTHORIZATION_SERVER_URL!

    if (!zeebeAddress || !zeebeClientId || !zeebeClientSecret || !zeebeAuthorizationServerUrl) {
        console.log('Client credentials missing in environment. Please set in .env or upload from client application.')
        return { exists: false, value: null }
    }

    if (zeebeAddress !== clientCredentials.zeebeAddress || zeebeClientId !== clientCredentials.zeebeClientId || zeebeClientSecret !== clientCredentials.zeebeClientSecret) {
        console.log(`Retrieved cluster credentials from the environment.`)
        zbc?.close()
        zbc = new ZBClient()
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
        zbc: zbc!
    }
}

export function setConfig(config: [key: string, value: string][]) {
    const envFileExists = fs.existsSync(`.env`)
    const existingContent = envFileExists ? fs.readFileSync('.env', 'utf-8') : ''
    const removeExistingConfig = (pair: [key: string, value: string], config: string) => config.split('\n').filter(l => !l.trimStart().startsWith(pair[0])).join('\n')
    const scrubbedContent = config.reduce((prev, curr) => removeExistingConfig(curr, prev), existingContent)
    const newContent = config.reduce((prev, pair) => `${prev}
${pair[0]}=${pair[1]}`, scrubbedContent)

    if (envFileExists) {
        backupEnv();
    }
    fs.writeFileSync('.env', newContent)
}

export function setCredentials(credentialsFile: string) {
    // Strip out leading 'export' from all lines and write credentials to .env
    const normalisedCredentials = credentialsFile
        .split('\n')
        .map(l => l.startsWith('export ') ? l.replace('export ', '') : l)
        .map((l): [key: string, value: string] => {
            const key: string = l.split('=')[0]
            const value: string = l.replace(`${key}=`, '')
            return [key, value]
        })

    setConfig(normalisedCredentials)
    return getZBClient()
}

function backupEnv() {
    let prefix = 1;
    const name = (num: number) => `.env_${num.toString().padStart(3, '0')}`
    while (fs.existsSync(name(prefix))) {
        prefix++
    }
    fs.renameSync('.env', name(prefix))
}

type MaybeClientCredentials = {
    exists: false;
    value: null
} | {
    exists: true;
    value: ClientCredentials,
    zbc: ZBClient
}
