/* eslint-disable import/prefer-default-export */

import { mergeEntities } from 'utils/store';
import { formatContentId } from 'store/schemas/gate';

export function applyCommentsUpdates(state, payload) {
  const entities = payload?.entities?.updateComments;

  if (entities) {
    return mergeEntities(state, entities, {
      transform: comment => ({
        type: 'comment',
        children: [], // getComment have not these fields
        childrenNew: [], // getComment have not these fields
        ...comment,
        id: formatContentId(comment.contentId),
      }),
      merge: true,
    });
  }

  return state;
}
