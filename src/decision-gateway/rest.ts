import { ZBClient } from "zeebe-node";
import express from 'express'
import { startProcessInstance } from "./process";

export function createRestEndpoints({ app, zbc, zeebeAddress }: { zbc: ZBClient, app: express.Application, zeebeAddress: string | undefined }) {
    app.post('/decisionGateway', async (req, res) => {
        console.log(req.body)
        const { hasAttachment } = req.body
        const processInstanceWithResult = await startProcessInstance(zbc, { hasAttachment })
        res.json(processInstanceWithResult)
    })
}