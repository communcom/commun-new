import env from 'shared/env';

const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'fr', label: 'Français' },
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
  {
    name: 'Français',
    code: 'FR',
    flagCode: 'FR',
  },
];

if (env.WEB_HOST_ENV !== 'production') {
  LOCALES.push(
    { value: 'zh', label: '漢語' },
    { value: 'de', label: 'Deutsche' },
    { value: 'vi', label: 'Tiếng Việt' }
  );
  LANGUAGES.push(
    {
      name: '漢語',
      code: 'ZH',
      flagCode: 'CN',
    },
    {
      name: 'Deutsche',
      code: 'DE',
      flagCode: 'DE',
    },
    {
      name: 'Tiếng Việt',
      code: 'VI',
      flagCode: 'VN',
    }
  );
}

export { LOCALES, LANGUAGES };
