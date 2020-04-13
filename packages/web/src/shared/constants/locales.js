import env from 'shared/env';

const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
];

const LANGUAGES = [
  {
    name: 'English',
    code: 'EN',
    flagCode: 'US',
  },
  {
    name: 'Русский',
    code: 'RU',
    flagCode: 'RU',
  },
];

if (env.HOST_ENV !== 'production') {
  LOCALES.push({ value: 'zh', label: '漢語' });
  LANGUAGES.push({
    name: '漢語',
    code: 'ZH',
    flagCode: 'CN',
  });
}

export { LOCALES, LANGUAGES };
