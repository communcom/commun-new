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
    { value: 'vi', label: 'Tiếng Việt' }
  );
  LANGUAGES.push(
    {
      name: 'Deutsche',
      code: 'DE',
      flagCode: 'DE',
    },
    {
      name: '漢語',
      code: 'ZH',
      flagCode: 'CN',
    },
    {
      name: 'Tiếng Việt',
      code: 'VI',
      flagCode: 'VN',
    }
  );
}

export { LOCALES, LANGUAGES };
