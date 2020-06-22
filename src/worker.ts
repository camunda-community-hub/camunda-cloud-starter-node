import { ZBClient } from "zeebe-node";
import { config } from "dotenv";
import got from "got";

config();

const zbc = new ZBClient();

zbc.createWorker("get-time", async (job, complete) => {
  const time = await got("https://json-api.joshwulf.com/time").json();
  console.log(time);
  complete.success({ time });
});

zbc.createWorker("make-greeting", (job, complete) => {
  const { greeting } = job.customHeaders;
  const { name } = job.variables;
  const say = `${greeting} ${name}`;
  console.log(say);
  complete.success({ say });
});
