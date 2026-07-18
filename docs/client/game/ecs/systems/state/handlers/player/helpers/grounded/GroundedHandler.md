# Grounded Handler Documentation

## Overview

The `GroundedHandler` handles player state transitions while in grounded state.

---

## Technical Identity

- **Type:** Handler
- **Domain:** State Management

---

## Responsibilities

- Manages state transitions during grounded movement
- Delegates combat state resolution
- Handles idle/run transitions

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `InputComponent`: Player inputs
- **Writes:**
  - `StateComponent`: Updates current state

### Configuration Props

- `GroundedHandlerResolveProp` (`*.p.ts`):
  - `state: StateComponent`: Current state
  - `input: InputComponent`: Player inputs

---

## Methods

### `resolve({ state, input }: GroundedHandlerResolveProp)`

**Description:** Resolves grounded state transitions

**Flow:**

1. Checks for combat actions via `CombatHelper`
2. Sets combat state if detected
3. Checks movement inputs for run/idle/facing direction transitions
4. Defaults to IDLE state

**Side Effects:**

- Modifies `state.current`

---

## Dependencies & Relationships

- **Core Dependencies:** N/A
- **Related Components:**
  - `StateComponent`: Modified state
- **Related Helpers:**
  - `CombatHelper`: Combat state resolution

---

## Maintenance Notes

> [!WARNING]  
> Called every frame when player is grounded
