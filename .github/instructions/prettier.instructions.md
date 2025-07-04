---
applyTo: "**/*.js,**/*.ts,**/*.tsx,**/*.vue,**/*.jsx"
---
# Prettier Formatting Guidelines

## General Configuration

- Always use Prettier for formatting code in this Nuxt project
- Configure Prettier in the project root with a `.prettierrc` file
- Run Prettier on save for consistent code style
- Include Prettier in your CI/CD pipeline to enforce style consistency

## Tailwind CSS Integration

- Use the Tailwind CSS Official Plugin for automatic class sorting
- This plugin ensures classes are sorted according to Tailwind's recommended order
- More information: https://tailwindcss.com/blog/automatic-class-sorting-with-prettier

## Setup Instructions

1. Install the required packages:

```bash
npm install --save-dev prettier prettier-plugin-tailwindcss
```

2. Create or update your `.prettierrc` file with:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

3. Add formatting scripts to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Benefits of Tailwind Class Sorting

- Consistent class order across all templates
- Classes are grouped by related functionality 
- Follows the recommended order from the Tailwind team:
  1. Layout (display, position, etc.)
  2. Box model (width, height, margin, padding)
  3. Typography
  4. Visual styles (colors, backgrounds, borders)
  5. Interactions
  6. Miscellaneous

## Example

Before sorting:

```html
<button class="text-white px-4 py-2 hover:bg-blue-600 bg-blue-500 rounded">
  Button
</button>
```

After sorting with prettier-plugin-tailwindcss:

```html
<button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Button
</button>
```

## IDE Integration

- Configure VS Code to use Prettier as the default formatter
- Enable "Format on Save" for the best developer experience
- Install the Prettier VS Code extension (ID: `esbenp.prettier-vscode`)

## Error Handling

If you encounter conflicts with other plugins:
- Ensure Tailwind plugin is loaded last in the plugins array
- Check for conflicts with other formatting tools like ESLint
- Use the `.prettierignore` file to exclude problematic files if necessary
