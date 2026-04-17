import {
  BmcInputSettings,
  BrandedBooleanModifierSettings,
  BrandedStringModifierSettings,
  EmptyModifiers,
  InferPropsFromModifiers,
  InferableModifiersSettings,
  InferredBmcSettings,
  ModifierPrimitiveValue,
  ModifiersSettings,
  PropInfoBoolean,
  PropInfoString,
  Props,
  StringModifierVariants,
} from './types';
import {
  getBooleanModifierSettings,
  getClassName,
  getClassNameFromBooleanSettings,
  getClassNameFromStringSettings,
  getDefaultClassNameFromBoolean,
  getPropsInfo,
  getStringModifiersSettings,
} from './utils';

export function booleanModifier(
  modifier?: string,
  stateIfTrue?: string,
  stateIfFalse?: string,
): BrandedBooleanModifierSettings {
  return { modifier, stateIfTrue, stateIfFalse } as BrandedBooleanModifierSettings;
}

export function flag(
  modifier?: string,
  stateIfTrue?: string,
  stateIfFalse?: string,
): BrandedBooleanModifierSettings {
  return booleanModifier(modifier, stateIfTrue, stateIfFalse);
}

export function stringModifier<T extends string>(
  modifier?: string,
  variants?: StringModifierVariants<T>,
): BrandedStringModifierSettings<T | undefined>;
export function stringModifier<T extends object>(
  modifier?: string,
  variants?: StringModifierVariants<Extract<T[keyof T], string>>,
): BrandedStringModifierSettings<Extract<T[keyof T], string> | undefined>;
export function stringModifier(
  modifier?: string,
  variants?: StringModifierVariants<string>,
): BrandedStringModifierSettings<string | undefined> {
  return {
    modifier,
    variants,
  } as BrandedStringModifierSettings<string | undefined>;
}

export function variant<T extends string>(
  modifier?: string,
  variants?: StringModifierVariants<T>,
): BrandedStringModifierSettings<T | undefined>;
export function variant<T extends object>(
  modifier?: string,
  variants?: StringModifierVariants<Extract<T[keyof T], string>>,
): BrandedStringModifierSettings<Extract<T[keyof T], string> | undefined>;
export function variant(
  modifier?: string,
  variants?: StringModifierVariants<string>,
): BrandedStringModifierSettings<string | undefined> {
  return stringModifier(modifier, variants);
}

type RuntimeModifiersSettings = Record<string, unknown>;

interface RuntimeBmcSettings {
  modifiers?: RuntimeModifiersSettings;
  customModifiers?: RuntimeModifiersSettings;
  whitelist?: readonly string[] | true;
}

type RuntimeBmcInputSettings = RuntimeBmcSettings | RuntimeModifiersSettings | undefined;

function hasModifierKey(
  modifiersSettings: Record<string, unknown> | undefined,
  modifier: string,
): boolean {
  return Boolean(modifiersSettings
    && Object.prototype.hasOwnProperty.call(modifiersSettings, modifier));
}

function getConfiguredModifierKeys(settings?: {
  modifiers?: Record<string, unknown>;
  customModifiers?: Record<string, unknown>;
}): Set<string> {
  return new Set([
    ...Object.keys(settings?.modifiers ?? {}),
    ...Object.keys(settings?.customModifiers ?? {}),
  ]);
}

function processStringProp(
  base: string,
  propInfo: PropInfoString,
  modifiersSettings: Record<string, unknown> | undefined,
): string | undefined {
  const modifierSettings = getStringModifiersSettings(
    modifiersSettings as ModifiersSettings<Record<string, string>>,
    propInfo.modifier,
  );
  const isConfiguredModifier = hasModifierKey(modifiersSettings, propInfo.modifier);

  // A configured key with `undefined` disables class generation for that prop.
  if (isConfiguredModifier && !modifierSettings) {
    return;
  }

  if (modifierSettings) {
    return getClassNameFromStringSettings(base, modifierSettings, propInfo);
  }

  return getClassName(base, propInfo.modifier, propInfo.value);
}

