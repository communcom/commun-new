import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { entitySelector } from 'store/selectors/common';
import { UIModeSelector } from 'store/selectors/ui';

import CoverImage from './CoverImage';

export default connect(
  createSelector(
    [
      UIModeSelector('isDragAndDrop'),
      (state, props) => entitySelector('profiles', props.userId)(state)?.personal?.coverUrl,
    ],
    (isDragAndDrop, coverUrl) => ({
      isDragAndDrop,
      coverUrl,
    })
  )
)(CoverImage);
