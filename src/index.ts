import {
  BooleanModifierSettings,
  CustomModifiersSettings,
  ModifiersSettings,
  PropInfoBoolean,
  PropInfoString,
  Props,
  PropsWhitelist,
  StringModifierSettings,
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
): BooleanModifierSettings {
  return { modifier, stateIfTrue, stateIfFalse };
}

export function stringModifier<T extends Record<string, string>>(
  modifier?: string,
  variants?: StringModifierVariants<T[keyof T]>,
): StringModifierSettings<T[keyof T]> {
  return { modifier, variants } as StringModifierSettings<T[keyof T]>;
}

function processStringProp<T>(
  base: string,
  propInfo: PropInfoString,
  modifiersSettings: ModifiersSettings<T>,
): string | undefined {
  const modifierKey = propInfo.modifier as keyof T;
  const hasModifierKey = modifiersSettings && Object.prototype.hasOwnProperty.call(modifiersSettings, modifierKey);
  const modifierSettings = getStringModifiersSettings(modifiersSettings, modifierKey);

  if (hasModifierKey && !modifierSettings) {
    return;
  }

  if (modifierSettings) {
    return getClassNameFromStringSettings(base, modifierSettings, propInfo);
  }

  return getClassName(base, propInfo.modifier, propInfo.value);
}

function processBooleanProp<T>(
  base: string,
  propInfo: PropInfoBoolean,
  modifiersSettings: ModifiersSettings<T> | CustomModifiersSettings,
): string | undefined {
  const modifierSettings = getBooleanModifierSettings(modifiersSettings, propInfo.modifier as keyof T);
  const hasModifierKey = modifiersSettings
    && Object.prototype.hasOwnProperty.call(modifiersSettings, propInfo.modifier);

  if (hasModifierKey && !modifierSettings) {
    return;
  }

  if (modifierSettings) {
    return getClassNameFromBooleanSettings(base, modifierSettings, propInfo);
  } else {
    return getDefaultClassNameFromBoolean(base, propInfo.modifier, propInfo.value);
  }
}

export function bmc<T extends object>(
  base: string,
  settings?: {
    modifiers?: ModifiersSettings<T>;
    customModifiers?: CustomModifiersSettings;
    whitelist?: PropsWhitelist<T>;
  },
) {
  return (props: Props<T> | Partial<Record<string, boolean>>): string[] => {
    const propsInfo = getPropsInfo(props);
    const classList: string[] = [base];

    for (const propInfo of propsInfo) {
      const isInCustomModifiers = settings?.customModifiers && propInfo.modifier in settings.customModifiers;

      if (
        settings?.whitelist !== undefined
        && !isInCustomModifiers
        && !settings?.whitelist.includes(propInfo.modifier)
      ) {
        continue;
      }

      if (propInfo.type === 'string') {
        const stringProp = propInfo as PropInfoString;
        const className = processStringProp(base, stringProp, settings?.modifiers);

        if (!className) continue;
        classList.push(className);
      }

      if (propInfo.type === 'boolean') {
        const booleanProp = propInfo as PropInfoBoolean;
        let className: string | undefined;

        if (settings?.customModifiers && propInfo.modifier in settings.customModifiers) {
          className = processBooleanProp(base, booleanProp, settings.customModifiers);
        } else {
          className = processBooleanProp(base, booleanProp, settings?.modifiers);
        }

        if (!className) continue;
        classList.push(className);
      }
    }

    return classList;
  };
}
