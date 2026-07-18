# [File Name] Documentation

## Overview

Provide a high-level summary of the file's purpose. Explain _why_ this exists and its role within the `@slash-out/client` architecture.

---

## Technical Identity

- **Type:** (e.g., "System", "Scene", "Manager", "Builder", "Helper", "Utility", etc.)
- **Domain:** (Use concise domains, e.g., "Physics", "Input", "Animation", "UI", etc.)

---

## Responsibilities

Describe the responsibilities of this file.

- [Primary responsibility: e.g., "Calculating velocity based on input"]
- [Secondary responsibility: e.g., "Updating spatial hash for collision"]

---

## Data Schema

Critical for ECS. Detail which data structures this file interacts with.

### Manipulated Components

- **Reads:**
  - `[ComponentName]`: (Reason for reading)  
    (If none, use `N/A`)
- **Writes:**
  - `[ComponentName]`: (What changes are applied)  
    (If none, use `N/A`)

### Configuration Props

- `[PropName]`: (Describe the role of this config or type)  
  If not applicable, use `N/A`.

---

## Lifecycle & Execution Flow

Describe the "End-to-End" flow.

1. **Initialization:** (e.g., "Bootstrapping state on `init()`")
2. **Update Loop:** (Actions performed every frame)
3. **Teardown:** (Cleanup operations to prevent memory leaks)

---

## Methods

### `[methodName](params): ReturnType`

**Description:** (Briefly explain what this specific logic block does)

**Flow:**

- [Step 1 of the internal logic]
- [Step 2 including any conditions]

**Side Effects:**

- (Does it emit events? Does it modify global state?)

---

## Dependencies & Relationships

- **Core Dependencies:** `(e.g., Phaser.Scene, Phaser.Physics.Matter.Sprite, MatterJS.BodyType, CONFLICTING_ACTIONS)`
- **Related Systems:**
  - `[SystemName]`: (Reason for the relationship)
  - or `N/A`
- **Events Consumed/Emitted:**
  - `[EventName]`: (Context)
  - or `N/A`

---

## Maintenance Notes

Warning: Keep this section for specific technical "gotchas" or performance considerations. Add notes if this file runs in the main `update` loop or if it makes heavy allocations. Otherwise, add N/A.

> [!WARNING]  
> **Performance:** This file runs on the `update` loop. Avoid heavy allocations or `O(n^2)` operations here.
