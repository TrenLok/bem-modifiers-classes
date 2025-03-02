import {
  test,
  expect,
  it,
  describe,
} from 'vitest';

import {
  booleanModifier,
  stringModifier,
  bmc,
} from '../src';
import {
  BooleanModifierSettings,
  ModifiersSettings,
  PropInfoBoolean,
  PropInfoString,
  StringModifierSettings,
} from '../src/types';
import {
  getBooleanModifierClassName,
  getBooleanModifierSettings,
  getBooleanValueState,
  getBooleanValueStateDefault,
  getClassName,
  getClassNameFromBooleanSettings,
  getClassNameFromStringSettings,
  getDefaultClassNameFromBoolean,
  getPropsInfo,
  getStringModifiersSettings,
  toKebabCase,
} from '../src/utils';

describe('Test Utility Functions', () => {
  test('getClassName', () => {
    const className = getClassName('test-base', 'test-modifier', 'test-value');

    expect(className).toEqual('test-base_test-modifier_test-value');
  });

  test('toKebabCase', () => {
    expect(toKebabCase('example value')).toEqual('example-value');
    expect(toKebabCase('camelCaseExample')).toBe('camel-case-example');
    expect(toKebabCase('PascalCaseExample')).toBe('pascal-case-example');
    expect(toKebabCase('PascalCase0000Example')).toEqual('pascal-case0000-example');
    expect(toKebabCase('UPPERCASE')).toBe('uppercase');
    expect(toKebabCase('already-kebab-case')).toBe('already-kebab-case');
    expect(toKebabCase('123')).toBe('123');
    expect(toKebabCase('!!!@@@###$$$%%%^^^&&&***')).toBe('!!!@@@###$$$%%%^^^&&&***');
  });

  describe('getBooleanValueStateDefault', () => {
    it('should return "active" for true', () => {
      expect(getBooleanValueStateDefault(true)).toBe('active');
    });

    it('should return "disabled" for false', () => {
      expect(getBooleanValueStateDefault(false)).toBe('inactive');
    });
  });

  describe('getBooleanValueState', () => {
    it('should return the correct state based on boolean value', () => {
      expect(getBooleanValueState(true)).toBe('active');
      expect(getBooleanValueState(false)).toBe('inactive');
      expect(getBooleanValueState(true, 'enabled', 'disabled')).toBe('enabled');
      expect(getBooleanValueState(false, 'enabled', 'disabled')).toBe('disabled');
    });
  });

  describe('getDefaultClassNameFromBoolean', () => {
    it('should return the default class name based on boolean state', () => {
      expect(getDefaultClassNameFromBoolean('base', 'modifier', true)).toBe('base_modifier_active');
      expect(getDefaultClassNameFromBoolean('base', 'modifier', false)).toBe('base_modifier_inactive');
    });
  });

  describe('getBooleanModifierClassName', () => {
    it('should return the correct class name based on boolean modifier settings', () => {
      const settings = { modifier: 'test', stateIfTrue: 'enabled', stateIfFalse: 'disabled' };
      const prop: PropInfoBoolean = { modifier: 'prop', type: 'boolean', value: true };
      expect(getBooleanModifierClassName(settings, prop, 'base')).toBe('base_test_enabled');

      prop.value = false;
      expect(getBooleanModifierClassName(settings, prop, 'base')).toBe('base_test_disabled');
    });

    it('should return the correct class name based on boolean modifier settings without the passed modifier', () => {
      const settings = { stateIfTrue: 'enabled', stateIfFalse: 'disabled' };
      const prop: PropInfoBoolean = { modifier: 'prop', type: 'boolean', value: true };
      expect(getBooleanModifierClassName(settings, prop, 'base')).toBe('base_prop_enabled');

      prop.value = false;
      expect(getBooleanModifierClassName(settings, prop, 'base')).toBe('base_prop_disabled');
    });

    it('should return the correct class name based on boolean modifier settings based on the passed stateIfTrue', () => {
      const settings = { modifier: 'test', stateIfTrue: undefined, stateIfFalse: 'disabled' };
      const prop: PropInfoBoolean = { modifier: 'prop', type: 'boolean', value: true };
      expect(getBooleanModifierClassName(settings, prop, 'base')).toBe(undefined);

      prop.value = false;
      expect(getBooleanModifierClassName(settings, prop, 'base')).toBe('base_test_disabled');
    });

    it('should return the correct class name based on boolean modifier settings without the passed stateIf', () => {
      const settings = { modifier: 'test' };
      const prop: PropInfoBoolean = { modifier: 'prop', type: 'boolean', value: true };
      expect(getBooleanModifierClassName(settings, prop, 'base')).toBe('base_test_active');

      prop.value = false;
      expect(getBooleanModifierClassName(settings, prop, 'base')).toBe('base_test_inactive');
    });
  });

  describe('getPropsInfo', () => {
    it('should return an array of PropInfo objects', () => {
      const props = {
        a: 1,
        b: 'string',
        c: true,
        d: undefined,
        e: ['string'],
        f: { type: 'string' },
      };
      const result = getPropsInfo(props);
      expect(result).toEqual([
        { modifier: 'a', type: 'number', value: 1 },
        { modifier: 'b', type: 'string', value: 'string' },
        { modifier: 'c', type: 'boolean', value: true },
        { modifier: 'd', type: 'undefined', value: undefined },
        { modifier: 'e', type: 'array', value: ['string'] },
        { modifier: 'f', type: 'object', value: { type: 'string' } },
      ]);
    });
  });

  describe('getClassNameFromBooleanSettings', () => {
    it('should return the correct class name based on boolean settings', () => {
      const settings = { modifier: 'test' };
      const prop: PropInfoBoolean = { modifier: 'prop', type: 'boolean', value: true };
      expect(getClassNameFromBooleanSettings('base', settings, prop)).toBe('base_test_active');
    });

    it('should return the correct class name based on boolean settings as a string', () => {
      const prop: PropInfoBoolean = { modifier: 'prop', type: 'boolean', value: true };
      expect(getClassNameFromBooleanSettings('base', 'test', prop)).toBe('base_test_active');
    });

    it('should return the correct class name based on boolean settings incorrect type', () => {
      const prop: PropInfoBoolean = { modifier: 'prop', type: 'boolean', value: true };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(getClassNameFromBooleanSettings('base', undefined, prop)).toBe('base_prop_active');
    });
  });

  describe('getClassNameFromStringSettings', () => {
    it('should return the correct class name based on string settings', () => {
      const settings = { modifier: 'test', variants: { value: 'variant' } } as unknown as string | StringModifierSettings<never>;
      const prop: PropInfoString = { modifier: 'prop', type: 'string', value: 'value' };
      expect(getClassNameFromStringSettings('base', settings, prop)).toBe('base_test_variant');
    });

    it('should return the correct class name based on string settings as a string', () => {
      const prop: PropInfoString = { modifier: 'prop', type: 'string', value: 'value' };
      expect(getClassNameFromStringSettings('base', 'test', prop)).toBe('base_test_value');
    });
  });

  describe('getBooleanModifierSettings', () => {
    it('should return the correct modifier settings', () => {
      const settings = { test: { modifier: 'test' } } as unknown as ModifiersSettings<{ test: { modifier: string } }>;
      expect(getBooleanModifierSettings(settings, 'test')).toEqual({ modifier: 'test' });
    });
  });

  describe('getStringModifiersSettings', () => {
    it('should return the correct string modifier settings', () => {
      const settings = { test: 'testValue' } as ModifiersSettings<{ test: string }>;
      expect(getStringModifiersSettings(settings, 'test')).toBe('testValue');
    });
  });
});

