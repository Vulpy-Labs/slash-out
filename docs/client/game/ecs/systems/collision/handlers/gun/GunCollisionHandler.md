# Gun Collision Handler Documentation

## Overview

The `GunCollisionHandler` manages collision events for gun/bullet entities. It handles sword deflection (reflecting bullets according to sword strike direction while maintaining original ownership), projectile-on-projectile annihilation, and deactivation upon impacting players.

---

## Technical Identity

- **Type:** Handler
- **Domain:** Combat/Collision

---

## Responsibilities

- Validates in-flight bullet collision participants
- Deflects bullets when striking active swords in slashing state
- Preserves original shooter ownership (`ownerEntityId`) across deflections
- Deactivates bullets upon colliding with another bullet or a player
- Resets bullet physical motion and repositions offscreen on deactivation

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `StateComponent`: Checks weapon and bullet states
  - `MovementComponent`: Reads intent during deflection
  - `AnimationComponent`: Reads flip orientation
- **Writes:**
  - `StateComponent`: Sets bullet state to `IDLE` on deactivation
  - `MovementComponent`: Updates `intent.moveX` and `intent.moveY` on deflection or resets on deactivation
  - `VelocityComponent`: Resets `vx` and `vy` on deactivation

### Configuration Props

- `CollisionHandleProp` (`*.p.ts`):
  - `affected: GlobalEntity`: The entity receiving the collision event (the bullet)
  - `collider: GlobalEntity`: The entity colliding with the bullet
  - `entities: GlobalEntityMap`: Contains all game entities for resolving owners
- `GunCollisionDeflectProp` (`*.p.ts`):
  - `bullet: ValidGunCollisionEntity`: The bullet being deflected
  - `owner: GlobalEntity`: The owner of the deflecting sword
- `GunCollisionDeactivateProp` (`*.p.ts`):
  - `bullet: ValidGunCollisionEntity`: The bullet to deactivate
- `PopulateDeflectDirectionProp` (`*.p.ts`):
  - `owner: GlobalEntity`: The owner of the sword
- `IsActiveSwordProp` (`*.p.ts`):
  - `collider: GlobalEntity`: The collider entity
- `IsBulletClashProp` (`*.p.ts`):
  - `affected: ValidGunCollisionEntity`: The affected bullet
  - `collider: GlobalEntity`: The collider entity
- `IsPlayerProp` (`*.p.ts`):
  - `collider: GlobalEntity`: The collider entity

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Instantiates reusable `deflectDirection` object to guarantee zero garbage collection in event loops
2. **Main Operations:**
   - Validates that `affected` is an active gun entity in `GUN_STATE.IN_FLIGHT`
   - If collider is an active sword (`SWORD_STATE.SLASHING`), invokes `deflectBullet()`
   - If collider is another bullet (`isBulletClash()`) or a player, invokes `deactivateBullet()`
3. **Teardown:** N/A

---

## Methods

### `handle({ affected, collider, entities })`

**Description:** Processes gun collision events

**Flow:**

- Validates affected entity as gun in `IN_FLIGHT` state
- Detects if collider is an active sword, deflecting the bullet towards sword strike direction
- Detects if collider is another bullet or a player, deactivating the bullet

---

### `private deflectBullet({ bullet, owner })`

**Description:** Deflects bullet in direction of sword swing while preserving original shooter ownership

**Flow:**

- Populates `deflectDirection` based on sword owner attack direction and flip
- Updates `bullet.movement.intent`
- Adjusts sprite angle, flip, and animation flip
- Preserves `ownerEntityId` unaltered

---

### `private deactivateBullet({ bullet })`

**Description:** Resets bullet to idle offscreen

**Flow:**

- Sets `bullet.state.current = GUN_STATE.IDLE`
- Resets `bullet.movement.intent` to zero
- Resets `bullet.velocity` to zero
- Hides sprite and moves to `(-9999, -9999)`
- Stops Matter body velocity

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `ENTITY_TYPES`: Defines entity types
  - `GUN_STATE`: Defines gun states
  - `SWORD_STATE`: Defines sword states
  - `CHARACTER_STATE`: Defines character attack directions
  - `ICollisionSystemHandler`: Interface implemented by this handler
- **Related Systems:**
  - `CollisionSystem`: Delegates gun collisions to this handler
  - `VelocitySystem`: Moves bullet using `movement` and `velocity` components
  - `PlayerCollisionHandler`: Handles player mortality upon collision with active bullets

---

## Maintenance Notes

> [!WARNING]  
> **Ownership Invariant:** `ownerEntityId` must never be reassigned to the deflecting player. The original shooter must remain the owner.
> **Zero GC:** Reusable `deflectDirection` property avoids object allocations inside collision callbacks.
