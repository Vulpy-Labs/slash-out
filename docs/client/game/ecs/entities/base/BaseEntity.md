# Base Entity Documentation

## Overview

The `BaseEntity` defines the fundamental properties that all entities in the ECS system must implement. It serves as the foundation for entity composition and typing.

---

## Technical Identity

- **Type:** Entity
- **Domain:** ECS Core

---

## Data Schema

### Properties

- **entityId**: Unique string identifier for each entity instance
- **entityType**: Classification type from `EntityTypes` constants
- **ownerEntityId** (optional): Reference to owning entity
- **sprite** (optional): Reference to the Matter.js physics sprite

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `EntityTypes` constant
  - `Phaser.Physics.Matter.Sprite` from Phaser
  - `Phaser.Physics.Matter` namespace

---

## Maintenance Notes

N/A
