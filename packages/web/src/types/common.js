/* eslint-disable import/prefer-default-export */

import PropTypes from 'prop-types';

// TODO: after refactoring prism
// export const payoutType = PropTypes.shape({
//   rShares: PropTypes.number.isRequired,
// });

export const votesType = PropTypes.shape({
  hasUpVote: PropTypes.bool,
  hasDownVote: PropTypes.bool,
});

export const communityType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
});

export const userType = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
});

export const contentIdType = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
});

const post = {
  id: PropTypes.string.isRequired,
  contentId: contentIdType.isRequired,
  community: PropTypes.string.isRequired,
  author: PropTypes.string,
  content: PropTypes.shape({
    type: PropTypes.oneOf(['post']).isRequired,
    attributes: PropTypes.shape({
      type: PropTypes.oneOf(['basic', 'article']).isRequired,
      title: PropTypes.string,
      version: PropTypes.string.isRequired,
    }),
    content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }),
  stats: PropTypes.shape({
    commentsCount: PropTypes.number.isRequired,
  }).isRequired,
  votes: votesType,
  meta: PropTypes.shape({
    creationTime: PropTypes.string.isRequired,
  }).isRequired,
};

export const postType = PropTypes.shape(post);

export const extendedPostType = PropTypes.shape({
  ...post,
  author: userType.isRequired,
  community: communityType.isRequired,
});

export const profileType = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  personal: PropTypes.shape({
    avatarUrl: PropTypes.string,
    coverUrl: PropTypes.string,
    biography: PropTypes.string,
    contacts: PropTypes.shape({
      telegram: PropTypes.string,
      whatsApp: PropTypes.string,
      weChat: PropTypes.string,
      facebookMessenger: PropTypes.string,
    }),
  }),
  registration: PropTypes.shape({
    time: PropTypes.string.isRequired,
  }).isRequired,
  stats: PropTypes.shape({
    postsCount: PropTypes.number.isRequired,
  }).isRequired,
});

const commonCommentFields = {
  author: PropTypes.string.isRequired,
  content: PropTypes.shape({
    body: PropTypes.shape({
      full: PropTypes.string.isRequired,
      preview: PropTypes.string,
    }).isRequired,
    metadata: PropTypes.shape({}),
  }).isRequired,
  contentId: contentIdType.isRequired,
  meta: PropTypes.shape({
    time: PropTypes.any,
  }).isRequired,
  parent: PropTypes.shape({
    comment: PropTypes.shape({
      contentId: PropTypes.shape({
        permlink: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
      }),
    }),
    post: PropTypes.shape({
      community: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
      content: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
  // payout: payoutType.isRequired, // TODO: after refactoring prism
  votes: votesType.isRequired,
};

export const commentType = PropTypes.shape(commonCommentFields);

export const pointType = PropTypes.shape({
  symbol: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  decs: PropTypes.number,
  issuer: PropTypes.string,
  logo: PropTypes.string,
});

export const pointsArrayType = PropTypes.arrayOf(pointType);
