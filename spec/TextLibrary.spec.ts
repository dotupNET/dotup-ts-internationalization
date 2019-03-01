import { TextLibrary, Translations } from '../src/TextLibrary';
import { LanguageEnum } from '../src/LanguageEnum';

export enum TextKeys {
  'Hello' = 'Hello',
  'Welcome' = 'Welcome',
  'Slang' = 'Slang',
  Pluralized = 'Pluralized',
  konkret = 'konkret',
  replace = 'replace',
  replaceAdvanced = 'replaceAdvanced',
  replaceObject = 'replaceObject'
}

const translations: Translations<TextKeys> = {
  'de-DE': {
    Welcome: ['$(Hello) ihr $(Slang)'],
    Hello: ['Hallo', 'Hi', 'Servus'],
    Slang: ['nasen', 'eumel', 'vögel'],
    konkret: 'konkret',
    replace: 'wo ist {0}',
    replaceAdvanced: 'wo ist {player1} und {player2}',
    replaceObject: '{playerName} wo ist {otherName}',
    Pluralized: {
      one: 'only one'
    }
  }
};

describe('TextLibrary', () => {


  it('should relace text', () => {

    const value = new TextLibrary(translations);
    expect(value)
      .toBeTruthy();

    const t = value.getTranslator(LanguageEnum.deDE);
    let text = t.getText(TextKeys.Welcome);
    expect(text)
      .toBeTruthy();

    text = t.getText(TextKeys.Pluralized);
    expect(text)
      .toBe('only one');

    text = t.getText(TextKeys.konkret);
    expect(text)
      .toBe('konkret');

    text = t.getText(TextKeys.replace, 'egon');
    expect(text)
      .toBe('wo ist egon');

    text = t.getText(TextKeys.replaceObject, { playerName: 'franz', otherName: 'tina' });
    expect(text)
      .toBe('franz wo ist tina');

    // text = t.getText(TextKeys.replace, { player1: 'gunther', player2: 'gabi' });
    // expect(text)
    //   .toBe('wo ist gunther und gabi');

  });

});
