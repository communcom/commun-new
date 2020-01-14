import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_POST } from 'store/constants';
import { extendedPostSelector } from 'store/selectors/common';

import { fetchPost } from 'store/actions/gate';
import { formatContentId } from 'store/schemas/gate';

import BanPost from './BanPost';

export default connect(
  (state, props) => {
    const { author, permlink } = props.proposal.data.message_id;
    const contentId = { communityId: props.proposal.communityId, userId: author, permlink };
    const post = extendedPostSelector(formatContentId(contentId))(state);

    return {
      post,
      contentId,
    };
  },
  {
    fetchPost,
    openPost: contentId => openModal(SHOW_MODAL_POST, { contentId }),
  }
)(BanPost);
