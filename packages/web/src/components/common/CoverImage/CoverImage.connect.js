/* eslint-disable react/destructuring-assignment */
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { entitySelector } from 'store/selectors/common';
import { UIModeSelector } from 'store/selectors/ui';

import CoverImage from './CoverImage';

export default connect(
  createSelector(
    [
      UIModeSelector('isDragAndDrop'),
      (state, props) => {
        if (props.userId) {
          return entitySelector('profiles', props.userId)(state)?.personal?.coverUrl;
        }

        if (props.communityId) {
          return entitySelector('communities', props.communityId)(state)?.coverUrl;
        }

        return null;
      },
    ],
    (isDragAndDrop, coverUrl) => ({
      isDragAndDrop,
      coverUrl,
    })
  )
)(CoverImage);
