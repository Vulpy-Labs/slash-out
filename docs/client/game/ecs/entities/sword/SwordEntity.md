# SwordEntity Documentation

## Overview

Defines the component structure for sword entities.

---

## Technical Identity

- **Type:** Entity
- **Domain:** Weapon Composition

---

## Responsibilities

- Specifies required components for sword entities
- Extends base entity structure

---

## Data Schema

### Components

- `keymap`: KeymapComponent - Maps input keys
- `input`: InputComponent - Tracks input state
- `state`: StateComponent - Manages current state
- `sprite`: Phaser.Physics.Matter.Sprite - Visual representation

### Inherited Components

- `entityId`: string - Unique identifier
- `entityType`: EntityTypes - Entity classification

---

## Lifecycle & Execution Flow

N/A (Pure type definition)

---

## Methods

N/A (Pure type definition)

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `BaseEntity`: Provides base entity structure
- **Related Systems:**
  - `StateSystem`: Processes state transitions
  - `WeaponBuilder`: Creates sword entities

---

## Maintenance Notes

> [!WARNING]
> **Consistency:** Must match component structure used by SwordWeaponHandler
