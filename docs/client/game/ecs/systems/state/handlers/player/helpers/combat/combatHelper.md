# Combat Helper Documentation

## Overview

The `combatHelper` handles resolving combat-related player state transitions in both grounded and airborne states.

---

## Technical Identity

- **Type:** Helper
- **Domain:** State Management

---

## Responsibilities

- Determines combat state transitions based on player input
- Provides resolved combat state to state handlers

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `InputComponent`: Checks combat-related action inputs
- **Writes:** N/A

### Configuration Props

- `CombatHelperResolveProp` (`*.p.ts`): Takes player input state

---

## Methods

### `resolve({ input }: CombatHelperResolveProp): CombatHelperResolveResult | null`

**Description:** Resolves combat state from player input

**Flow:**

1. Checks input for attack actions (sword/gun)
2. Returns corresponding combat state if detected

---

## Dependencies & Relationships

- **Core Dependencies:** N/A
- **Related Systems:**
  - `StateSystem`: Consumes resolved combat state

---

## Maintenance Notes

N/A
