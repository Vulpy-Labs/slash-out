# [FileName] Documentation

## Overview

Provide a high-level summary of the file's purpose. Explain _why_ this exists and its role within the `@slash-out/client` architecture.

---

## Technical Identity

- **Type:** (e.g., "System")
- **Domain:** (e.g., "Physics")

---

## Responsibilities

Describe the responsabilities of this file.

- [Primary responsibility: e.g., "Calculating velocity based on input"]
- [Secondary responsibility: e.g., "Updating spatial hash for collision"]

---

## Data Schema

Critical for ECS. Detail which data structures this file interacts with.

### Manipulated Components

- **Reads:**
  - `[ComponentName]`: (Reason for reading)
- **Writes:**
  - `[ComponentName]`: (What changes are applied)

### Configuration Props

- `[PropName]` (`*.p.ts`): (Describe the role of these properties)

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

- **Core Dependencies:** `(e.g., Phaser.Scene, MatterJS.Engine)`
- **Related Systems:**
  - `[SystemName]`: (Reason for the relationship)
- **Events Consumed/Emitted:**
  - `[EventName]`: (Context)

---

## Maintenance Notes

Warning: Keep this section for specific technical "gotchas" or performance considerations.

> [!WARNING]
> **Performance:** This system runs on the `update` loop. Avoid heavy allocations or `O(n^2)` operations here.
