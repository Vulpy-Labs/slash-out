# Player State Handler Documentation

## Overview

The `PlayerStateHandler` is responsible for managing and transitioning between different player states based on mobility (grounded vs airborne) and input. It acts as a state machine controller within the ECS architecture, ensuring proper state transitions for player entities.

---

## Technical Identity

- **Type:** Handler  
- **Domain:** State Management  

---

## Responsibilities

- Ensures only valid player entities are processed  
- Determines player mobility state (grounded or airborne)  
- Delegates state resolution to appropriate handlers (`GroundedHandler`/`AirborneHandler`)  
- Maintains separation of concerns between grounded and airborne states  
- Manages attack state expiration and input lockout  

---

## Data Schema

### Manipulated Components

- **Reads:**  
  - `StateComponent`: Checks current state and ticker  
  - `InputComponent`: Evaluates player input  
  - `Phaser.Physics.Matter.Sprite`: Determines mobility state via `getMobility()`  
- **Writes:**  
  - `StateComponent`: Updates current state and attack lock status  

### Configuration Props

- `PlayerStateHandlerUpdateProp`: Contains the entity to be processed  

---

## Lifecycle & Execution Flow

1. **Initialization:** Creates `GroundedHandler` and `AirborneHandler` instances  
2. **Update Loop:**  
   - Validates entity  
   - Checks active ticker state  
   - Resets expired attack states  
   - Updates attack lock status  
   - Determines effective input  
   - Delegates to appropriate handler based on mobility  
3. **Teardown:** N/A  

---

## Methods

### `update({ entity }: PlayerStateHandlerUpdateProp): void`

**Description:** Main update method that processes player state transitions  

**Flow:**  
1. Validates entity contains required components  
2. Checks and decrements active ticker if present  
3. Resets expired attack states  
4. Updates attack lock status  
5. Determines effective input (accounting for lockout)  
6. Determines mobility state  
7. Delegates to appropriate handler  

**Side Effects:**  
- Modifies `StateComponent.current`  
- Updates `StateComponent.isAttackSpamming`  
- Updates `StateComponent.ticker`  

### `private resetExpiredAttackState({ state }: { state: StateComponent }): void`

**Description:** Resets attack states to IDLE when expired  

**Flow:**  
1. Checks if current state is an attack state  
2. Resets to IDLE if true  

**Side Effects:**  
- Modifies `StateComponent.current`  

### `private updateAttackLockState({ state, input }: { state: StateComponent; input: InputComponent }): void`

**Description:** Manages attack input lockout state  

**Flow:**  
1. Resets lock if no sword input  
2. Sets lock and ticker if sword input detected  

**Side Effects:**  
- Modifies `StateComponent.isAttackSpamming`  
- Modifies `StateComponent.ticker`  

### `private getEffectiveInput({ state, input }: { state: StateComponent; input: InputComponent }): InputComponent`

**Description:** Returns modified input accounting for attack lockout  

**Flow:**  
1. Returns input with sword/gun disabled if locked  
2. Returns original input otherwise  

**Side Effects:** None  

### `private resolvePlayerMobilityState({ state, sprite, input }: { state: StateComponent; sprite: Phaser.Physics.Matter.Sprite; input: InputComponent }): void`

**Description:** Delegates to appropriate mobility handler  

**Flow:**  
1. Determines mobility via `getMobility()`  
2. Delegates to `GroundedHandler` or `AirborneHandler`  

**Side Effects:**  
- Indirectly modifies `StateComponent.current` via handlers  

### `private isValidPlayer(entity: GlobalEntity): entity is ValidPlayerEntity`

**Description:** Type guard for valid player entities  

**Flow:**  
1. Checks for required components (`input`, `state`, `sprite`)  

**Side Effects:** None  

### `private resolvePlayerMobilityState({ state, sprite, input }: { state: StateComponent; sprite: Phaser.Physics.Matter.Sprite; input: InputComponent }): void`

**Description:** Delegates to appropriate mobility handler

**Flow:**
1. Determines mobility via getMobility()
2. Delegates to GroundedHandler or AirborneHandler

**Side Effects:**
- Indirectly modifies StateComponent.current via handlers

---

## Dependencies & Relationships

- **Core Dependencies:**  
  - `CHARACTER_STATE`, `CHARACTER_COMBAT`, `MOBILITY` constants  
  - `getMobility()`, `isTickerActive()`, `decrementStateTicker()` utilities  
  - `GroundedHandler`, `AirborneHandler`  
- **Related Systems:**  
  - `StateSystem`: Receives state updates from this handler  
- **Events Consumed/Emitted:** N/A  

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** This handler runs on the `update` loop. Keep mobility checks lightweight.  

> [!NOTE]  
> **State Management:** Attack states automatically expire after `CHARACTER_COMBAT.ATTACK.DURATION_TICKS`  
