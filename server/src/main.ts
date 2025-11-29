import 'reflect-metadata';
import { Server } from 'colyseus';
import { RoomManager } from './room';

const port = parseInt(process.env.PORT ?? '', 10) || 2567;
const gameServer = new Server();

gameServer.define('my_room', RoomManager);
gameServer.listen(port);

console.log(`[GameServer] Listening on Port: ${port}`);
