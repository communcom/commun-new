import { connect } from 'react-redux';

import { LANGUAGES } from 'shared/constants';
import { setCommunityInfo } from 'store/actions/commun';
import { openConfirmDialog } from 'store/actions/modals';
import { entitySelector } from 'store/selectors/common';

import CommunityLanguageEditModal from './CommunityLanguageEditModal';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);

    const language = LANGUAGES.find(item => item.code === community.language.toUpperCase());

    return {
      language,
    };
  },
  {
    openConfirmDialog,
    setCommunityInfo,
  }
)(CommunityLanguageEditModal);
