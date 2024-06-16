const Queue=require('bull')

const init=async function(){
    console.log("FUCK")
    const reminderQueue=new Queue('reminder',{
        redis:{
          password: process.env.REDDIS_PASSWORD,
          host:process.env.REDDIS_HOST,
          port:15429
        }
      });
      
      reminderQueue.add({
        type: 'email',
        msg: 'A new reminder has been added',
        to: 'shreyashnalawade11@gmail.com'
      });
}
init();