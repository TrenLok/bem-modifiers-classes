# BEM Modifier Classes Skills

Agent skills for `@trenlok/bem-modifier-classes`.

These skills are plain `SKILL.md` folders and are not tied to a specific AI
provider. They can be installed through tools that understand package-based
skills, or copied directly from this package.

## Installation with skills-npm

Use this package together with `skills-npm` so the skills are linked for your
agent during dependency installation.

Add a prepare script to the consuming project:

```json
{
  "scripts": {
    "prepare": "skills-npm"
  }
}
```

Install the skills package:

```bash
pnpm add -D @trenlok/bem-modifier-classes-skills skills-npm
```

With npm:

```bash
npm install -D @trenlok/bem-modifier-classes-skills skills-npm
```

## Installation with npx skills

Install all skills from the GitHub repository:

```bash
npx skills add TrenLok/bem-modifiers-classes --all
```

Install a specific skill:

```bash
npx skills add TrenLok/bem-modifiers-classes --skill bem-modifier-classes
npx skills add TrenLok/bem-modifiers-classes --skill bem-modifier-classes-v2-migration
```

## Included Skills

- `bem-modifier-classes` - usage guide for the v2 API.
- `bem-modifier-classes-v2-migration` - migration workflow from v1 to v2.

## Build

The canonical skills live in this package under `packages/skills/skills`.

To sync them to the repository root `skills/` directory, run:

```bash
pnpm build:skills
```

## Repository Installers

The generated root `skills/` directory is for tools that install skills
directly from Git repositories.
