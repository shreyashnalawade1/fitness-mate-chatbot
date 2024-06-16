const Queue=require('bull')
const reminderQueue=new Queue('reminder',{
    redis:{
  password: process.env.REDDIS_PASSWORD,
      host:process.env.REDDIS_HOST,
      port:15429
    }
  });
  
module.exports.sendNotification=async function(payload){
    console.log(process.env.REDDIS_PASSWORD,process.env.REDDIS_HOST); 
    reminderQueue.add(payload);
}
// {type:"wp",msg:"This is a reminder from email",to:"whatsapp:+919359914896"}