import { GenderGroups } from './GenderGroups';
import { InitializeIntl } from './IntlInitializer';
import { LanguageEnum } from './LanguageEnum';
import { PluralCategory } from './PluralCategory';
import { PluralGroups } from './PluralGroup';
import { TextLibrary } from './TextLibrary';
import { LanguageDictionary, TranslationDictionary } from './Types';

const utility = {
  escapeQuotes: (s: string) => {
    return s.replace(/"/g, '\\"');
  },
  unescapeQuotes: (s: string) => {
    return s.replace(/\\"/g, '"');
  }
};

enum TextKeys {
  'Hello' = 'Hello', 'WithTextLink' = 'WithTextLink', 'Slang' = 'Slang',
  PluralizedWithGender = 'PluralizedWithGender',
  DirectText = 'DirectText',
  Pluralized = 'Pluralized',
  TextArray = 'TextArray',
  PlaceHolderText = 'PlaceHolderText',
  Gendered = 'Gendered',
  NamedPlaceHolderText = 'NamedPlaceHolderText'
}
const newT: LanguageDictionary<TextKeys> = {
  'de-DE': {
    PlaceHolderText: 'Text with {0}',
    NamedPlaceHolderText: 'Text two with {MyVariable}',
    DirectText: 'DirectText',
    TextArray: ['TextArray1', 'TextArray1'],
    WithTextLink: ['$(DirectText) with $(Slang)'],
    Gendered: {
      male: 'is male',
      female: 'is female'
    },
    Pluralized: {
      plural: {
        zero: 'zero',
        one: 'one',
        few: 'few',
        many: 'many',
        other: 'other',
        two: 'two'
      }
    },
    PluralizedWithGender: {

      plural: {
        few: {
          female: [''],
          male: 'beim man #'
        },
        one: {
          female: ['plural-one-female # $(DirectText)'],
          male: 'plural-one-male $(DirectText)'
        },
        other: 'plural-other $(DirectText)',
        many: ''
      },
      ordinal: {
        one: ['erstes $(Hello)'],
        other: 'zweites $(Hello)'
      }
    },
    Hello: ['Hallo', 'Hi', 'Servus'],
    Slang: ['nasen', 'eumel', 'vögel']
  }
};

const tr: TranslationDictionary<TextKeys> = {
  PlaceHolderText: 'Text with {0}',
  NamedPlaceHolderText: 'Text two with {MyVariable}',
  DirectText: 'DirectText',
  TextArray: ['TextArray1', 'TextArray1'],
  WithTextLink: ['$(DirectText) with $(Slang)'],
  Gendered: {
    male: 'is male',
    female: 'is female'
  },
  Pluralized: {
    plural: {
      zero: 'zero',
      one: 'one',
      few: 'few',
      many: 'many',
      other: 'other',
      two: 'two'
    }
  },
  PluralizedWithGender: {

    plural: {
      few: {
        female: [''],
        male: 'beim man #'
      },
      one: {
        female: ['plural-one-female # $(DirectText)'],
        male: 'plural-one-male $(DirectText)'
      },
      other: 'plural-other $(DirectText)',
      many: ''
    },
    ordinal: {
      one: ['erstes $(Hello)'],
      other: 'zweites $(Hello)'
    }
  },
  Hello: ['Hallo', 'Hi', 'Servus'],
  Slang: ['nasen', 'eumel', 'vögel']
};

const translations: LanguageDictionary<TextKeys> = {
  'de-DE': {
    PlaceHolderText: 'Text with {0}',
    NamedPlaceHolderText: 'Text two with {MyVariable}',
    DirectText: 'DirectText',
    TextArray: ['TextArray1', 'TextArray1'],
    WithTextLink: ['$(DirectText) with $(Slang)'],
    Gendered: {
      male: 'is male',
      female: 'is female'
    },
    Pluralized: {
      plural: {
        zero: 'zero',
        one: 'one',
        few: 'few',
        many: 'many',
        other: 'other',
        two: 'two'
      }
    },
    PluralizedWithGender: {

      plural: {
        few: {
          female: [''],
          male: 'beim man #'
        },
        one: {
          female: ['plural-one-female # $(DirectText)'],
          male: 'plural-one-male # $(DirectText)'
        },
        other: 'plural-other $(DirectText)',
        many: ''
      },
      ordinal: {
        one: ['erstes $(Hello)'],
        other: 'zweites $(Hello)'
      }
    },
    Hello: ['Hallo', 'Hi', 'Servus'],
    Slang: ['nasen', 'eumel', 'vögel']
  }
};

InitializeIntl(LanguageEnum.deDE, LanguageEnum.enGB);

const tlib = new TextLibrary<TextKeys>(translations);
const t = tlib.getTranslator(LanguageEnum.deDE);

const result = t.format({
  key: TextKeys.PluralizedWithGender,
  gender: GenderGroups.male,
  plural: {
    group: PluralGroups.plural,
    value: 1
  }
});
console.log(`format 1: ${result}`);

for (let index = 0; index < 10; index += 1) {
  console.log(`getPlural ${index}: ${t.getPlural(TextKeys.PluralizedWithGender, index)}`);
  console.log(`getOrdinals ${index}: ${t.getOrdinals(TextKeys.PluralizedWithGender, index)}`);
}
console.log(`getText: ${t.getText(TextKeys.Slang)}`);
