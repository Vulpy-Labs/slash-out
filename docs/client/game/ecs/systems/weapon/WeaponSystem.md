# WeaponSystem Documentation

## Overview

Orchestrates weapon behavior by delegating to type-specific handlers. Maintains a map of weapon handlers and routes updates to the appropriate handler based on entity type.

---

## Technical Identity

- **Type:** System  
- **Domain:** Weapon Management  

---

## Responsibilities

- Maintains weapon handler registry
- Routes entity updates to proper handlers
- Ensures type-safe weapon processing

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `entityType`: Determines handler selection
- **Writes:** N/A (Delegates to handlers)

### Configuration Props

- `handlers`: Map of weapon type to handler instances
- `WeaponSystemUpdateProp`: Update method parameter type

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Registers default weapon handlers
2. **Update Loop:**
   - Routes each entity to its handler
   - Delegates update logic

---

## Methods

### `constructor()`

**Description:** Initializes weapon system

**Flow:**
- Creates handlers map
- Registers default handlers

**Side Effects:**
- Initializes handler instances

### `update({ entities }: WeaponSystemUpdateProp): void`

**Description:** Main update method

**Flow:**
- Iterates through entities
- Finds matching handler
- Delegates update

**Side Effects:**
- Invokes handler updates

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `IWeaponSystemHandler` interface
  - `EntityTypes` constants
  - `ENTITY_TYPES` enum
- **Related Systems:**
  - `SwordWeaponSystemHandler`: Handles sword weapon logic
  - `StateSystem`: Determines weapon states

---

## Maintenance Notes

> [!NOTE]  
> **Extensibility:** Add new weapon types by registering additional handlers
