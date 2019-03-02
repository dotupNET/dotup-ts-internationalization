import { ArrayTools, StringTools, ObjectTools } from 'dotup-ts-types';
import { LanguageEnum } from './LanguageEnum';
import { PluralCategory } from './PluralCategory';
import 'intl-pluralrules';
import { PluralGroups } from './PluralGroup';
import { GenderGroups } from './GenderGroups';
import { Translator } from './Translator';
import { FormatOptions } from './FormatOptions';
import { TranslationDictionary, LanguageDictionary } from './Types';
/*
  http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
 */

const regex_replace_number = /#/gm;

// export class TextLibrary<TParent extends string, TTextKeys extends string> {
export class TextLibrary<TTextKeys extends string> {
  data: LanguageDictionary<TTextKeys>;

  constructor(data: LanguageDictionary<TTextKeys>) {
    this.data = data;
  }

  addTranslations(language: LanguageEnum, translations: TranslationDictionary<TTextKeys>) {
    const lng = this.data[language];
    if (lng) {
      ObjectTools.CopyEachSource(translations, lng);
    } else {
      this.data[language] = translations;
    }
  }

  getTranslator(parent: LanguageEnum): Translator<TTextKeys> {
    return {
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
        if (opt.plural) {
          text = text.replace(regex_replace_number, opt.plural.value.toString());
        }
        return StringTools.format(text, ...args);

        // const result = texts.map(text => StringTools.format(text, ...args));
        // return ArrayTools.getRandomValue(result);
      },

      getText: (textkey: TTextKeys, ...args: any[]): string => {
        const result = this.resolve(parent, { key: textkey });

        const text = ArrayTools.getRandomValue(result);
        return StringTools.format(text, ...args);
      },
      getTexts: (textkey: TTextKeys, ...args: any[]): string[] => {
        const result = this.resolve(parent, { key: textkey });

        return result.map(text => StringTools.format(text, ...args));
      },
      getPlural: (key: TTextKeys, count: number, ...args: any[]): string => {
        const texts = this.getCardinal(parent, key, count);
        const linksResolved = texts.map(t => StringTools.format(t, ...args));

        let text = ArrayTools.getRandomValue(linksResolved);
        text = text.replace(regex_replace_number, count.toString());
        return StringTools.format(text, ...args);

      },
      getPlurals: (key: TTextKeys, count: number, ...args: any[]): string[] => {
        const texts = this.getCardinal(parent, key, count);

        return texts.map(text => {
          text = text.replace(regex_replace_number, count.toString());
          return StringTools.format(text, ...args);
        });
      },
      getOrdinals: (key: TTextKeys, count: number, ...args: any[]): string[] => {
        const texts = this.getOrdinal(parent, key, count);

        return texts.map(text => {
          text = text.replace(regex_replace_number, count.toString());
          return StringTools.format(text, ...args);
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

  resolve(language: LanguageEnum, options: FormatOptions<TTextKeys>): string[] {
    let result: string[];

    // Select language
    if (language in this.data) {
      // Select key
      let childEntry = (<any>this.data)[language][options.key];

      if (childEntry === undefined) {
        // key not found
        result = [`'${options.key}' NOT FOUND`];
      } else {
        // extract the text
        do {
          if (Array.isArray(childEntry) || typeof childEntry === 'string') {
            // It's text
            result = <any>childEntry;
          } else if (this.isPluralCategory(childEntry)) {
            // Plural category (zero, one,...)
            const pluralCategory = new Intl.PluralRules(language).select(options.plural.value);
            childEntry = childEntry[pluralCategory];
            if (childEntry === undefined) {
              result = [`TextKey '${options.key}' category '${pluralCategory}' group '${options.plural.group}' not found. value: ${options.plural.value}`];
            }
          } else if (this.isGenderGroup(childEntry)) {
            // Gender group
            childEntry = childEntry[options.gender];
            if (childEntry === undefined) {
              result = [`TextKey '${options.key}' gender '${options.gender}' group '${options.plural.group}' not found. value: ${options.plural.value}`];
            }
          } else if (this.isPluralGroup(childEntry)) {
            // Plural group
            childEntry = childEntry[options.plural.group];
            if (childEntry === undefined) {
              result = [`TextKey '${options.key}' gender '${options.gender}' group '${options.plural.group}' not found. value: ${options.plural.value}`];
            }
          }

        } while (typeof childEntry === 'object' && result === undefined);

        if (childEntry !== undefined) {
          // Here we are. This is the text
          result = this.replaceTextLinks(childEntry, language, options);
        }

      }

    } else {
      result = [`'${language}' NOT FOUND`];
    }

    return result;
  }

  isPluralGroup(item: object) {
    return Object.keys(PluralGroups).some(group => Object.keys(item).some(entry => entry === group));
  }

  isPluralCategory(item: object) {
    return Object.keys(PluralCategory).some(group => Object.keys(item).some(entry => entry === group));
  }

  isGenderGroup(item: object) {
    return Object.keys(GenderGroups).some(group => Object.keys(item).some(entry => entry === group));
  }

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
