import { connect } from 'react-redux';

import { openDonateModal } from 'store/actions/modals';
import { formatContentId } from 'store/schemas/gate';
import {
  entitySelector,
  extendedPostCommentSelector,
  extendedPostSelector,
} from 'store/selectors/common';

import Donations from './Donations';

export default connect(
  (state, props) => {
    const formatedContentId = formatContentId(props.contentId);

    const entity = props.isComment
      ? extendedPostCommentSelector(formatedContentId)(state)
      : extendedPostSelector(formatedContentId)(state);

    return {
      entity,
      author: entitySelector('users', props.contentId.userId)(state),
      reward: entitySelector('rewards', formatedContentId)(state) || {},
      donations: entitySelector('donations', formatedContentId)(state) || {},
    };
  },
  {
    openDonateModal,
  }
)(Donations);
