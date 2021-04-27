import { ZBClient, Duration } from "zeebe-node";
import { config } from "dotenv";
import got from "got";
import Dayjs from "dayjs";

config();

const zbc = new ZBClient({
  longPoll: Duration.minutes.of(10),
});

zbc.createWorker<EmailTaskVariables, EmailTaskHeaders>({
  taskType: "send-email",
  taskHandler: async (job) => {
    const {
      customHeaders: { templateName },
    } = job;

    const time = await got("https://json-api.joshwulf.com/time").json();
    console.log(time);
    return job.complete({ time });
  },
  timeout: Duration.minutes.of(5),
});

setInterval(() => {
  console.log(
    Dayjs().toString(),
    "Memory: " + (process.memoryUsage().rss / 1024 / 1024).toFixed(1) + "M"
  );
}, Duration.milliseconds.from(Duration.minutes.of(5)));

interface EmailTaskHeaders {
  templateName: string;
}

interface EmailTaskVariables {
  email: string;
}
