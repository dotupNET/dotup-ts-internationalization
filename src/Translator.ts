import { FormatOptions } from './FormatOptions';

// tslint:disable:no-any
// tslint:disable-next-line: interface-name
export interface Translator<T extends string> {
  // format(options: FormatOptions<T>, ...args: any[]): string;
  format(options: T | string | FormatOptions<T | string>, ...args: any[]): string;
  getText(key: T | string, ...args: any[]): string;
  getTexts(key: T | string, ...args: any[]): string[];
  getPlural(key: T | string, count: number, ...args: any[]): string;
  getPlurals(key: T | string, count: number, ...args: any[]): string[];
  getOrdinals(key: T | string, count: number, ...args: any[]): string[];
}
