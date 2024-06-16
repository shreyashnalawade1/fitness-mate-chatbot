const PushNotifications = require("node-pushnotifications");

class PushNotifier{
    constructor(){
    if(PushNotifier.instance){
        return PushNotifier.instance;
    }
    this.settings = {
        web: {
          vapidDetails: {
            subject: "mailto: <shreyashnalawade01@gmail.com>", // REPLACE_WITH_YOUR_EMAIL
            publicKey:process.env.PUSH_NOTIFICATION_PUBLIC,
            privateKey: process.env.PUSH_NOTIFICATION_PRIVATE,
          },
          gcmAPIKey: "gcmkey",
          TTL: 2419200,
          contentEncoding: "aes128gcm",
          headers: {},
        },
        isAlwaysUseFCM: false,
      };
    }

    static getInstance(){
        if(!PushNotifier.instance){
            PushNotifier.instance=new PushNotifier();
        }
        return PushNotifier.instance;
    }

    async sendTextPushNotification(subscription,payload){
        try{
            const push = new PushNotifications(this.settings);
            push.send(subscription, payload, (err, result) => {
                if (err) {
                  console.log(err[0].message);
                  throw err;
                } else {
                  console.log(result);
                }
              });
        }catch(error){
            console.log(error);
        }
    }
}


module.exports=PushNotifier