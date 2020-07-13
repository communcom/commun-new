import { COMMUNITY_CREATION_KEY } from 'shared/constants';
import { setFieldValue } from 'utils/localStore';
import {
  COMMUNITY_CREATION_REMOVE_DATA,
  COMMUNITY_CREATION_REMOVE_RULE,
  COMMUNITY_CREATION_RESTORE_DATA,
  COMMUNITY_CREATION_SET_AVATAR,
  COMMUNITY_CREATION_SET_COVER,
  COMMUNITY_CREATION_SET_DEFAULT_RULES,
  COMMUNITY_CREATION_SET_DESCRIPTION,
  COMMUNITY_CREATION_SET_LANGUAGE,
  COMMUNITY_CREATION_SET_NAME,
  COMMUNITY_CREATION_SET_RULE,
  COMMUNITY_CREATION_SET_SUBJECT,
} from 'store/constants/actionTypes';

export function setAvatar(url) {
  setFieldValue(COMMUNITY_CREATION_KEY, 'avatarUrl', url);

  return {
    type: COMMUNITY_CREATION_SET_AVATAR,
    payload: { avatarUrl: url },
  };
}

export function setCover(url) {
  setFieldValue(COMMUNITY_CREATION_KEY, 'coverUrl', url);

  return {
    type: COMMUNITY_CREATION_SET_COVER,
    payload: { coverUrl: url },
  };
}

export function setName(name) {
  setFieldValue(COMMUNITY_CREATION_KEY, 'name', name);

  return {
    type: COMMUNITY_CREATION_SET_NAME,
    payload: { name },
  };
}

export function setLanguage(language) {
  setFieldValue(COMMUNITY_CREATION_KEY, 'language', language);

  return {
    type: COMMUNITY_CREATION_SET_LANGUAGE,
    payload: { language },
  };
}

export function setSubject(subject) {
  setFieldValue(COMMUNITY_CREATION_KEY, 'subject', subject);

  return {
    type: COMMUNITY_CREATION_SET_SUBJECT,
    payload: { subject },
  };
}

export function setDescription(description) {
  setFieldValue(COMMUNITY_CREATION_KEY, 'description', description);

  return {
    type: COMMUNITY_CREATION_SET_DESCRIPTION,
    payload: { description },
  };
}

export function setRule(rule) {
  return {
    type: COMMUNITY_CREATION_SET_RULE,
    payload: { rule },
  };
}

export function setDefaultRules(rules) {
  return {
    type: COMMUNITY_CREATION_SET_DEFAULT_RULES,
    payload: { rules },
  };
}

export function removeRule(ruleId) {
  return {
    type: COMMUNITY_CREATION_REMOVE_RULE,
    payload: { ruleId },
  };
}

export function restoreData(data) {
  return {
    type: COMMUNITY_CREATION_RESTORE_DATA,
    payload: { data },
  };
}

export function removeData() {
  localStorage.removeItem(COMMUNITY_CREATION_KEY);

  return {
    type: COMMUNITY_CREATION_REMOVE_DATA,
  };
}
