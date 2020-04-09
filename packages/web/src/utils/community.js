import { i18n } from 'shared/i18n';

function generateRandomId(alphabet, length) {
  const id = [];

  for (let i = 0; i < length; i += 1) {
    id.push(alphabet.charAt(Math.floor(Math.random() * alphabet.length)));
  }

  return id.join('');
}

export function createRuleId() {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  return generateRandomId(ALPHABET, 8);
}

export function getDefaultRules(language) {
  const languageName = language?.name || 'English';
  const languageCode = language?.code || 'EN';

  const rulesFromLocales = i18n.t('components.createCommunity.rules.default_rules', {
    returnObjects: true,
    lng: languageCode.toLowerCase(),
    language: languageName,
  });

  const defaultRules = rulesFromLocales.map(rule => ({
    ...rule,
    id: createRuleId(),
  }));

  return defaultRules;
}
