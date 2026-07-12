# Slash Out

**Slash Out** is a 2D action game focused on dynamic combat, inspired by _Samurai Gunn_, developed with **Phaser 3** and a robust architecture based on **ECS (Entity Component System)**.

---

## 🛠 Tech Stack

- **Engine:** Phaser 3 + Matter.js
- **Language:** TypeScript (Strict Mode)
- **Tooling:** Vite
- **Infrastructure:** Monorepo (NPM Workspaces)
- **Automation:** GitHub Actions, Aider (LLM-assisted development)

---

## 📂 Project Structure

The project is organized as a monorepo to isolate game logic from automation infrastructure:

```text
slash-out/
├── packages/
│   ├── client/       # Game logic, ECS, rendering, and assets
│   └── scripts/      # Utilities, Git Hooks, and AI pipelines
├── docs/             # Technical documentation, prompts, and templates
└── README.md

```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `>=22.13.0 <23`
- **NPM:** `>=10`

### Installation

Clone the repository and install the dependencies.
The `git-hooks` will be installed automatically for commit validation.

```bash
npm install
```

### Running in Development

To start the game client, run:

```bash
npm run dev --workspace @slash-out/client
```

---

## 📑 AI Documentation Pipeline

The project uses **[Aider](https://aider.chat)** to keep technical documentation synchronized with the implementation.

### 1. Setup

1. **Install Aider:** Follow the [official documentation](https://aider.chat/docs/install.html).
2. **API Key:** Configure your API key according to the [documentation](https://aider.chat/docs/llms.html).
   - Using [OpenRouter](https://openrouter.ai) is recommended for model access.

### 2. Configuration

Create a `.env` file at the root and configure the variables:

```bash
OPENROUTER_API_KEY=your_key_here
AIDER_MODEL=openrouter/deepseek/deepseek-chat
AIDER_AUTO_COMMITS=false
```

### 3. Save work

Commit the changes made during your task.

### 4. Running

To synchronize the documentation, run:

```bash
npm run docs:update
```

**Notes:**

1. This command analyzes the source code and automatically applies the template to the files in `/docs`.
2. It is necessary to commit the changes made so that Aider receives the files to document.
3. In cases where many files are modified or included simultaneously, Aider may not be able to document all of them. In such cases, it is recommended to document in stages.
4. If you wish to document only files with specific types, you can include the desired types in the `onlyIncludeTypes` variable in the [update-docs index file](packages/scripts/src/update-docs/index.ts#37). The allowed types are mapped in the `FileType` type in [update-docs types file](packages/scripts/src/update-docs/types.p.ts#1).

---

## 🏗 Development Workflow

### Global Commands (Root)

| Command               | Description                                       |
| --------------------- | ------------------------------------------------- |
| `npm run lint`        | Validates code quality across the entire monorepo |
| `npm run lint:fix`    | Automatically fixes formatting errors             |
| `npm run docs:update` | Synchronizes technical documentation via Aider    |

### Workspace Commands

#### Client Commands

- `npm run dev --workspace @slash-out/client`
- `npm run build --workspace @slash-out/client`
- `npm run lint --workspace @slash-out/client`
- `npm run lint:fix --workspace @slash-out/client`

#### Scripts Commands

- `npm run setup:hooks --workspace @slash-out/scripts`
- `npm run docs:update --workspace @slash-out/scripts`

---

## 🤝 Contributing Guidelines

### Branching Strategy

Use descriptive branches or branch names linked to task IDs:

- **Tasks:** `feat/007`, `fix/056`, `doc/098`
- **Ad-hoc:** `feat/player-dash`, `fix/input-priority`, `doc/update-readme`

### Commit Convention

The project uses a `git-hook` to validate and format commits. Write the commit message in the following format:

```text
<type>: <description>
```

- **Rules:**
  - All lowercase
  - No trailing period
  - No emojis or manual prefixes (the hook will add formatting automatically)
  - Use types approved by [git-hooks](packages/scripts/src/git-hooks/commit-msg#21)

---

## 🤖 AI Agent Rules

All automated contributions must strictly follow the guidelines in [docs/agents.md](docs/agents.md).

## ⚖️ License

[MIT](https://opensource.org/license/mit)
