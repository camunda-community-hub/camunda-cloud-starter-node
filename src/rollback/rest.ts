import { ZBClient } from "zeebe-node";
import express from 'express'
import { startProcessInstance } from "./process";

export function createRestEndpoints({ app, zbc, zeebeAddress }: { zbc: ZBClient, app: express.Application, zeebeAddress: string | undefined }) {
    app.post('/rollback', async (req, res) => {
        const { payload } = req.body
        const processInstanceWithResult = await startProcessInstance(zbc, { metadata: payload })
        res.json(processInstanceWithResult)
    })
}