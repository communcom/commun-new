/* eslint-disable no-console */

import u from 'updeep';

export function saveDraft({ body, attachments, parentLink }, key) {
  try {
    if (body.toJSON) {
      // eslint-disable-next-line no-param-reassign
      body = body.toJSON();
    }

    const json = JSON.stringify({
      body,
      attachments,
      parentLink,
    });

    localStorage.setItem(key, json);
  } catch (err) {
    console.warn(`Failed when trying save ${key}!`, err);
  }
}

export function convertToArticle({ body, attachments }) {
  try {
    if (body.toJSON) {
      // eslint-disable-next-line no-param-reassign
      body = body.toJSON();
    }

    return u.updateIn(
      ['document', 'nodes'],
      nodes =>
        [
          {
            object: 'block',
            type: 'heading1',
            data: {},
            nodes: [
              {
                object: 'text',
                text: '',
                marks: [],
              },
            ],
          },
        ]
          .concat(nodes)
          .concat(
            attachments.map(attach => ({
              object: 'block',
              type: 'embed',
              nodes: [],
              data: {
                embed: attach,
              },
            }))
          ),
      body
    );
  } catch (err) {
    console.warn('Cant convert to article:', err);
    return null;
  }
}

export function removeDraft(key) {
  localStorage.removeItem(key);
}

export function loadDraft(key) {
  const draft = localStorage.getItem(key);

  let result = null;

  try {
    result = draft ? JSON.parse(draft) : null;
  } catch (err) {
    console.warn(`Failed when trying load ${key}!`, err);
  }

  return result;
}
