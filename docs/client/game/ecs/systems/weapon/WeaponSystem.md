# Weapon System Documentation

## Overview

The `WeaponSystem` manages weapon-specific behavior by delegating to appropriate handlers based on entity type.

---

## Technical Identity

- **Type:** System
- **Domain:** Weapon Management

---

## Responsibilities

- Routes weapon updates to appropriate handlers
- Maintains handler map for different weapon types

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A

### Configuration Props

- `WeaponSystemUpdateProp` (`*.p.ts`): Contains entities map

---

## Lifecycle & Execution Flow

1. **Initialization:** Creates handler map
2. **Update Loop:**
   - Iterates through entities
   - Delegates to appropriate handler
3. **Teardown:** N/A

---

## Methods

### `update({ entities }: WeaponSystemUpdateProp): void`

**Description:** Main update method for weapon system

**Flow:**

1. Iterates through entities
2. Gets appropriate handler for entity type
3. Delegates update to handler

**Side Effects:**

- Modifies entities through handlers

### `constructor()`

**Description:** Initializes weapon system with handler map

**Flow:**
1. Creates handler map
2. Registers SwordWeaponSystemHandler and GunWeaponSystemHandler

**Side Effects:**
- Initializes internal handler map

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `ENTITY_TYPES` constant
  - `IWeaponSystemHandler` interface
- **Related Systems:**
  - `GunWeaponSystemHandler`: Handles gun entities
  - `SwordWeaponSystemHandler`: Handles sword entities
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** Runs in update loop. Keep handler delegation efficient.
