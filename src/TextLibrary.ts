import { ArrayTools, ObjectTools, StringTools } from 'dotup-ts-types';
// tslint:disable-next-line: no-import-side-effect
import 'intl-pluralrules';
import { FormatOptions } from './FormatOptions';
import { GenderGroups } from './GenderGroups';
import { LanguageEnum } from './LanguageEnum';
import { PluralCategory } from './PluralCategory';
import { PluralGroups } from './PluralGroup';
import { Translator } from './Translator';
import { LanguageDictionary, PartialLanguageDictionary, PartialTranslationDictionary, TranslationDictionary } from './Types';
/*
  http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
 */

const regex_replace_number = /#/gm;

export class TextLibrary<TTextKeys extends string> {
  data: LanguageDictionary<TTextKeys>;

  constructor(data: LanguageDictionary<TTextKeys> | PartialLanguageDictionary<TTextKeys>) {
    this.data = data;
  }

  addTranslations(language: LanguageEnum, translations: TranslationDictionary<TTextKeys> | PartialTranslationDictionary<TTextKeys>) {
    const lng = this.data[language];
    if (lng === undefined) {
      this.data[language] = translations;
    } else {
      ObjectTools.CopyEachSource(translations, lng);
    }
  }

  getTranslator(parent: LanguageEnum): Translator<TTextKeys> {
    return {
      // tslint:disable-next-line: no-any
      format: (options: TTextKeys | FormatOptions<TTextKeys>, ...args: any[]): string => {
        let opt: FormatOptions<TTextKeys>;
        if (typeof options === 'string') {
          opt = {
            key: options
          };
        } else {
          opt = options;
        }
        const result = this.resolve(parent, opt);

        let text = ArrayTools.getRandomValue(result);
        if (opt.plural !== undefined) {
          const no = new Intl.NumberFormat(parent)
            .format(opt.plural.value);
          text = text.replace(regex_replace_number, no);
        }

        return StringTools.format(text, ...args);

        // const result = texts.map(text => StringTools.format(text, ...args));
        // return ArrayTools.getRandomValue(result);
      },

      // tslint:disable-next-line: no-any
      getText: (textkey: TTextKeys, ...args: any[]): string => {
        const result = this.resolve(parent, { key: textkey });

        const text = ArrayTools.getRandomValue(result);

        return StringTools.format(text, ...args);
      },
      // tslint:disable-next-line: no-any
      getTexts: (textkey: TTextKeys, ...args: any[]): string[] => {
        const result = this.resolve(parent, { key: textkey });

        return result.map(text => StringTools.format(text, ...args));
      },
      // tslint:disable-next-line: no-any
      getPlural: (key: TTextKeys, count: number, ...args: any[]): string => {
        const texts = this.getCardinal(parent, key, count);
        const linksResolved = texts.map(t => StringTools.format(t, ...args));

        let text = ArrayTools.getRandomValue(linksResolved);
        const no = new Intl.NumberFormat(parent)
          .format(count);

        text = text.replace(regex_replace_number, no);

        return StringTools.format(text, ...args);
      },
      // tslint:disable-next-line: no-any
      getPlurals: (key: TTextKeys, count: number, ...args: any[]): string[] => {
        const texts = this.getCardinal(parent, key, count);

        return texts.map(text => {
          const no = new Intl.NumberFormat(parent)
            .format(count);

          const result = text.replace(regex_replace_number, no);

          return StringTools.format(result, ...args);
        });
      },
      // tslint:disable-next-line: no-any
      getOrdinals: (key: TTextKeys, count: number, ...args: any[]): string[] => {
        const texts = this.getOrdinal(parent, key, count);

        return texts.map(text => {
          const no = new Intl.NumberFormat(parent)
            .format(count);

          const result = text.replace(regex_replace_number, no);

          return StringTools.format(result, ...args);
        });
      }
    };
    // return (textkey: TTextKeys): string => {
    //   return this.getText(parent, textkey)[0];
    // }
  }

  // getText(parent: LanguageEnum, child: TTextKeys): string[] {
  //   let result: string[];

  //   // select language
  //   if (parent in this.data) {
  //     // select entry
  //     const childEntry = this.data[parent][child];

