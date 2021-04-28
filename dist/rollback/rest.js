"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestEndpoints = void 0;
const process_1 = require("./process");
function createRestEndpoints({ app, zbc, zeebeAddress }) {
    app.post('/rollback', async (req, res) => {
        const { payload } = req.body;
        const processInstanceWithResult = await process_1.startProcessInstance(zbc, { metadata: payload });
        res.json(processInstanceWithResult);
    });
}
exports.createRestEndpoints = createRestEndpoints;
