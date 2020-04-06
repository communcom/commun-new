import {
  COMMUNITY_CREATION_SET_AVATAR,
  COMMUNITY_CREATION_SET_COVER,
  COMMUNITY_CREATION_SET_NAME,
  COMMUNITY_CREATION_SET_LANGUAGE,
  COMMUNITY_CREATION_SET_DESCRIPTION,
  COMMUNITY_CREATION_SET_RULE,
  COMMUNITY_CREATION_REMOVE_RULE,
  COMMUNITY_CREATION_RESTORE_DATA,
} from 'store/constants/actionTypes';

import { COMMUNITY_CREATION_KEY } from 'shared/constants';
import { setFieldValue } from 'utils/localStore';

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
