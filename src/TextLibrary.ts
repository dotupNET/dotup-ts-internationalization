import { ArrayTools, NestedObjectChild, NestedPartialObject, StringTools } from 'dotup-ts-types';
import { LanguageEnum } from './LanguageEnum';
import { PluralGroups } from './PluralGroups';

// tslint:disable: max-line-length
// export declare type LanguageTexts<TLanguageCode extends string, TTextKeysType extends string> = Language<TLanguageCode, TTextKeysType> | Text<TLanguageCode, TTextKeysType>;

// export declare type Language<TLanguageCode extends string, TTextKeys extends string> = { [P in TLanguageCode]: TextKey<TTextKeys> };
// export declare type Text<TLanguageCode extends string, TTextKeys extends string> = { [P in TTextKeys]: TextKey<TLanguageCode> };
// export declare type TextKey<T extends string> = { [P in T]: string | string[] };

// tslint:disable-next-line: interface-name
export interface Translator<T> {
  getText(key: T, ...args: any[]): string;
  getTexts(key: T, ...args: any[]): string[];
}

export type PluralizedString = NestedObjectChild<PluralGroups, string | string[]>;
export type TranslationItem = string | string[];
export type Translations<TTextKeys extends string> = NestedPartialObject<LanguageEnum, TTextKeys, string | string[] | Partial<PluralizedString>>;

// export class TextLibrary<TParent extends string, TTextKeys extends string> {
export class TextLibrary<TTextKeys extends string> {
  data: Translations<TTextKeys>;

  constructor(data: Translations<TTextKeys>) {
    this.data = data;
  }

  getTranslator(parent: LanguageEnum): Translator<TTextKeys> {
    return {
      getText: (textkey: TTextKeys, ...args: any[]): string => {
        const text = this.getText(parent, textkey)[0];

        return StringTools.format(text, args);
      },
      getTexts: (textkey: TTextKeys, ...args: any[]): string[] => {
        const texts = this.getText(parent, textkey);

        return texts.map(text => StringTools.format(text, args));
      }
    };
    // return (textkey: TTextKeys): string => {
    //   return this.getText(parent, textkey)[0];
    // }
  }

  getText(parent: LanguageEnum, child: TTextKeys): string[] {
    let result: string[];

    if (parent in this.data) {
      const childEntry = this.data[parent][child];

      if (childEntry === undefined) {
        result = [`${child} NOT FOUND`];
      } else {
        if (Array.isArray(childEntry) || typeof childEntry === 'string') {
          result = this.replaceTextLinks(childEntry, parent);
        } else if (typeof childEntry === 'object') {
          // TODO: pluralize
          const group = PluralGroups.one; // getPluralGroup();
          // tslint:disable-next-line: no-unsafe-any : no-any
          result = this.replaceTextLinks((<any>childEntry)[group], parent);
        }
      }

    } else {
      result = [`${parent} NOT FOUND`];
    }

    return result;
  }

  replaceTextLinks(text: string | string[], parent: LanguageEnum): string[] {
    const lines = Array.isArray(text) ? text : [text];
    const regex = /\$\([\w-]+\|?[\w-|\{\}:'"\s,\[\].,<>]+\)/;
    const replaceLinkInLine = (line: string): string => {
      const match = regex.exec(line);
      if (match !== null) {
        let textKey = match[0];
        textKey = textKey.substring(2, textKey.length - 1); // $(key)
        const replacementResult = this.getText(parent, <TTextKeys>textKey);
        const replaceText = Array.isArray(replacementResult) ? ArrayTools.getUniqueRandomValues(replacementResult, 1)[0] : replacementResult;
        const result = line.replace(regex, replaceText);

        // Anything else?
        if (regex.test(result)) {
          return replaceLinkInLine(result);
        } else {
          return result;
        }
      } else {
        return line;
      }
    };

    return lines.map<string>(replaceLinkInLine);
  }
}
