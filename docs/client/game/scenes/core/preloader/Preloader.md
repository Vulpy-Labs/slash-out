# Preloader Scene Documentation

## Overview

The `Preloader` Scene handles asset loading and displays progress feedback before starting the main game. It demonstrates loading progress and initializes game configuration.

---

## Technical Identity

- **Type:** Scene
- **Domain:** Initialization

---

## Responsibilities

- Displaying loading progress visually
- Loading all required game assets
- Configuring and launching the `MatchScene` with initial settings

---

## Data Schema

### Configuration Props

- `MatchConfig`: Defines initial game setup including map and players

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Sets up progress bar UI
   - Configures load event listeners
2. **Loading:**
   - Loads game assets via `preload()`
   - Updates progress bar
3. **Launch:**
   - Creates `MatchConfig`
   - Starts `MatchScene` with config

---

## Methods

### `init()`

**Description:** Sets up progress display

**Flow:**

- Creates background image from Boot assets
- Initializes progress bar graphics
- Configures load progress listener

---

### `preload()`

**Description:** Loads core game assets

**Flow:**

- Sets base asset path
- Loads logo image

---

### `create()`

**Description:** Finalizes loading and launches game

**Flow:**

- Creates default `MatchConfig`
- Starts `MatchScene` with configuration

---

## Dependencies & Relationships

- **Core Dependencies:** `Phaser.Scene`
- **Related Scenes:**
  - `Boot`: Predecessor that provides background asset
  - `MatchScene`: Successor scene that receives config

---

## Maintenance Notes

N/A
