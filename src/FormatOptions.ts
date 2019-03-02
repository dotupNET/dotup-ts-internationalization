import { GenderGroups } from './GenderGroups';
import { PluralGroups } from './PluralGroup';

// tslint:disable-next-line: interface-name
export interface FormatOptions<T> {
  key: T;
  gender?: GenderGroups;
  plural?: { group?: PluralGroups, value: number };
}
