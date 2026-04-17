# BEM modifier classes

Utility for generating modifier classes according to the BEM methodology.

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

## License

[MIT](http://opensource.org/licenses/MIT)
