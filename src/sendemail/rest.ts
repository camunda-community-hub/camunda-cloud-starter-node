import { ZBClient } from "zeebe-node";
import express from 'express'
import { startProcessInstance } from "./process";

export function createRestEndpoints({ app, zbc, zeebeAddress }: { zbc: ZBClient, app: express.Application, zeebeAddress: string | undefined }) {
    app.post('/sendemail', async (req, res) => {
        console.log(req.body)
        const { name, email } = req.body
        const processInstance = await startProcessInstance(zbc, { name, email })
        res.json(processInstance)
    })
}