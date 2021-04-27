"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zeebe_node_1 = require("zeebe-node");
const dotenv_1 = require("dotenv");
const got_1 = __importDefault(require("got"));
const dayjs_1 = __importDefault(require("dayjs"));
dotenv_1.config();
const zbc = new zeebe_node_1.ZBClient({
    longPoll: zeebe_node_1.Duration.minutes.of(10),
});
zbc.createWorker({
    taskType: "send-email",
    taskHandler: async (job) => {
        const { customHeaders: { templateName }, } = job;
        const time = await got_1.default("https://json-api.joshwulf.com/time").json();
        console.log(time);
        return job.complete({ time });
    },
    timeout: zeebe_node_1.Duration.minutes.of(5),
});
setInterval(() => {
    console.log(dayjs_1.default().toString(), "Memory: " + (process.memoryUsage().rss / 1024 / 1024).toFixed(1) + "M");
}, zeebe_node_1.Duration.milliseconds.from(zeebe_node_1.Duration.minutes.of(5)));
