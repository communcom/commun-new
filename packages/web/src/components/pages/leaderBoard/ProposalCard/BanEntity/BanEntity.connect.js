import { connect } from 'react-redux';

import { SHOW_MODAL_POST } from 'store/constants';
import { extendedPostSelector, extendedProfileCommentSelector } from 'store/selectors/common';
import { isNsfwShowSelector } from 'store/selectors/settings';

import { fetchPost, fetchComment } from 'store/actions/gate';
import { openModal } from 'store/actions/modals';
import { formatContentId } from 'store/schemas/gate';

import BanEntity from './BanEntity';

export default connect(
  (state, props) => {
    const { author, permlink } = props.proposal.data.message_id;
    const contentId = { communityId: props.proposal.communityId, userId: author, permlink };
    // TODO: string check should be removed when back will be ready
    const isComment =
      props.proposal?.contentType === 'comment' || (permlink && permlink.startsWith('re-'));
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
      isNsfwShow: isNsfwShowSelector(state),
    };
  },
  {
    fetchPost,
    fetchComment,
    openPost: (contentId, hash) => openModal(SHOW_MODAL_POST, { contentId, hash }),
  }
)(BanEntity);
