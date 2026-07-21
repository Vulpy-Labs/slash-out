# Boot Scene Documentation

## Overview

The `Boot` Scene is the initial scene that loads minimal required assets (like a background image) before transitioning to the `Preloader` Scene. This prevents having preloader logic in the first scene while ensuring necessary assets are available.

---

## Technical Identity

- **Type:** Scene
- **Domain:** Application Bootstrapping

---

## Responsibilities

- Loading minimal assets required for the preloader experience
- Initiating the application lifecycle by transitioning to `Preloader`

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Sets scene name to 'Boot' in constructor
   - Loads background image in `preload()`
2. **Execution:**
   - Immediately starts `Preloader` scene once loaded
3. **Teardown:**
   - Automatically cleaned up by Phaser after transition

---

## Methods

### `preload()`

**Description:** Loads essential assets for preloader display

**Flow:**

- Loads single background image asset

---

### `create()`

**Description:** Handles scene startup

**Flow:**

- Transitions to `Preloader` scene immediately

---

## Dependencies & Relationships

- **Core Dependencies:** `Phaser.Scene`
- **Related Scenes:**
  - `Preloader`: Direct successor scene

---

## Maintenance Notes

N/A
