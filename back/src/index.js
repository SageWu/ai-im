const http = require("http");
const io = require("socket.io");
const { isFreePort } = require("find-free-ports");
const constants = require("./constants");
const utils = require("./utils");

const server = http.createServer();
const socket = io(server, {
  cors: {
    origin: "*"
  }
});
socket.on("connection", handleConnection);

function handleConnection(client) {
  clientInit(client);

  // 用户加入客服房间
  client.on(constants.EVENT_MAP.join, handleJoin(client));
  // 发送消息
  client.on(constants.EVENT_MAP.send, handleSend(client));
}

function clientInit(client) {
  const { query } = client.handshake;
  switch (query.type) {
    case "user": {
      // 向用户推送在线客服列表
      client.emit(constants.EVENT_MAP.cs, constants.CS_IDS);
      break;
    }
    case "cs": {
      // 客服加入自己的房间等待消息
      const room = `${constants.CUSTOM_ROOM_PREFIX}-${query.userId}`;
      client.join(room);
      break;
    }
  }
}

function handleJoin(client) {
  return (data) => {
    const room = `${constants.CUSTOM_ROOM_PREFIX}-${data.target}`;
    client.join(room);
  };
}

function handleSend(client) {
  return async (socketId, data) => {
    try {
      // 消息内容预处理
      // data = await utils.processMessageData(data);
  
      if (socketId) { // 客服回复消息给指定用户
        client.to(socketId).compress(true).emit(constants.EVENT_MAP.message, data);
      } else {  // 客户发送消息到加入的客服房间
        data.socketId = client.id;
        const rooms = Array.from(client.rooms)
          .filter((value) => value.startsWith(constants.CUSTOM_ROOM_PREFIX));
        rooms.forEach((room) => {
          client.to(room).compress(true).emit(constants.EVENT_MAP.message, data);
        });

        // 如果为文本，则进行关键字提取并推荐答复
        let recomText;
        if (data.typeStr === "text") {
          recomText = await utils.getRecommandText(data.data);
        }
        if (recomText) {
          rooms.forEach((room) => {
            client.to(room).compress(true).emit(constants.EVENT_MAP.recom, {
              creator: data.creator,
              data: recomText,
            });
          });
        }
      }
    } catch (err) {
      console.error("消息发送失败", err.message);      
    }
  }
}

// 开启服务
async function start() {
  const res = await isFreePort(2000);
  if (res) {
    server.listen(2000, (err) => {
      if (err) {
        console.error("服务启动失败", err);
      } else {
        console.info("服务开始监听");
      }
    });
  } else {
    console.error("端口被占用，请稍后重试");
    // setTimeout(start, 3000);
    process.exit();
  }
}
start();

// 结束服务
let isClosing = false;
function close() {
  if (isClosing) return;
  isClosing = true;

  console.info("服务结束");
  socket.disconnectSockets();
  server.close((err) => {
    if (err) {
      console.error("服务关闭失败", err.message);
      return;
    }
    console.info("服务结束成功");
    isClosing = false;
    process.exit();
  });
}
process.on("SIGUSR2", close);
process.on("SIGINT", close);