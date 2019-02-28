import { LanguageEnum } from './LanguageEnum';
import { TextLibrary, Translations } from './TextLibrary';

// export declare type TextKeysType = 'Hello' | 'Welcome' | 'Slang' | 'Pussy';
export enum TextKeys { 'Hello' = 'Hello', 'Welcome' = 'Welcome', 'Slang' = 'Slang' }
// export declare type LanguageCode = 'de' | 'en'; // " | "en-US" | "en-GB" | "en-CA" | "en-IN" | "de-DE";

// const texts: NestedPartialObject<LanguageEnum, TextKeys, string | string[]> = {
//   'de-DE': {
//     Welcome: ['$(Hello) ihr $(Slang)'],
//     Hello: ['Hallo', 'Hi', 'Servus'],
//     Slang: ['nasen', 'eumel', 'vögel'],
//     // Pussy: 'Ahja'
//     // Pussy: ['$(Hello) ihr nasen']
//   }
// };

const textss: Translations<TextKeys> = {
  'de-DE': {
    Welcome: ['$(Hello) ihr $(Slang)'],
    Hello: ['Hallo', 'Hi', 'Servus'],
    Slang: ['nasen', 'eumel', 'vögel']
    // Pussy: 'Ahja'
    // Pussy: ['$(Hello) ihr nasen']
  }
};

const tlib = new TextLibrary(textss);
const t = tlib.getTranslator(LanguageEnum.deDE);

for (let index = 0; index < 10; index += 1) {
  console.log(t.getText(TextKeys.Welcome));
}
console.log(t.getText(TextKeys.Slang));
