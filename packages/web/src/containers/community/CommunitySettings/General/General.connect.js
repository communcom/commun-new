import { connect } from 'react-redux';

import { LANGUAGES } from 'shared/constants';
import { setCommunityInfo } from 'store/actions/commun';
import { openModal } from 'store/actions/modals';
import { entitySelector } from 'store/selectors/common';
import { screenTypeUp } from 'store/selectors/ui';

import General from './General';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);
    const language = LANGUAGES.find(item => item.code === community.language.toUpperCase());

    return {
      community,
      isLeader: community.isLeader,
      language,
      isMobile: !screenTypeUp.tablet(state),
    };
  },
  {
    openModal,
    setCommunityInfo,
  }
)(General);
