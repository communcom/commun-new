/* eslint-disable import/prefer-default-export */

import { EDITOR_VERSION } from 'shared/constants';

export function preparePostWithMention(username) {
  return {
    id: 1,
    type: 'post',
    attributes: {
      version: EDITOR_VERSION,
      type: 'comment',
    },
    content: [
      {
        id: 2,
        type: 'paragraph',
        content: [
          {
            id: 3,
            type: 'mention',
            content: username,
          },
          {
            id: 4,
            type: 'text',
            content: ', ',
          },
        ],
      },
    ],
  };
}
