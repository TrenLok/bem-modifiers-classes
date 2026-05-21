# BEM modifier classes

A TypeScript utility for generating BEM modifier class names from component props.

## Installation

With `pnpm`

```bash
pnpm add @trenlok/bem-modifier-classes
```

Or, with `npm`

```bash
npm install @trenlok/bem-modifier-classes
```

Or, with `yarn`

```bash
yarn add @trenlok/bem-modifier-classes
```

Or, with `bun`

```bash
bun add @trenlok/bem-modifier-classes
```

## Quick start

```typescript
import { bmc, flag } from '@trenlok/bem-modifier-classes';

const buttonClasses = bmc('button', {
  size: true,
  variant: true,
  isDisabled: flag('state', 'disabled'),
});

const classes = buttonClasses({
  size: 'large',
  variant: 'primary',
  isDisabled: true,
});
// ['button', 'button_size_large', 'button_variant_primary', 'button_state_disabled']
```

## Documentation
Learn more on the [Documentation](docs/docs.md)

## Agent skills

This repository includes provider-agnostic agent skills in [`skills`](skills).

Install them directly from GitHub:

```bash
npx skills add TrenLok/bem-modifiers-classes --all
```

They can also be installed as a package:

```bash
pnpm add -D @trenlok/bem-modifier-classes-skills skills-npm
```

Add `skills-npm` to the consuming project's prepare script:

```json
{
  "scripts": {
    "prepare": "skills-npm"
  }
}
```

## License

[MIT](http://opensource.org/licenses/MIT)
