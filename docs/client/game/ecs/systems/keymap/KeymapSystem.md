# Keymap System Documentation

## Overview

The `KeymapSystem` creates and manages Phaser keyboard listeners that map physical keys to game actions.

---

## Technical Identity

- **Type:** System
- **Domain:** Input

---

## Responsibilities

- Initializes Phaser keyboard listeners
- Maps key codes to game actions
- Provides raw input states to other systems

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `KeymapComponent`: Accesses configured key codes
- **Writes:**
  - `KeymapComponent`: Populates listeners map with Phaser Key objects

### Configuration Props

- `KeymapSystemProp` (`*.p.ts`): Requires Phaser Scene reference
- `CreatePhaserListenersProp` (`*.p.ts`): Takes entities map for initialization

---

## Lifecycle & Execution Flow

1. **Initialization:** Stores scene reference
2. **Setup:** Creates Phaser keyboard listeners
3. **Teardown:** N/A (Phaser manages listeners)

---

## Methods

### `createPhaserListeners({ entities }: CreatePhaserListenersProp): void`

**Description:** Initializes keyboard listeners for all entities

**Flow:**

- Gets Phaser keyboard instance
- For each entity:
  - Maps configured key codes to Phaser Key objects
  - Stores listeners in KeymapComponent
- Skipped if:
  - No `KeymapComponent` present

**Side Effects:**

- Creates `Phaser.Key` objects via `scene.input.keyboard.addKey()`
- Populates component with input state trackers

---

## Dependencies & Relationships

- **Core Dependencies:** `Phaser.Input.Keyboard`
- **Related Systems:**
  - `InputSystem`: Consumes raw key states
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]
>
> **Performance:** Runs once at setup, not in update loop  
> **Key Conflicts:** Does not prevent duplicate key assignments across entities