  //     if (childEntry === undefined) {
  //       // Item not found
  //       result = [`${child} NOT FOUND`];
  //     } else if (Array.isArray(childEntry) || typeof childEntry === 'string') {
  //       // It's text
  //       result = this.replaceTextLinks(childEntry, parent, options);
  //     } else if (typeof childEntry === 'object') {
  //       // TODO: Support gender
  //       throw new Error('use TextLibrary.getPlural()');
  //     }

  //   } else {
  //     result = [`${parent} NOT FOUND`];
  //   }

  //   return result;
  // }

  getCardinal(language: LanguageEnum, key: TTextKeys, count: number): string[] {
    return this.resolve(language, {
      key: key,
      plural: {
        value: count,
        group: PluralGroups.plural
      }
    });
  }

  getOrdinal(language: LanguageEnum, key: TTextKeys, count: number): string[] {
    return this.resolve(language, {
      key: key,
      plural: {
        value: count,
        group: PluralGroups.ordinal
      }
    });
  }

  // tslint:disable: no-unsafe-any : no-any
  resolve(language: LanguageEnum, options: FormatOptions<TTextKeys>): string[] {
    let result: string[];
    let childEntry: any;

    // Select language
    if (language in this.data) {
      // Select key
      childEntry = this.data[language][options.key];

      if (childEntry === undefined) {
        // key not found
        result = [`'${options.key}' NOT FOUND`];
      } else {
        // extract the text
        do {
          if (typeof childEntry === 'string') {
            // It's text
            result = [childEntry];
          } else if (Array.isArray(childEntry)) {
            // It's text
            result = childEntry;
          } else if (this.isPluralCategory(childEntry)) {
            // Plural category (zero, one,...)
            const pluralCategory = new Intl.PluralRules(language).select(options.plural.value);
            childEntry = childEntry[pluralCategory];
            if (childEntry === undefined) {
              // tslint:disable-next-line: max-line-length
              result = [`TextKey '${options.key}' category '${pluralCategory}' group '${options.plural.group}' not found. value: ${options.plural.value}`];
            }
          } else if (this.isGenderGroup(childEntry)) {
            // Gender group
            childEntry = childEntry[options.gender];
            if (childEntry === undefined) {
              // tslint:disable-next-line: max-line-length
              result = [`TextKey '${options.key}' gender '${options.gender}' group '${options.plural.group}' not found. value: ${options.plural.value}`];
            }
          } else if (this.isPluralGroup(childEntry)) {
            // Plural group
            childEntry = childEntry[options.plural.group];
            if (childEntry === undefined) {
              // tslint:disable-next-line: max-line-length
              result = [`TextKey '${options.key}' gender '${options.gender}' group '${options.plural.group}' not found. value: ${options.plural.value}`];
            }
          } else {
            // wrong input
            result = undefined;
          }

        } while (result === undefined);

        if (childEntry !== undefined) {
          // Here we are. This is the text
          result = this.replaceTextLinks(result, language, options);
        }

      }

    } else {
      result = [`'${language}' NOT FOUND`];
    }

    return result;
  }
  // tslint:enable: no-unsafe-any : no-any

  replaceTextLinks(text: string | string[], parent: LanguageEnum, options: FormatOptions<TTextKeys>): string[] {
    const lines = Array.isArray(text) ? text : [text];
    const regex = /\$\([\w-]+\|?[\w-|\{\}:'"\s,\[\].,<>]+\)/;
    const replaceLinkInLine = (line: string): string => {
      const match = regex.exec(line);
      if (match !== null) {
        let textKey = match[0];
        textKey = textKey.substring(2, textKey.length - 1); // $(key)
        const replacementResult = this.resolve(parent, {
          gender: options.gender,
          key: <TTextKeys>textKey,
          plural: options.plural
        });
        // tslint:disable-next-line: max-line-length
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

  // tslint:disable-next-line:no-any
  isPluralGroup(item: any): boolean {
    return Object.keys(PluralGroups)
      .some(group => Object.keys(item)
        .some(entry => entry === group));
  }

  // tslint:disable-next-line:no-any
  isPluralCategory(item: any): boolean {
    return Object.keys(PluralCategory)
      .some(group => Object.keys(item)
        .some(entry => entry === group));
  }

  // tslint:disable-next-line:no-any
  isGenderGroup(item: any): boolean {
    return Object.keys(GenderGroups)
      .some(group => Object.keys(item)
        .some(entry => entry === group));
  }

}
