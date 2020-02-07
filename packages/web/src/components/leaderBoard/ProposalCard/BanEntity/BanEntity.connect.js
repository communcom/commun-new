import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_POST } from 'store/constants';
import { extendedPostSelector, extendedProfileCommentSelector } from 'store/selectors/common';

import { fetchPost, fetchComment } from 'store/actions/gate';
import { formatContentId } from 'store/schemas/gate';

import BanEntity from './BanEntity';

export default connect(
  (state, props) => {
    const { author, permlink } = props.proposal.data.message_id;
    const contentId = { communityId: props.proposal.communityId, userId: author, permlink };
    // TODO: string check should be removed when back will be ready
    const isComment =
      props.proposal?.type === 'comment' || (permlink && permlink.startsWith('re-'));
    let entity;

    if (isComment) {
      entity = extendedProfileCommentSelector(formatContentId(contentId))(state);
    } else {
      entity = extendedPostSelector(formatContentId(contentId))(state);
    }

    return {
      entity,
      contentId,
      isComment,
    };
  },
  {
    fetchPost,
    fetchComment,
    openPost: (contentId, hash) => openModal(SHOW_MODAL_POST, { contentId, hash }),
  }
)(BanEntity);
