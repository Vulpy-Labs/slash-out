# Slash Out Client

The core game engine for rendering and logic, built with **Phaser 3** and **Matter.js**. This package implements a strict **ECS (Entity Component System)** architecture to ensure decoupling, performance, and scalability.

**Context:** For an overview of the monorepo, see the [main README](../../README.md). For AI and automation rules, see [docs/agents.md](../../docs/agents.md).

---

## 🛠 Tech Stack

- **Engine:** Phaser 3 (2D Rendering) + Matter.js (Physics)
- **Language:** TypeScript (Strict Mode)
- **Tooling:** Vite
- **Internationalization:** i18next (multi-language support)

---

## 🏗️ Architecture & Core Principles

The `client` is designed to minimize coupling between data and behavior.

### ECS Pattern

- **Entities:** Simple entities that aggregate components.
- **Components:** Pure data structures without logic.
- **Systems:** Logic processors that iterate over entities with specific components.

### Supporting Architecture

- **Builders:** Factories for complex entities (e.g., `MapBuilder`, `PlayerBuilder`).
- **Managers:** State and lifecycle orchestrators (e.g., `EntityManager`).
- **Scenes:** Phaser integration layers that initialize and order the `update loop`.

### Golden Rules

- **Exports:** `default exports` are forbidden. Use `named exports` only.
- **Typings:** Data definition files (Props) must use the `.p.ts` extension and end with the `Prop` suffix.
- **Purity:** Components must be strictly data-oriented.
- **Additional Rules:** Consult [docs/agents.md](../../docs/agents.md).

---

## 📂 Project Structure

The core logic resides in `src/game/`. Maintain organization according to the schema below:

```text
src/game/
├── builders/    # Entity factories (e.g., MapBuilder)
├── config/      # Constants and game configurations
├── ecs/         # Logic heart: Entities, Components, Systems
├── managers/    # State managers (e.g., EntityManager)
├── scenes/      # Phaser scenes (Core, Boot, Gameplay)
└── utils/       # Helpers, factories, and shared functions
```

---

## ⚙️ Development Guide

### Running Commands

| Command            | Description                            |
| ------------------ | -------------------------------------- |
| `npm run dev`      | Starts the development server          |
| `npm run build`    | Compiles the project for production    |
| `npm run lint`     | Validates TypeScript/ESLint compliance |
| `npm run lint:fix` | Applies automatic fixes                |

> **Tip:** To execute from the monorepo root, append `--workspace @slash-out/client` to the end of the command.

---

## 🤖 AI Documentation

This project uses **Aider** automation to ensure technical documentation stays up to date.

- **Base Rules Prompt:** [docs/agents.md](../../docs/agents.md)
- **Message Prompt:** [docs/prompts/ai-documentation-architect.md](../../docs/prompts/ai-documentation-architect.md)
- **Base Template:** [docs/templates/client-documentation.md](../../docs/templates/client-documentation.md)

**Workflow:**

1. Whenever you modify a file, ensure dependencies are resolved.
2. Commit your changes.
3. Run `npm run docs:update` from the monorepo root.
4. Aider will read the `.ts` files and update the corresponding `.md` file in the [/docs](../../docs) folder.
