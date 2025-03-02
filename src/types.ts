export type Props<T> = Readonly<T> & {
  readonly [K in keyof T]?: T[K];
};

export interface PropInfo {
  modifier: string;
  type: string;
  value: string | number | boolean | undefined | unknown;
}

export interface PropInfoBoolean extends PropInfo {
  value: boolean;
}

export interface PropInfoString extends PropInfo {
  value: string;
}

export interface BooleanModifierSettings {
  modifier?: string;
  stateIfTrue?: string;
  stateIfFalse?: string;
}

export type StringModifierType<T, K extends keyof T> = T[K] extends string ? StringModifierSettings<T[K]> : never;

export type StringModifierVariants<T extends string> = Partial<Record<T, string>>;

export interface StringModifierSettings<T extends string | undefined> {
  modifier?: string;
  variants?: T extends string ? StringModifierVariants<T> : never;
}

export type StringModifiersSettings<T> = {
  [K in keyof T]?: StringModifierType<T, K>;
};

export type StringModifiersSettingsType<T> = StringModifiersSettings<T>[keyof T];

export type ModifiersSettings<T> =
  | {
    [K in keyof T]?: T[K] extends boolean | undefined
      ? BooleanModifierSettings | string | undefined
      : T[K] extends string | undefined
        ? StringModifierSettings<T[K]> | string | undefined
        : undefined;
  }
  | undefined;

export type CustomModifiersSettings = Record<string, boolean | string | BooleanModifierSettings | undefined>;

export type PropsWhitelist<T> = (keyof T | string)[];
