import { GenderGroups } from './GenderGroups';
import { PluralGroups } from './PluralGroup';

// tslint:disable-next-line: interface-name
export interface FormatOptions<T extends string> {
  key: T;
  gender?: GenderGroups;
  plural?: { group?: PluralGroups; value: number };
}
