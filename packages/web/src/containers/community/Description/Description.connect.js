import { connect } from 'react-redux';

import { SHOW_MODAL_DESCRIPTION_EDIT } from 'store/constants';
import { entitySelector } from 'store/selectors/common';
import { openModal } from 'store/actions/modals';

import Description from './Description';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);

    return {
      description: community.description || '',
    };
  },
  {
    openDescriptionEditModal: ({ communityId, description }) =>
      openModal(SHOW_MODAL_DESCRIPTION_EDIT, { communityId, description }),
  }
)(Description);
