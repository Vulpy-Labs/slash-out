# Airborne Handler Documentation

## Overview

The `AirborneHandler` handles player state transitions while in airborne (jumping/falling) state.

---

## Technical Identity

- **Type:** Handler
- **Domain:** State Management

---

## Responsibilities

- Manages state transitions during airborne movement
- Delegates combat state resolution

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `InputComponent`: Player inputs
- **Writes:**
  - `StateComponent`: Updates current state

### Configuration Props

- `AirborneHandlerResolveProp` (`*.p.ts`):
  - `state: StateComponent`: Current state
  - `input: InputComponent`: Player inputs

---

## Methods

### `resolve({ state, input }: AirborneHandlerResolveProp)`

**Description:** Resolves airborne state transitions

**Flow:**

1. Checks for combat actions via `CombatHelper`
2. Sets combat state if detected
3. Defaults to JUMP state

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
> Called every frame when player is airborne
