// tslint:disable:newline-per-chained-call
import { GenderGroups } from '../src/GenderGroups';
import { InitializeIntl } from '../src/IntlInitializer';
import { LanguageEnum } from '../src/LanguageEnum';
import { PluralGroups } from '../src/PluralGroup';
import { TextLibrary } from '../src/TextLibrary';
import { Translator } from '../src/Translator';
import { LanguageDictionary } from '../src/Types';

InitializeIntl(LanguageEnum.deDE, LanguageEnum.enGB);

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
          male: 'beim man'
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

describe('TextLibrary', () => {

  let textlib: TextLibrary<TextKeys>;
  let t: Translator<TextKeys>;

  beforeAll(() => {
    textlib = new TextLibrary(translations);
    t = textlib.getTranslator(LanguageEnum.deDE);
  });

  it('should create instace TextLibrary', () => {
    expect(textlib instanceof TextLibrary).toBeTruthy();
  });

  it('should get translator', () => {
    expect(t !== undefined).toBeTruthy();
  });

  it('should get direct text', () =>
    expect(t.format(TextKeys.DirectText)).toBe('DirectText')
  );

  it('should get text from array', () => {
    const result = t.format(TextKeys.TextArray);
    const isInSource = (<[]>translations['de-DE'].TextArray).some(item => item === result);
    expect(isInSource).toBeTruthy();
  });

  it('should replace text', () =>
    expect(
      t.format(TextKeys.PlaceHolderText, 'Replaced Text')
    ).toBe('Text with Replaced Text')
  );

  it('should replace text with object ', () =>
    expect(
      t.format(TextKeys.NamedPlaceHolderText, { MyVariable: 'other Text' })
    ).toBe('Text two with other Text')
  );

  it('should get text with text links', () =>
    expect(t.format(TextKeys.WithTextLink).startsWith('DirectText with')).toBeTruthy()
  );

  it('should get male Gender', () =>
    expect(t.format({
      key: TextKeys.Gendered,
      gender: GenderGroups.male
    })
    ).toBe('is male')
  );

  it('should get female Gender', () =>
    expect(t.format({
      key: TextKeys.Gendered,
      gender: GenderGroups.female
    })
    ).toBe('is female')
  );

  it('should get pluralized with cardinal group ', () =>
    expect(t.format({
      key: TextKeys.Pluralized,
      plural: { group: PluralGroups.plural, value: 0 }
    })
    ).toBe('other')
  );

  it('should get pluralized with cardinal group ', () =>
    expect(t.format({
      key: TextKeys.Pluralized,
      plural: { group: PluralGroups.plural, value: 1 }
    })
    ).toBe('one')
  );

  it('should get pluralized with cardinal group ', () =>
    expect(t.format({
      key: TextKeys.Pluralized,
      plural: { group: PluralGroups.plural, value: 2 }
    })
    ).toBe('other')
  );

  it('should get plural one male', () => {
    const result = t.format({
      key: TextKeys.PluralizedWithGender,
      gender: GenderGroups.male,
      plural: {
        group: PluralGroups.plural,
        value: 1
      }
    });

    expect(result).toBe('plural-one-male DirectText');
  });

  it('should get plural one female', () => {
    const result = t.format({
      key: TextKeys.PluralizedWithGender,
      gender: GenderGroups.female,
      plural: {
        group: PluralGroups.plural,
        value: 1
      }
    });

    expect(result).toBe('plural-one-female 1 DirectText');
  });

  it('should get plural other', () => {
    const result = t.format({
      key: TextKeys.PluralizedWithGender,
      plural: {
        group: PluralGroups.plural,
        value: 99
      }
    });

    expect(result).toBe('plural-other DirectText');
  });

});
