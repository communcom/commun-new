import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { UIModeSelector } from 'store/selectors/ui';
import { entitySelector } from 'store/selectors/common';

import CoverAvatar from './CoverAvatar';

export default connect(
  createSelector(
    [
      UIModeSelector('isDragAndDrop'),
      (state, { userId }) => (userId ? entitySelector('users', userId)(state) : null),
      (state, { communityId }) =>
        communityId ? entitySelector('communities', communityId)(state) : null,
    ],
    (isDragAndDrop, user, community) => {
      let entityId;

      if (user) {
        entityId = user.userId;
      }

      if (community) {
        entityId = community.id;
      }

      return {
        isDragAndDrop,
        entityId,
      };
    }
  )
)(CoverAvatar);
