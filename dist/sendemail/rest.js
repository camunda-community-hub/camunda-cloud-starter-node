"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestEndpoints = void 0;
const process_1 = require("./process");
function createRestEndpoints({ app, zbc, zeebeAddress }) {
    app.post('/sendemail', async (req, res) => {
        console.log(req.body);
        const { name, email } = req.body;
        const pi = await process_1.startProcessInstance(zbc, { name, email });
        res.json(pi);
    });
}
exports.createRestEndpoints = createRestEndpoints;
