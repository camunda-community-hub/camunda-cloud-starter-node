"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestEndpoints = void 0;
const process_1 = require("./process");
function createRestEndpoints({ app, zbc, zeebeAddress }) {
    app.post('/parallelMultiInstance', async (req, res) => {
        console.log(req.body);
        const { files } = req.body;
        const processInstanceWithResult = await process_1.startProcessInstance(zbc, { files });
        res.json(processInstanceWithResult);
    });
}
exports.createRestEndpoints = createRestEndpoints;
