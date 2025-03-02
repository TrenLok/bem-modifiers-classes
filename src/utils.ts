import type {
  BooleanModifierSettings,
  CustomModifiersSettings,
  ModifiersSettings,
  PropInfo,
  PropInfoBoolean,
  PropInfoString,
  StringModifiersSettingsType,
  StringModifierType,
} from './types';

export function toKebabCase(value: string): string {
  const newString = value.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join('-');

  return newString ?? value;
}

export function getPropsInfo(props: Record<string, unknown>): PropInfo[] {
  return Object.entries(props).map(([key, value]) => {
    let type: string = typeof value;
    if (Array.isArray(value)) {
      type = 'array';
    } else if (value !== null && typeof value === 'object') {
      type = 'object';
    }
    return { modifier: key, type, value };
  });
}

export function getBooleanValueStateDefault(state: boolean): string {
  return state ? 'active' : 'inactive';
}

export function getBooleanValueState(state: boolean, valueIfTrue?: string, valueIfFalse?: string): string {
  const stateIfTrue = valueIfTrue ?? getBooleanValueStateDefault(true);
  const stateIfFalse = valueIfFalse ?? getBooleanValueStateDefault(false);
  return state ? stateIfTrue : stateIfFalse;
}

export function getClassName(base: string, modifier: string, value: string): string {
  return `${base}_${toKebabCase(modifier)}_${toKebabCase(value)}`;
}

export function getDefaultClassNameFromBoolean(base: string, modifier: string, state: boolean): string {
  return getClassName(base, modifier, getBooleanValueStateDefault(state));
}

export function getBooleanModifierClassName(
  booleanModifierSettings: BooleanModifierSettings,
  prop: PropInfoBoolean,
  base: string,
): string | undefined {
  if (
    booleanModifierSettings.modifier
    && !booleanModifierSettings.stateIfTrue
    && !booleanModifierSettings.stateIfFalse
  ) {
    return getClassName(base, booleanModifierSettings.modifier, getBooleanValueStateDefault(prop.value));
  }

  if (!prop.value && !booleanModifierSettings.stateIfFalse) return;
  if (prop.value && !booleanModifierSettings.stateIfTrue) return;

  const key = booleanModifierSettings.modifier ?? prop.modifier;
  const value = getBooleanValueState(
    prop.value,
    booleanModifierSettings.stateIfTrue,
    booleanModifierSettings.stateIfFalse,
  );

  return getClassName(base, key, value);
}

export function getClassNameFromBooleanSettings(
  base: string,
  settings: BooleanModifierSettings | string,
  propInfo: PropInfoBoolean,
): string | undefined {
  if (typeof settings === 'string') {
    return getClassName(base, settings, getBooleanValueStateDefault(propInfo.value));
  }

  if (typeof settings === 'object') {
    const settingObject = settings as BooleanModifierSettings;

    if (settingObject.modifier && !settingObject.stateIfTrue && !settingObject.stateIfFalse) {
      return getClassName(base, settingObject.modifier, getBooleanValueStateDefault(propInfo.value));
    }

    return getBooleanModifierClassName(settingObject, propInfo, base);
  }

  return getDefaultClassNameFromBoolean(base, propInfo.modifier, propInfo.value);
}

export function getClassNameFromStringSettings<T>(
  base: string,
  settings: StringModifierType<T, keyof T> | string,
  stringProp: PropInfoString,
): string | undefined {
  if (typeof settings === 'string') {
    return getClassName(base, settings, stringProp.value);
  }

  if (typeof settings === 'object') {
    const modifierFromSettings = settings.modifier ?? stringProp.modifier;
    const valueFromSettings = settings.variants?.[stringProp.value];

    if (!valueFromSettings) return;

    return getClassName(base, modifierFromSettings, valueFromSettings);
  }
}

export function getBooleanModifierSettings<T>(
  modifiersSettings: ModifiersSettings<T> | CustomModifiersSettings | undefined,
  modifier: keyof T,
): string | BooleanModifierSettings | undefined {
  if (
    modifiersSettings
    && typeof modifiersSettings === 'object'
  ) {
    return modifiersSettings[modifier] as string | BooleanModifierSettings | undefined;
  }
  return undefined;
}

export function getStringModifiersSettings<T>(
  modifiersSettings: ModifiersSettings<T> | undefined,
  modifier: keyof T,
): string | StringModifiersSettingsType<T> | undefined {
  if (
    modifiersSettings
    && typeof modifiersSettings === 'object'
  ) {
    return modifiersSettings[modifier] as string | StringModifiersSettingsType<T> | undefined;
  }
  return undefined;
}
