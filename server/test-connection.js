import { Client, Room } from "colyseus.js";

const client = new Client("wss://slash-out-production.up.railway.app");
client
  .joinOrCreate("my_room")
  .then((room) => console.log("Connected!", room.roomId));
