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

if (env.WEB_HOST_ENV !== 'production') {
  LOCALES.push(
    { value: 'zh', label: '漢語' },
    { value: 'de', label: 'Deutsche' },
    { value: 'fr', label: 'Français' },
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
      name: 'Français',
      code: 'FR',
      flagCode: 'FR',
    },
    {
      name: 'Tiếng Việt',
      code: 'VI',
      flagCode: 'VN',
    }
  );
}

export { LOCALES, LANGUAGES };
