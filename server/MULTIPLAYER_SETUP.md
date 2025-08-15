# Colyseus Multiplayer Setup Guide

This guide explains how Colyseus has been integrated into your Phaser game for multiplayer functionality.

## What's Been Set Up

### 1. Client-Side Changes

- **Added Colyseus client**: `colyseus.js` package installed
- **NetworkManager**: Singleton class to manage server connections
- **Updated Preloader**: Now connects to Colyseus server before starting the game
- **Updated TestScene**: Handles multiplayer player synchronization
- **Network Types**: TypeScript interfaces for network communication

### 2. Server-Side Changes

- **Updated MyRoom**: Now handles position updates from clients
- **Player synchronization**: Other players' positions are broadcast to all clients

### 3. Key Features

- **Room Connection**: Players automatically join a room when the game starts
- **Position Sync**: Player positions are synchronized across all clients
- **Network Players**: Other players appear as green-tinted characters
- **Error Handling**: Connection errors are handled gracefully with retry logic

## How It Works

1. **Connection Flow**:
   - Preloader connects to Colyseus server
   - Player joins or creates a room
   - TestScene starts with network data
   - Player position updates are sent every 100ms

2. **Player Synchronization**:
   - Your character position is sent to the server
   - Server broadcasts positions to all other clients
   - Other players appear as network characters in your game

## Starting the System

### Start the Server
```bash
cd server
npm run start
```

### Start the Client
```bash
cd client
npm run dev
```

The client will connect to `ws://localhost:2567` in development mode.

## Network Events

### Client to Server
- `updatePosition`: Sends player position updates

### Server to Client
- Player additions/removals through state synchronization
- Position updates through state changes

## Configuration

### Server URL
Update in `NetworkManager.ts`:
```typescript
this.client = new Client('ws://localhost:2567'); // Development
this.client = new Client('wss://your-server.com'); // Production
```

### Update Rate
Modify in `TestScene.setupPositionSync()`:
```typescript
delay: 100, // Change update frequency (milliseconds)
```

## Testing Multiplayer

1. Start the server
2. Open multiple browser tabs/windows
3. Each tab will connect as a different player
4. Move your character - you should see it move in other tabs
5. Other players appear as green characters

## Network Player Features

- **Visual Distinction**: Network players are tinted green
- **Smooth Movement**: Positions are interpolated for smooth updates
- **Automatic Cleanup**: Players are removed when they disconnect

## Troubleshooting

### Connection Issues
- Ensure the server is running on port 2567
- Check browser console for WebSocket errors
- Verify the server URL in NetworkManager

### Position Sync Issues
- Check if position updates are being sent (console logs)
- Verify the server is receiving `updatePosition` messages
- Ensure character exists before sending updates

## Next Steps

To extend multiplayer functionality, consider adding:

1. **Player Names**: Add name field to Player schema
2. **Actions Sync**: Synchronize attacks, jumps, etc.
3. **Game State**: Sync bullets, sword attacks
4. **Authentication**: Add player authentication
5. **Rooms**: Multiple game rooms/levels
6. **Spectator Mode**: Allow observers

## File Structure

```
client/
├── src/game/
│   ├── network/
│   │   └── NetworkManager.ts      # Connection management
│   ├── types/
│   │   └── NetworkTypes.ts        # Type definitions
│   └── scenes/
│       ├── Preloader.ts           # Connection setup
│       └── arenas/test.ts         # Multiplayer game logic
server/
├── src/
│   ├── rooms/
│   │   ├── MyRoom.ts              # Room logic
│   │   └── schema/
│   │       └── MyRoomState.ts     # State schema
│   └── app.config.ts              # Server config
```
