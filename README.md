[![Build Status](https://travis-ci.org/dotupNET/dotup-ts-internationalization.svg?branch=skill-template)](https://travis-ci.org/dotupNET/dotup-ts-internationalization)

# dotup-ts-internationalization
Library for typed translation and internationalization

## USAGE

```typescript

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

const translations: Translations<TextKeys> = {
  'de-DE': {
    PlaceHolderText: 'Text with {0}',
    NamedPlaceHolderText: 'Text two with {MyVariable}',
    DirectText: 'DirectText',
    TextArray: ['TextArray1', 'TextArray2'],
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
          male: 'he has #'
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

// Initialize required languages
InitializeIntl(LanguageEnum.deDE, LanguageEnum.enGB);

// Initialize text library with text
const tlib = new TextLibrary(translations);
// Get a translator for a specific language
const t = tlib.getTranslator(LanguageEnum.deDE);

// Translate
const result = t.format({
  key: TextKeys.PluralizedWithGender,
  gender: GenderGroups.male,
  plural: {
    group: PluralGroups.plural,
    value: 1
  }
});
console.log(`format 1: ${result}`);

```


## Docs:
https://dotupnet.github.io/dotup-ts-internationalization/index.html

## repository:
https://github.com/dotupNET/dotup-ts-internationalization/tree/skill-template
