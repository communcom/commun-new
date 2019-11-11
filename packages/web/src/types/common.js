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
  communityId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
});

const userFields = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  subscribersCount: PropTypes.number,
  postsCount: PropTypes.number,
  isSubscribed: PropTypes.bool,
};

export const userType = PropTypes.shape(userFields);

export const leaderType = PropTypes.shape({
  ...userFields,
  username: PropTypes.string, // У лидеров username опционален.
  communityId: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  url: PropTypes.string,
  rating: PropTypes.number.isRequired,
  ratingPercent: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  isVoted: PropTypes.bool,
});

export const contentIdType = PropTypes.shape({
  communityId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
});

export const commentContentType = PropTypes.shape({
  type: PropTypes.oneOf(['post']).isRequired,
  attributes: PropTypes.shape({
    type: PropTypes.oneOf(['comment']).isRequired,
    title: PropTypes.string,
    version: PropTypes.string.isRequired,
  }),
  content: PropTypes.arrayOf(PropTypes.shape({})),
});

const commonCommentFields = {
  author: PropTypes.string.isRequired,
  childCommentsCount: PropTypes.number,
  community: communityType.isRequired,
  content: commentContentType,
  contentId: contentIdType.isRequired,
  meta: PropTypes.shape({
    creationTime: PropTypes.string,
  }).isRequired,
  parents: PropTypes.shape({
    post: contentIdType,
    comment: contentIdType,
  }),
  type: PropTypes.string.isRequired,
  votes: votesType.isRequired,
};

export const commentType = PropTypes.shape(commonCommentFields);

// extend comment type with children array of commentType
commonCommentFields.children = PropTypes.arrayOf(commentType);

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
  leaderIn: PropTypes.arrayOf(PropTypes.string),
});

export const pointType = PropTypes.shape({
  symbol: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  decs: PropTypes.number,
  issuer: PropTypes.string,
  logo: PropTypes.string,
});

export const pointsArrayType = PropTypes.arrayOf(pointType);

export const transferType = PropTypes.shape({
  id: PropTypes.string,
  sender: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string,
  }),
  receiver: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string,
  }),
  timestamp: PropTypes.string,
  quantity: PropTypes.string,
  symbol: PropTypes.string,
});

export const transferHistoryType = PropTypes.arrayOf(transferType);

export const proposalType = PropTypes.shape({
  community: communityType.isRequired,
  proposer: userType.isRequired,
  proposalId: PropTypes.string.isRequired,
  contract: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  blockTime: PropTypes.string.isRequired,
  expiration: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  isApproved: PropTypes.bool, // Поле отсутствует если пользователь не авторизован
  approvesCount: PropTypes.number.isRequired,
  approvesNeed: PropTypes.number.isRequired,
  change: PropTypes.shape({
    type: PropTypes.string.isRequired,
    subType: PropTypes.string, // subType может не быть
    new: PropTypes.any,
    old: PropTypes.any,
  }),
});

export const reportType = PropTypes.shape({
  contentId: contentIdType.isRequired,
  author: userType.isRequired,
  reason: PropTypes.string.isRequired,
});

export const screenTypeType = PropTypes.oneOf(['mobile', 'mobileLandscape', 'tablet', 'desktop']);
