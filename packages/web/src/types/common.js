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
  alias: PropTypes.string.isRequired,
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

export const userCompactType = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
});

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

export const commentDocumentType = PropTypes.shape({
  type: PropTypes.oneOf(['document', 'comment']).isRequired,
  attributes: PropTypes.shape({
    type: PropTypes.oneOf(['comment']).isRequired,
    title: PropTypes.string,
    version: PropTypes.string,
  }),
  content: PropTypes.arrayOf(PropTypes.shape({})),
});

const commonCommentFields = {
  author: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.string),
  childCommentsCount: PropTypes.number,
  community: communityType.isRequired,
  communityId: PropTypes.string.isRequired,
  document: commentDocumentType,
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
  isDeleted: PropTypes.bool,
};

export const commentType = PropTypes.shape(commonCommentFields);

const post = {
  id: PropTypes.string.isRequired,
  contentId: contentIdType.isRequired,
  community: PropTypes.string.isRequired,
  communityId: PropTypes.string.isRequired,
  author: PropTypes.string,
  authorId: PropTypes.string,
  content: PropTypes.shape({
    type: PropTypes.oneOf(['post']).isRequired,
    attributes: PropTypes.shape({
      type: PropTypes.oneOf(['basic', 'article']).isRequired,
      title: PropTypes.string,
      version: PropTypes.string.isRequired,
    }),
    content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }),
  textLength: PropTypes.number.isRequired,
  stats: PropTypes.shape({
    commentsCount: PropTypes.number.isRequired,
  }).isRequired,
  votes: votesType,
  meta: PropTypes.shape({
    creationTime: PropTypes.string.isRequired,
  }).isRequired,
};

export const postType = PropTypes.shape(post);

export const fullPostType = PropTypes.shape({
  ...post,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
});

export const extendedPostType = PropTypes.shape({
  ...post,
  author: userType.isRequired,
  community: communityType.isRequired,
});

export const extendedFullPostType = PropTypes.shape({
  ...post,
  author: userType.isRequired,
  community: communityType.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
});

export const extendedCommentType = PropTypes.shape({
  ...commonCommentFields,
  author: userType.isRequired,
  community: communityType.isRequired,
});

export const profileType = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  coverUrl: PropTypes.string,
  personal: PropTypes.shape({
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
  communityId: PropTypes.string.isRequired,
  proposer: userType.isRequired,
  proposerId: PropTypes.string.isRequired,
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
  authorId: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired,
});

export const screenTypeType = PropTypes.oneOf(['mobile', 'mobileLandscape', 'tablet', 'desktop']);

export const notificationType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  eventType: PropTypes.oneOf(['upvote', 'mention', 'subscribe']).isRequired,
  timestamp: PropTypes.string.isRequired,
  isNew: PropTypes.bool.isRequired,
  // Field "community" presents not in all notification types
  community: communityType,

  // Additional fields for "upvote", "mention" types:
  entityType: PropTypes.oneOf(['post', 'comment']),
  post: PropTypes.shape({
    contentId: contentIdType.isRequired,
    shortText: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
  comment: PropTypes.shape({
    contentId: contentIdType.isRequired,
    shortText: PropTypes.string,
    imageUrl: PropTypes.string,
  }),

  // Additional fields for "upvote" type:
  voter: userCompactType,
});
