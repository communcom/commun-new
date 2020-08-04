import uniq from 'ramda/src/uniq';
import u from 'updeep';

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

const initialState = {
  name: '',
  avatarUrl: '',
  coverUrl: '',
  language: null,
  description: '',
  rules: [],
  subject: '',
};

export default function reducerDataCreateCommunity(state = initialState, { type, payload = {} }) {
  switch (type) {
    case COMMUNITY_CREATION_SET_AVATAR:
      return {
        ...state,
        avatarUrl: payload.avatarUrl,
      };

    case COMMUNITY_CREATION_SET_COVER:
      return {
        ...state,
        coverUrl: payload.coverUrl,
      };

    case COMMUNITY_CREATION_SET_NAME:
      return {
        ...state,
        name: payload.name,
      };

    case COMMUNITY_CREATION_SET_LANGUAGE:
      return {
        ...state,
        language: payload.language,
      };

    case COMMUNITY_CREATION_SET_SUBJECT:
      return {
        ...state,
        subject: payload.subject,
      };

    case COMMUNITY_CREATION_SET_DESCRIPTION:
      return {
        ...state,
        description: payload.description,
      };

    case COMMUNITY_CREATION_SET_RULE: {
      const { type: actionType, data } = payload.rule;

      switch (actionType) {
        case 'add':
          return {
            ...state,
            rules: uniq(state.rules.concat(payload.rule.data)),
          };

        case 'update': {
          const ruleIndex = state.rules.findIndex(rule => rule.id === data.id);
          return {
            ...state,
            rules: u.updateIn(`${ruleIndex}`, data, state.rules),
          };
        }

        default:
          return state;
      }
    }

    case COMMUNITY_CREATION_SET_DEFAULT_RULES: {
      return {
        ...state,
        rules: payload.rules,
      };
    }

    case COMMUNITY_CREATION_REMOVE_RULE:
      return {
        ...state,
        rules: state.rules.filter(rule => rule.id !== payload.ruleId),
      };

    case COMMUNITY_CREATION_RESTORE_DATA:
      return {
        ...state,
        ...payload.data,
      };

    case COMMUNITY_CREATION_REMOVE_DATA:
      return initialState;

    default:
      return state;
  }
}
