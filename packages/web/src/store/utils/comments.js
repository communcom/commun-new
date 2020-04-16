/* eslint-disable import/prefer-default-export */

import { mergeEntities } from 'utils/store';
import { formatContentId } from 'store/schemas/gate';

export function applyCommentsUpdates(state, payload) {
  const entities = payload?.entities?.updateComments;

  if (entities) {
    return mergeEntities(state, entities, {
      transform: comment => {
        const id = formatContentId(comment.contentId);

        return {
          type: 'comment',
          children: state[id]?.children || [], // getComment have not these fields
          childrenNew: state[id]?.childrenNew || [], // getComment have not these fields
          ...comment,
          id,
        };
      },
      merge: true,
    });
  }

  return state;
}
