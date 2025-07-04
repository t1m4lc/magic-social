# Instructions Folder

This folder contains instruction files for customizing GitHub Copilot's behavior in VS Code. Instruction files enable you to provide context about your coding practices, preferred technologies, and project requirements.

## Types of Instruction Files

1. **`.instructions.md` files**: Files that end with `.instructions.md` for specific tasks or file types.
2. **`.github/copilot-instructions.md`**: A single file at the root of your workspace that contains instructions for all Copilot interactions.

## Best Practice Example

**Example: `typescript-react.instructions.md`**
```markdown
---
applyTo: "**/*.ts,**/*.tsx"
---
# Project coding standards for TypeScript and React

## TypeScript Guidelines
- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)

## React Guidelines
- Use functional components with hooks
- Follow the React hooks rules (no conditional hooks)
- Keep components small and focused
- Use CSS modules for component styling
```

## How to Use Instruction Files

1. Create instruction files using Command Palette (`⇧⌘P`) → `Chat: New Instruction File`
2. Configure which files the instructions apply to using the `applyTo` property in the front matter
3. Reference your instruction files in chat using:
   - In the Chat view, select `Add Context` > `Instructions` and select your file
   - Run the `Chat: Attach Instructions` command from the Command Palette
   - The instructions will be automatically applied if the `applyTo` pattern matches

## Enable Automatic Instructions

For the `.github/copilot-instructions.md` file, set the `github.copilot.chat.codeGeneration.useInstructionFiles` setting to `true` in your VS Code settings.

See the [VS Code Copilot Customization Guide](https://code.visualstudio.com/docs/copilot/copilot-customization#_instruction-files) for more details.
