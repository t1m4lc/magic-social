# GitHub Copilot Instructions

This folder contains configuration files for GitHub Copilot, including the main `copilot-instructions.md` file.

## About `copilot-instructions.md`

The `copilot-instructions.md` file is a special file that GitHub Copilot automatically detects and includes in every chat request. It allows you to define project-wide instructions that will guide how Copilot generates code and responds to your questions.

## How It Works

1. **Automatic Detection**: When placed in the `.github` folder at the root of your workspace, VS Code automatically includes these instructions in every Copilot chat request.

2. **Enabling the Feature**: To use the file, you need to set the `github.copilot.chat.codeGeneration.useInstructionFiles` setting to `true` in VS Code settings.

3. **Writing Instructions**: The file uses Markdown format to define your coding practices, preferred technologies, and project requirements.

## Example Content

Here's what you might include in your `copilot-instructions.md` file:

```markdown
# Project Guidelines for Copilot

## Coding Standards
- Follow the Google style guide for all languages
- Use meaningful variable and function names
- Add JSDoc comments for all functions

## Project Architecture
- This is a TypeScript project that processes and analyzes documents
- The codebase follows a modular architecture
- Use functional programming principles when possible

## Dependencies
- Prefer built-in functionality over third-party libraries
- When adding a dependency, check its license and maintenance status
```

## Benefits

- Ensures consistent code generation across your project
- Reduces the need to repeat instructions in every prompt
- Makes it easier to onboard new team members
- Allows you to define project-specific requirements

For more details, see the [VS Code Documentation on Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilot-instructionsmd-file).
