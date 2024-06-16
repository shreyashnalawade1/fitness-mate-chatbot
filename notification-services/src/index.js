require("dotenv").config({path:".env"});
const Queue = require("bull");

// user defined
const EmailNotifier = require("./email/index");
const WhatsappNotifier = require("./whatsapp/index");
const PushNotifier = require("./pushNotification/index");
console.log(process.env.OAUTH_REFRESH_TOKEN)
const init = async function () {
  const reminderQueue = new Queue("reminder", {
    redis: {
      password: process.env.REDDIS_PASSWORD,
      host:process.env.REDDIS_HOST,
      port: 15429,
    },
  });

  reminderQueue.process(async (job) => {
    const { type } = job.data;
    console.log(type);
    if (type === "wp") {
      const { msg, to } = job.data;
      const WhatsappNotifierObject = WhatsappNotifier.getInstance();
      const wpMsg = {
        body: msg,
        from: "whatsapp:+14155238886",
        to: to,
      };
      const res = await WhatsappNotifierObject.sendTextMessage(wpMsg);
    } else if (type === "email") {
      const { msg, to } = job.data;

      let mailOptions = {
        from: "shreyashnalawade845@gmail.com",
        to: to,
        subject: "Reminder",
        text: msg,
      };

      const emailNotifierObject = EmailNotifier.getInstance();
      const res = await emailNotifierObject.sendTextEmail(mailOptions);
    } else if (type === "pushNotification") {
      const { to, msg } = job.data;
      const PushNotifierObject = PushNotifier.getInstance();
      const payload = { title: msg };
      const res = await PushNotifierObject.sendTextPushNotification(
        to,
        payload
      );
    }
  });
};

init()