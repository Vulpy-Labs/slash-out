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

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `StateComponent`: Checks current state
  - `InputComponent`: Evaluates player input
  - `VelocityComponent`: Indirectly used by `getMobility()` utility
  - `Phaser.Physics.Matter.Sprite`: Determines mobility state via `getMobility()`
- **Writes:**
  - `StateComponent`: Explicitly sets to validated `CharacterState` from handler resolution

### Configuration Props

- `PlayerStateHandlerUpdateProp` (`*.p.ts`): Contains the entity to be processed

---

## Lifecycle & Execution Flow

1. **Initialization:** Creates `GroundedHandler` and `AirborneHandler` instances
2. **Update Loop:**
   - Validates entity
   - Determines mobility state
   - Delegates to appropriate handler
3. **Teardown:** N/A

---

## Methods

### `update({ entity }: PlayerStateHandlerUpdateProp): void`

**Description:** Main update method that processes player state transitions

**Flow:**

1. Validates entity contains required components (input, state, sprite)
2. Determines mobility state via `getMobility(sprite)` (GROUNDED/AIRBORNE)
3. Delegates to appropriate handler based on mobility:
   - `GroundedHandler`: Handles ground-based states (walk/idle/combat)
   - `AirborneHandler`: Handles air-based states (jump/falling/airborne-attack)

**Implementation Details:**

- Uses type guard for safe entity validation
- Returns early if entity is invalid
- Handler selection is strictly based on mobility state
- Delegates actual state resolution to specialized handlers

**Side Effects:**

- Modifies `StateComponent.current` based on handler resolution

---

### `private isValidPlayer(entity: GlobalEntity): entity is ValidPlayerEntity`

**Description:** Type guard that validates player entity structure

**Flow:**

1. Checks entity has all required components:
   - `input`: Player input configurations
   - `state`: Current state tracking
   - `sprite`: Physics body representation
2. Returns type-predicated boolean for type safety

**Side Effects:**

N/A

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `getMobility()` physics utility
  - `MOBILITY` and `CHARACTER_STATE` constants
  - `Phaser.Physics.Matter.Sprite` (Runtime physics body type)
- **Related Systems:**
  - `StateSystem`: Receives state updates from this handler
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** This handler runs on the `update` loop. Keep mobility checks lightweight.
