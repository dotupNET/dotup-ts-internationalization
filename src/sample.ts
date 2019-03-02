import { LanguageEnum } from './LanguageEnum';
import { TextLibrary } from './TextLibrary';
import { InitializeIntl } from './IntlInitializer';
import { GenderGroups } from './GenderGroups';
import { PluralGroups } from './PluralGroup';
import { PluralCategory } from './PluralCategory';
import { LanguageDictionary, TranslationDictionary } from './Types';


const utility = {
  escapeQuotes: function (string: string) {
    return string.replace(/"/g, '\\"');
  },
  unescapeQuotes: function (string: string) {
    return string.replace(/\\"/g, '"');
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
}

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


const a: any = translations['de-DE'];
const xxx = a.ExtendedPluralized['plural']['few'];
const isPluralGroup = Object.keys(PluralGroups).some(group => Object.keys(xxx).some(item => item === group));
const isPluralCategory = Object.keys(PluralCategory).some(group => Object.keys(xxx).some(item => item === group));
const isGenderGroup = Object.keys(GenderGroups).some(group => Object.keys(xxx).some(item => item === group));

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
