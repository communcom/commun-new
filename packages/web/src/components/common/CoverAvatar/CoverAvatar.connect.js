import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { entitySelector } from 'store/selectors/common';

import CoverAvatar from './CoverAvatar';

export default connect(
  (state, props) => {
    let entity = null;

    if (props.userId) {
      entity = entitySelector('profiles', props.userId)(state);
    } else if (props.communityId) {
      entity = entitySelector('communities', props.communityId)(state);
    } else if (props.isCommunityCreation) {
      return {
        isCommunityCreation: true,
        avatarUrl: props.avatarUrl,
      };
    }

    return {
      avatarUrl: entity?.avatarUrl,
    };
  },
  {
    openModal,
  }
)(CoverAvatar);