describe('Test Main Functions', () => {
  describe('booleanModifier', () => {
    it('should return a BooleanModifierSettings object', () => {
      const result = booleanModifier('testModifier', 'active', 'inactive');
      expect(result).toEqual({
        modifier: 'testModifier',
        stateIfTrue: 'active',
        stateIfFalse: 'inactive',
      });
    });

    it('should return a BooleanModifierSettings object with default states', () => {
      const result = booleanModifier('testModifier');
      expect(result).toEqual({
        modifier: 'testModifier',
        stateIfTrue: undefined,
        stateIfFalse: undefined,
      });
    });

    it('should return a BooleanModifierSettings object with undefined modifier', () => {
      const result = booleanModifier(undefined, 'active', 'inactive');
      expect(result).toEqual({
        modifier: undefined,
        stateIfTrue: 'active',
        stateIfFalse: 'inactive',
      });
    });

    it('should return a BooleanModifierSettings object with undefined arguments', () => {
      const result = booleanModifier();
      expect(result).toEqual({
        modifier: undefined,
        stateIfTrue: undefined,
        stateIfFalse: undefined,
      });
    });
  });

  describe('stringModifierSettings', () => {
    it('should return a StringModifierSettings object', () => {
      const result = stringModifier('testModifier', { variant1: 'value1' });
      expect(result).toEqual({
        modifier: 'testModifier',
        variants: { variant1: 'value1' },
      });
    });

    it('should return a StringModifierSettings object with undefined variants', () => {
      const result = stringModifier('testModifier');
      expect(result).toEqual({
        modifier: 'testModifier',
        variants: undefined,
      });
    });

    it('should return a StringModifierSettings object with undefined modifier', () => {
      const result = stringModifier(undefined, { variant1: 'value1' });
      expect(result).toEqual({
        modifier: undefined,
        variants: { variant1: 'value1' },
      });
    });

    it('should return a StringModifierSettings object with undefined modifier and variants', () => {
      const result = stringModifier();
      expect(result).toEqual({
        modifier: undefined,
        variants: undefined,
      });
    });
  });

  describe('bmc', () => {
    describe('modifier settings', () => {
      it('should return a list of classes with the standard boolean modifier class when there are no settings', () => {
        interface TestProps {
          isActive: boolean;
        }

        const base = 'base';
        const props: TestProps = { isActive: true };

        const result = bmc<TestProps>(base);
        expect(result(props)).toEqual([base, `${base}_is-active_active`]);
      });

      it('should return a class list based on string props', () => {
        interface TestProps {
          color: 'red' | 'blue';
        }

        const base = 'base';
        const props: TestProps = { color: 'red' };

        const result = bmc<TestProps>(base, {
          modifiers: {
            color: { modifier: 'colorModifier', variants: { red: 'redVariant' } },
          },
        });
        expect(result(props)).toEqual([base, `${base}_color-modifier_red-variant`]);
      });

      it('should return a class list based on boolean props', () => {
        interface TestProps {
          isActive: boolean;
        }

        const base = 'base';
        const props: TestProps = { isActive: true };

        const result = bmc<TestProps>(base, {
          modifiers: {
            isActive: { modifier: 'activeModifier', stateIfTrue: 'active', stateIfFalse: 'inactive' },
          },
        });
        expect(result(props)).toEqual([base, `${base}_active-modifier_active`]);
      });

      it('should return a list of classes without modifiers that are configured as undefined', () => {
        interface TestProps {
          isActive: boolean;
        }

        const base = 'base';
        const props: TestProps = { isActive: true };

        const result = bmc<TestProps>(base, {
          modifiers: {
            isActive: undefined,
          },
        });
        expect(result(props)).toEqual([base]);
      });

      it('should return a list of classes without modifiers that are configured as undefined in variants or stateIf', () => {
        interface TestProps {
          color: string;
          size: 'full' | 'auto';
          isDisable: boolean;
        }

        const base = 'base';
        const props: TestProps = { color: 'red', size: 'full', isDisable: false };

        const result = bmc<TestProps>(base, {
          modifiers: {
            size: {
              variants: {
                full: undefined,
                auto: 'auto',
              },
            },
            isDisable: {
              stateIfFalse: undefined,
            },
          },
        });
        expect(result(props)).toEqual([base, `${base}_color_red`]);
      });

      it('should return a class list with default class names for boolean props', () => {
        interface TestProps {
          isActive: boolean;
        }

        const base = 'base';
        const props: TestProps = { isActive: false };

        const result = bmc<TestProps>(base, {
          modifiers: {
            isActive: { modifier: 'activeModifier' },
          },
        });
        expect(result(props)).toEqual([base, `${base}_active-modifier_inactive`]);
      });

      it('should return only the base class if no props are provided', () => {
        const base = 'base';
        const props: object = {};

        const result = bmc(base);
        expect(result(props)).toEqual([base]);
      });
    });

    describe('whitelist', () => {
      it('should only return modifiers from the for prop whitelist', () => {
        interface TestProps {
          color: string;
          href: string;
        }

        const base = 'base';
        const props: TestProps = { color: 'red', href: 'href' };

        const result = bmc<TestProps>(base, {
          whitelist: ['color'],
        });
        expect(result(props)).toEqual([base, `${base}_color_red`]);
      });

      it('should return only the base class', () => {
        interface TestProps {
          color: string;
          href: string;
        }

        const base = 'base';
        const props: TestProps = { color: 'red', href: 'href' };

        const result = bmc<TestProps>(base, {
          modifiers: { color: undefined },
          whitelist: ['color'],
        });
        expect(result(props)).toEqual([base]);
      });
    });

    describe('custom modifiers', () => {
      interface TestProps {
        color: string;
      }

      const base = 'base';
      const props: TestProps = { color: 'red' };

      it('should return the modifier for custom modifier', () => {
        const customModifier: BooleanModifierSettings = {
          modifier: 'customModifier',
          stateIfTrue: 'active',
          stateIfFalse: 'inactive',
        };

        const result = bmc<TestProps>(
          base,
          {
            modifiers: {
              color: undefined,
            },
            customModifiers: {
              customModifier: customModifier,
            },
          },
        );

        expect(result({ ...props, customModifier: false })).toEqual([base, `${base}_custom-modifier_inactive`]);
      });

      it('should return the modifier for custom modifier with the standard value of state', () => {
        const customModifier: BooleanModifierSettings = {
          modifier: 'customModifier',
        };

        const result = bmc<TestProps>(
          base,
          {
            customModifiers: {
              customModifier: customModifier,
            },
          },
        );

        expect(result({ ...props, customModifier: false })).toEqual([base, `${base}_color_red`, `${base}_custom-modifier_inactive`]);
      });

      it('should return a list of modifiers without custom modifier when state is false', () => {
        const customModifier: BooleanModifierSettings = {
          modifier: 'customModifier',
          stateIfTrue: 'active',
        };

        const result = bmc<TestProps>(
          base,
          {
            customModifiers: {
              customModifier: customModifier,
            },
          },
        );

        expect(result({ ...props, customModifier: false })).toEqual([base, `${base}_color_red`]);
      });

      it('should return a list of modifiers without custom modifier when state is true', () => {
        const customModifier: BooleanModifierSettings = {
          modifier: 'customModifier',
          stateIfTrue: undefined,
          stateIfFalse: 'inactive',
        };

        const result = bmc<TestProps>(
          base,
          {
            customModifiers: {
              customModifier: customModifier,
            },
          },
        );

        expect(result({ ...props, customModifier: true })).toEqual([base, `${base}_color_red`]);
      });

      it('should return a list of modifiers without a custom modifier when undefined.', () => {
        const result = bmc<TestProps>(
          base,
          { customModifiers: undefined },
        );

        expect(result(props)).toEqual([base, `${base}_color_red`]);
      });
    });
  });
});
