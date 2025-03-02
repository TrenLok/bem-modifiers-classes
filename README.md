# BEM modifiers classes 

BEM modifier classes is a utility for generating modifier classes according to the BEM methodology.

## Installation

```shell
npm i @trenlok/bem-modifier-classes
```

## Usage

### Basic Usage

```typescript
import { bmc } from '@trenlok/bem-modifier-classes';

interface ButtonProps {
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
}

// Create a function to generate button classes
const buttonClasses = bmc<ButtonProps>('button');

// Usage
const classes = buttonClasses({
  size: 'large',
  disabled: true
});
// classes: ['button', 'button_size_large', 'button_disabled_active']
```

### Modifier Settings

```typescript
import { bmc, stringModifier, booleanModifier } from '@trenlok/bem-modifier-classes';

interface CardProps {
  theme: 'light' | 'dark';
  visible: boolean;
}

const cardClasses = bmc<CardProps>('card', {
  modifiers: {
    // Configure string modifier
    theme: stringModifier<CardProps>('theme', {
      light: 'day',
      dark: 'night'
    }),
    // Configure boolean modifier
    visible: booleanModifier('visibility', 'shown', 'hidden')
  }
});

// Usage
const classes = cardClasses({
  theme: 'dark',
  visible: true
});
// classes: ['card', 'card_theme_night', 'card_visibility_shown']
```

### Props Whitelist

```typescript
import { bmc } from '@trenlok/bem-modifier-classes';

interface MenuProps {
  size: 'small' | 'large';
  position: 'top' | 'bottom';
  open: boolean;
}

// Use only specific modifiers
const menuClasses = bmc<MenuProps>('menu', {
  whitelist: ['size', 'open']
});

const classes = menuClasses({
  size: 'large',
  position: 'top', // this modifier will be ignored
  open: true
});
// classes: ['menu', 'menu_size_large', 'menu_open']
```

### Custom Modifiers

```typescript
import { bmc } from '@trenlok/bem-modifier-classes';

interface ButtonProps {
  size: 'small' | 'large';
}

const buttonClasses = bmc<ButtonProps>('button', {
  // Custom modifiers that will be added based on boolean state
  customModifiers: {
    primary: {
      modifier: 'style',
      stateIfTrue: 'primary',
    },
    mobile: {
      stateIfTrue: 'active',
      stateIfFalse: 'inactive',
    },
  }
});

const classes = buttonClasses({
  size: 'large',
  primary: true,
  mobile: window.innerWidth <= 768,
});
// classes: ['button', 'button_size_large', 'button_style_primary', 'button_mobile_touch']
```

## API

```typescript
bmc<T>(
  base: string,
  settings?: {
    modifiersSettings?: ModifiersSettings<T>,
    customModifiers?: CustomModifiersSettings;
    whitelist?: PropsWhitelist<T>
  }
)
```
- `base` (string) - base block class name
- `modifiersSettings` (object, optional) - modifier settings
- `customModifiers` (object, optional) - custom modifier settings
- `whitelist` (array, optional) - list of allowed modifiers

```typescript
booleanModifier(modifier?: string, stateIfTrue?: string, stateIfFalse?: string)
```

Creates settings for a boolean modifier:
- `modifier` - modifier name
- `stateIfTrue` - value when true
- `stateIfFalse` - value when false

```typescript
stringModifier<T>(modifier?: string, variants?: Record<keyof T, string>)
```

Creates settings for a string modifier:
- `modifier` - modifier name
- `variants` - object with value variants

## Type Declarations

```typescript
export type ModifiersSettings<T> =
  | {
  [K in keyof T]?: T[K] extends boolean | undefined
    ? BooleanModifierSettings | string | undefined
    : T[K] extends string | undefined
      ? StringModifierSettings<T[K]> | string | undefined
      : undefined;
}
  | undefined;

export type CustomModifiersSettings = Record<
  string, boolean | string | BooleanModifierSettings | undefined
>;

export type PropsWhitelist<T> = (keyof T | string)[];

export interface BooleanModifierSettings {
  modifier?: string;
  stateIfTrue?: string;
  stateIfFalse?: string;
}

export type StringModifierVariants<T extends string> = Partial<Record<T, string>>;

export interface StringModifierSettings<T extends string | undefined> {
  modifier?: string;
  variants?: T extends string ? StringModifierVariants<T> : never;
}
```

## License

[MIT](http://opensource.org/licenses/MIT)
