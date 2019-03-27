import intlLocalesSupported from 'intl-locales-supported';
import { LanguageEnum } from './LanguageEnum';

export function InitializeIntl(...requiredLocales: LanguageEnum[]) {
  if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!intlLocalesSupported(requiredLocales)) {
      // `Intl` exists, but it doesn't have the data we need, so load the
      // polyfill and patch the constructors we need with the polyfill's.
      // tslint:disable-next-line:no-require-imports
      const IntlPolyfill = require('intl');
      Intl.NumberFormat = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
  } else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl');
  }
}
