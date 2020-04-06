/* eslint-disable react/destructuring-assignment */
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { entitySelector } from 'store/selectors/common';
import { UIModeSelector, screenTypeUp } from 'store/selectors/ui';

import CoverImage from './CoverImage';

export default connect(
  createSelector(
    [
      UIModeSelector('isDragAndDrop'),
      screenTypeUp.desktop,
      (state, props) => {
        if (props.userId) {
          return entitySelector('profiles', props.userId)(state)?.coverUrl;
        }

        if (props.communityId) {
          return entitySelector('communities', props.communityId)(state)?.coverUrl;
        }

        if (props.isCommunityCreation) {
          return props.coverUrl;
        }

        return null;
      },
    ],
    (isDragAndDrop, isDesktop, coverUrl) => ({
      isDragAndDrop,
      isDesktop,
      coverUrl,
    })
  )
)(CoverImage);
