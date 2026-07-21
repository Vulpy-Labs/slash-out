# Main Menu Scene Documentation

## Overview

The `MainMenu` scene serves as the initial user interface when launching the game. It displays branding assets and transitions to the `MatchScene` when user input is detected.

---

## Technical Identity

- **Type:** Scene
- **Domain:** UI

---

## Responsibilities

- Displays background and logo assets
- Renders the "Main Menu" title text
- Handles user input to transition to `MatchScene`

---

## Data Schema

### Manipulated Components

N/A (Pure UI scene)

### Configuration Props

N/A

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Constructor sets scene key to "MainMenu"

2. **Create:**
   - Loads and positions background image centered at (512,384)
   - Loads and positions logo image centered at (512,300)
   - Creates and styles title text at (512,460)
   - Sets up pointer input listener

3. **Teardown:**
   - Automatically handled by Phaser scene manager

---

## Methods

### `create(): void`

**Description:** Sets up all visual elements and input handling for the main menu

**Flow:**

- Creates background image using "background" texture
- Creates logo image using "logo" texture
- Creates styled text element with "Main Menu" text
- Configures one-time pointer input handler

**Side Effects:**

- Transitions to `MatchScene` with configuration:
  - `playerCount`: 2
  - `mapName`: "canyon"
- Loads assets into Phaser's texture manager

---

## Dependencies & Relationships

- **Core Dependencies:** `Phaser.Scene`, `Phaser.GameObjects`
- **Related Systems:** N/A
- **Events Consumed/Emitted:**
  - `pointerdown`: Triggers scene transition to `MatchScene`

---

## Maintenance Notes

> [!NOTE]  
> **Hardcoded Values:** All positions and the `MatchScene` configuration are currently hardcoded.
