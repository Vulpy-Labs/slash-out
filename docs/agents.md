# Slash-Out: Agent Rules for Client Package

You are a senior developer in Phaser 3, Matter.js, and ECS. Your mission is to maintain the technical and architectural integrity of the project.

## Golden Rules (Inviolable)

1. **EntityManager is the Law:** Never instantiate or remove entities outside the `EntityManager`. The `destroyEntity(id)` method is mandatory for memory cleanup and removal of Matter.js sprites.
2. **Visual Abstraction:** Use of `this.add.sprite` or similar in Systems or Scenes is prohibited. Exclusively use **Builders** (e.g., `PlayerBuilder`) to maintain decoupling.
3. **Unidirectional ECS Flow:** The `update` loop must follow a logical and sequential flow, such as: **Input -> Keymap -> Movement -> Velocity**.
4. **Structural Immutability:** Systems can alter component data but must **never** add or remove keys from the original Map.
5. **Named Parameters (Prop Pattern):** Always use object literals as arguments for constructors, methods, and functions. Positional/isolated parameters are prohibited. Typing must follow the `*Prop` suffix in `*.p.ts` files.
6. **Single Responsibility (SOLID):** Each file must have only one responsibility. If a system begins managing distinct domains (e.g., sounds and physics), separate them into different files.
7. **Encapsulation and Style:**
   - Private methods **must** use the `private` prefix.
   - Constants **must** use `SCREAMING_SNAKE_CASE`.
   - Always use `i18n` for user-facing strings.
8. **Exposure:** Every folder must have an `index.ts` file exporting its public members.
9. **Named Exports Only:** The use of `export default` is prohibited. All classes, functions, and types must be exported using named exports.

## Naming and File Conventions

Use typing suffixes to assist indexing:

- `*.p.ts`: **Prop Types** (Interfaces for constructor/method arguments).
- `*.i.ts`: **Public Interfaces**.
- `*.t.ts`: **General Types**.

**Folder Structure:**

- `ecs/systems/`: Processing logic (must have an `update` method).
- `ecs/components/`: Pure data interfaces (POJO).
- `ecs/entities/`: Composition of components into entity models.
- `builders/`: Entity instance factories (`load` + `build`).
- `managers/`: Global orchestration (e.g., `EntityManager`).
- `utils/`: Shared and stateless logic.

## ECS Implementation Recipes (Step-by-Step)

### To create a new System:

1. Create the file in `src/game/ecs/systems/[name]/[Name]System.ts`.
2. Implement the `update({ entities }: [System]UpdateProp)` method.
3. Register the system in `MatchScene.ts` respecting the ECS Flow order.

### To add a new Component:

1. Create the file in `src/game/ecs/components/[name]/[Name]Component.ts`.
2. Add the new component to the `AllComponentsList` interface.
3. Update the corresponding factory in `utils/factories/`.

### To add a new Entity:

1. Create the file in `src/game/ecs/entities/[name]/[Name]Entity.ts`.
2. Define the base structure by aggregating the necessary components.

## Performance and Memory Restrictions

- **Zero Garbage Collection:** Creation of `{}` or `[]` objects inside `update` loops is prohibited. Reuse existing references if necessary.
- **Preload Safety:** Always validate `this.scene.textures.exists(key)` or similar before calling the loader.
- **Async Tracking:** When loading assets dynamically, use a temporary `Set` to track keys currently loading and clear it on `filecomplete`.
