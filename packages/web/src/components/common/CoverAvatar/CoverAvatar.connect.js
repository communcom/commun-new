import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { entitySelector } from 'store/selectors/common';

import CoverAvatar from './CoverAvatar';

export default connect(
  (state, props) => {
    let avatarUrl;

    if (props.userId) {
      avatarUrl = entitySelector('profiles', props.userId)(state)?.personal?.avatarUrl;
    }

    if (props.communityId) {
      avatarUrl = entitySelector('communities', props.communityId)(state)?.avatarUrl;
    }

    return {
      avatarUrl,
    };
  },
  {
    openModal,
  }
)(CoverAvatar);
