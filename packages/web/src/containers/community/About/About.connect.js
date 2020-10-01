import { connect } from 'react-redux';

import { LANGUAGES } from 'shared/constants';
import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_COMMUNITY_LANGUAGE_EDIT, SHOW_MODAL_DESCRIPTION_EDIT } from 'store/constants';
import { entitySelector } from 'store/selectors/common';

import About from './About';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);
    const language = LANGUAGES.find(item => item.code === community.language.toUpperCase());

    return {
      communityAlias: community.alias,
      description: community.description || '',
      language,
      subject: community.subject || '',
    };
  },
  {
    openDescriptionEditModal: ({ communityId, description }) =>
      openModal(SHOW_MODAL_DESCRIPTION_EDIT, { communityId, description }),
    openCommunityLanguageEditModal: ({ communityId }) =>
      openModal(SHOW_MODAL_COMMUNITY_LANGUAGE_EDIT, { communityId }),
  }
)(About);
