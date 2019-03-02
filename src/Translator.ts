import { FormatOptions } from './FormatOptions';

// tslint:disable:no-any
// tslint:disable-next-line: interface-name
export interface Translator<T extends string> {
  // format(options: FormatOptions<T>, ...args: any[]): string;
  format(options: T | FormatOptions<T>, ...args: any[]): string;
  getText(key: T, ...args: any[]): string;
  getTexts(key: T, ...args: any[]): string[];
  getPlural(key: T, count: number, ...args: any[]): string;
  getPlurals(key: T, count: number, ...args: any[]): string[];
  getOrdinals(key: T, count: number, ...args: any[]): string[];
}
