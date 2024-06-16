const cluster = require("cluster");
const numCPUs = require('os').availableParallelism();
const app = require("./server.js")
const connectDb = require("./config/dbconnect.js");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { sendNotification } = require("./utils/notification.js");

const port = process.env.PORT || 5000;

// console.log("availableParallelism: ",numCPUs);
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }

  //Detect When a Worker Dies, the following code will listen to that event and then it will create a new worker.
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
}
else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  io.on('connection',(socket)=>{
    console.log(socket.id); 
    socket.on('join_room',(user_id)=>{
      console.log(user_id);
      socket.join(user_id);
    })
    socket.on('new_msg_user',(data)=>{
      console.log(data);
      io.to(data.to).emit('new_msg',data);
    })
  })

  server.listen(port, async() => {
    console.log(`Server is running on port ${port}`);
  });
  // console.log(`Worker ${process.pid} started`);
}
