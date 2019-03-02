import { PluralCategory } from './PluralCategory';
import { PluralGroups } from './PluralGroup';
import { GenderGroups } from './GenderGroups';
import { LanguageEnum } from './LanguageEnum';
import { PartialNested, Nested } from 'dotup-ts-types';

// export type PluralizedString = NestedObjectChild<PluralCategory, Partial<TranslationItem> | string | string[]>;
// export type PluralizedGroup = NestedObjectChild<PluralGroups, Partial<PluralizedString>>;
// export type TranslationItem = NestedObjectChild<GenderGroups, string | string[]>;
// export type Translations<TTextKeys extends string> = NestedPartialObject<LanguageEnum, TTextKeys, string | string[] | Partial<PluralizedGroup> | Partial<TranslationItem>>;
// export type TranslationDictionary<TTextKeys extends string> = Nested<TTextKeys, string | string[] | Partial<PluralizedGroup> | Partial<TranslationItem>>;
// export type LanguageDictionary<TTextKeys extends string> = PartialNested<LanguageEnum, TranslationDictionary<TTextKeys>>;

export type TranslationItem = string | string[];
export type PluralizedString = PartialNested<PluralCategory, GenderedTranslationItem | TranslationItem>;
export type PluralizedTranslationItem = PartialNested<PluralGroups, PluralizedString>;
export type GenderedTranslationItem = PartialNested<GenderGroups, TranslationItem>;
export type TranslationDictionary<TTextKeys extends string> = Nested<TTextKeys, TranslationItem | PluralizedTranslationItem | GenderedTranslationItem>;
export type LanguageDictionary<TTextKeys extends string> = PartialNested<LanguageEnum, TranslationDictionary<TTextKeys>>;