function processBooleanProp(
  base: string,
  propInfo: PropInfoBoolean,
  modifiersSettings: Record<string, unknown> | undefined,
): string | undefined {
  const modifierSettings = getBooleanModifierSettings(
    modifiersSettings as ModifiersSettings<Record<string, boolean>>,
    propInfo.modifier,
  );
  const isConfiguredModifier = hasModifierKey(modifiersSettings, propInfo.modifier);

  // A configured key with `undefined` disables class generation for that prop.
  if (isConfiguredModifier && !modifierSettings) {
    return;
  }

  if (modifierSettings) {
    return getClassNameFromBooleanSettings(base, modifierSettings, propInfo);
  } else {
    return getDefaultClassNameFromBoolean(base, propInfo.modifier, propInfo.value);
  }
}

function isBmcSettings(settings: RuntimeBmcInputSettings): settings is RuntimeBmcSettings {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    return false;
  }

  return (
    'modifiers' in settings
    || 'customModifiers' in settings
    || 'whitelist' in settings
  );
}

function normalizeBmcSettings(settings: RuntimeBmcInputSettings): RuntimeBmcSettings | undefined {
  if (!settings) return undefined;
  if (isBmcSettings(settings)) return settings;

  // Direct shorthand (`bmc('block', { size: true })`) is treated as
  // `{ modifiers, whitelist: true }` to avoid leaking unrelated props into classes.
  return {
    modifiers: settings,
    whitelist: true,
  };
}

export function bmc<T extends object, TCustom extends Record<string, ModifierPrimitiveValue> = EmptyModifiers>(
  base: string,
  settings?: BmcInputSettings<T, TCustom>,
): (props: Props<T> & Partial<TCustom>) => string[];
export function bmc<const TModifiers extends InferableModifiersSettings>(
  base: string,
  modifiers: TModifiers,
): (props: Partial<InferPropsFromModifiers<TModifiers>>) => string[];
export function bmc<
  const TModifiers extends InferableModifiersSettings,
  const TCustomModifiers extends InferableModifiersSettings = EmptyModifiers,
>(
  base: string,
  settings: InferredBmcSettings<TModifiers, TCustomModifiers>,
): (props: Partial<InferPropsFromModifiers<TModifiers> & InferPropsFromModifiers<TCustomModifiers>>) => string[];
export function bmc(
  base: string,
  settings?: unknown,
) {
  const normalizedSettings = normalizeBmcSettings(settings as RuntimeBmcInputSettings);

  return (props: unknown): string[] => {
    const propsInfo = getPropsInfo(props as Record<string, unknown>);
    const classList: string[] = [base];
    const configuredModifierKeys = normalizedSettings?.whitelist === true
      ? getConfiguredModifierKeys({
          modifiers: normalizedSettings?.modifiers as Record<string, unknown> | undefined,
          customModifiers: normalizedSettings?.customModifiers as Record<string, unknown> | undefined,
        })
      : undefined;

    for (const propInfo of propsInfo) {
      const isInModifiers = hasModifierKey(
        normalizedSettings?.modifiers as Record<string, unknown> | undefined,
        propInfo.modifier,
      );
      const isInCustomModifiers = hasModifierKey(
        normalizedSettings?.customModifiers as Record<string, unknown> | undefined,
        propInfo.modifier,
      );
      // When both sections contain the same key, prefer `modifiers` because it is the primary API.
      const activeModifierSettings = isInModifiers
        ? normalizedSettings?.modifiers
        : (isInCustomModifiers
            ? normalizedSettings?.customModifiers
            : undefined);

      if (normalizedSettings?.whitelist !== undefined) {
        if (normalizedSettings.whitelist === true) {
          if (!configuredModifierKeys?.has(propInfo.modifier)) {
            continue;
          }
        } else if (!isInCustomModifiers && !normalizedSettings.whitelist.includes(propInfo.modifier)) {
          continue;
        }
      }

      if (propInfo.type === 'string') {
        const stringProp = propInfo as PropInfoString;
        const className = processStringProp(
          base,
          stringProp,
          activeModifierSettings as Record<string, unknown> | undefined,
        );

        if (!className) continue;
        classList.push(className);
      }

      if (propInfo.type === 'boolean') {
        const booleanProp = propInfo as PropInfoBoolean;
        const className = processBooleanProp(
          base,
          booleanProp,
          activeModifierSettings as Record<string, unknown> | undefined,
        );

        if (!className) continue;
        classList.push(className);
      }
    }

    return classList;
  };
}
