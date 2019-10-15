import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';
import { withRouter } from 'next/router';

import { recordPostView } from 'store/actions/gate/meta';
import { report } from 'store/actions/complex/content';
import { entitySelector, uiSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { formatContentId } from 'store/schemas/gate';

import Post from './Post';

export default withRouter(
  connect(
    (state, props) => {
      // const currentUser = currentUserSelector(state);
      const post = entitySelector('posts', formatContentId(props.contentId))(state);

      const user = entitySelector('users', props.contentId.userId)(state);
      let community = entitySelector('communities', post.community)(state);

      // TODO: Remove this later, currently api sometimes doesn't set community in data.
      if (!community) {
        community = {
          id: 'gls',
          name: 'GOLOS',
          avatarUrl: null,
        };
      }

      const screenType = uiSelector(['mode', 'screenType'])(state);
      const isOwner = isOwnerSelector(user.username)(state);
      const isOriginalContent = true;
      const isAdultContent = true;

      return {
        post,
        community,
        user,
        isOwner,
        isOriginalContent,
        isAdultContent,
        isMobile: screenType === 'mobile',
      };
    },
    {
      recordPostView,
      openModal,
      report,
    }
  )(Post)
);
