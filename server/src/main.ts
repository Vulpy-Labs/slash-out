import 'reflect-metadata';
import { Server } from 'colyseus';
import { RoomManager } from './room';

const port = parseInt(process.env.PORT ?? '', 10) || 2567;

try {
  const gameServer = new Server();

  gameServer.define('my_room', RoomManager);

  gameServer
    .listen(port)
    .then(() => {
      console.log(`✅ [GameServer] Listening on Port: ${port}`);
    })
    .catch(error => {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    });
} catch (error) {
  console.error('❌ Fatal error during server setup:', error);
  process.exit(1);
}

// Catch uncaught errors
process.on('uncaughtException', error => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
