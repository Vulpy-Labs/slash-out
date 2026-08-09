# Sword Entity Documentation

## Overview
Defines the structure and components of sword entities in the ECS architecture.

## Technical Identity
- **Type:** Entity
- **Domain:** Combat/Weapons

## Data Schema
### Component Composition
- `keymap`: KeymapComponent - Input key bindings
- `input`: InputComponent - Current input state
- `state`: StateComponent - Current sword state (IDLE/SLASHING)
- `sprite`: Phaser.Physics.Matter.Sprite - Visual representation
- `animation`: AnimationComponent - Animation configurations

## Relationships
- **Owned By:** Player entities via ownerEntityId
- **Managed By:** EntityManager
- **Processed By:**
  - SwordStateHandler: Updates sword state
  - AnimationSystem: Handles animations
  - InputSystem: Processes player input

## Maintenance Notes
> [!NOTE]
> Sword entities are created exclusively through the SwordWeaponHandler builder.
