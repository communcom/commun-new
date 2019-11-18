/* eslint-disable import/prefer-default-export */

export function preparePostWithMention(username) {
  return {
    id: 1,
    type: 'post',
    attributes: {
      version: '1.0',
      type: 'basic',
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
