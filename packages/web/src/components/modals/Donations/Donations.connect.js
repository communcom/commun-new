import { connect } from 'react-redux';

import { claimPost } from 'store/actions/commun';
import { openDonateModal } from 'store/actions/modals';
import { formatContentId } from 'store/schemas/gate';
import {
  entitySelector,
  extendedPostCommentSelector,
  extendedPostSelector,
  extendedProfileCommentSelector,
} from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import Donations from './Donations';

export default connect(
  (state, props) => {
    const formatedContentId = formatContentId(props.contentId);

    let entity = null;
    if (props.isComment) {
      if (props.isProfile) {
        entity = extendedProfileCommentSelector(formatedContentId)(state);
      } else {
        entity = extendedPostCommentSelector(formatedContentId)(state);
      }
    } else {
      entity = extendedPostSelector(formatedContentId)(state);
    }

    const isOwner = isOwnerSelector(props.contentId.userId)(state);

    return {
      isOwner,
      entity,
      author: entitySelector('users', props.contentId.userId)(state),
      reward: entitySelector('rewards', formatedContentId)(state) || {},
      donations: entitySelector('donations', formatedContentId)(state) || {},
    };
  },
  {
    claimPost,
    openDonateModal,
  }
)(Donations);
