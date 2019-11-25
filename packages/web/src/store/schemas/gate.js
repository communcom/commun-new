import { schema } from 'normalizr';
import PropTypes from 'prop-types';

import { userType, profileType, leaderType, communityType, proposalType } from 'types';

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/paularmstrong/normalizr

export const formatContentId = contentId =>
  `${contentId.communityId}/${contentId.userId}/${contentId.permlink}`;

export const formatProposalId = proposal =>
  `${proposal.community}/${proposal.proposer}/${proposal.proposalId}`;

export const formatReportId = proposal =>
  `${formatContentId(proposal.contentId)}/${proposal.author.userId}`;

function makeValidator(entityName, type) {
  return entity => {
    if (process.env.NODE_ENV !== 'production') {
      PropTypes.checkPropTypes(
        {
          [entityName]: type.isRequired,
        },
        {
          [entityName]: entity,
        },
        'field',
        'EntityValidator'
      );
    }

    return entity;
  };
}

export const userSchema = new schema.Entity(
  'users',
  {},
  {
    idAttribute: user => user.userId || user.id,
    processStrategy: makeValidator('user', userType),
  }
);

export const communitySchema = new schema.Entity(
  'communities',
  {
    friends: [userSchema],
  },
  {
    idAttribute: community => community.id || community.communityId,
    processStrategy: makeValidator('community', communityType),
  }
);

export const leaderSchema = new schema.Entity(
  'leaders',
  {},
  {
    idAttribute: leader => `${leader.communityId}/${leader.userId}`,
    processStrategy: makeValidator('leader', leaderType),
  }
);

export const userProfileSchema = new schema.Entity(
  'profiles',
  {},
  {
    idAttribute: profile => profile.userId,
    processStrategy: makeValidator('profile', profileType),
  }
);

export const postSchema = new schema.Entity(
  'posts',
  {
    author: userSchema,
    community: communitySchema,
  },
  {
    idAttribute: post => formatContentId(post.contentId),
  }
);

export const nestedCommentSchema = new schema.Entity(
  'postComments',
  {
    author: userSchema,
  },
  {
    idAttribute: comment => formatContentId(comment.contentId),
  }
);

export const commentSchema = new schema.Entity(
  'postComments',
  {
    author: userSchema,
    children: [nestedCommentSchema],
  },
  {
    idAttribute: comment => formatContentId(comment.contentId),
  }
);

export const profileCommentSchema = new schema.Entity(
  'profileComments',
  {
    author: userSchema,
  },
  {
    idAttribute: comment => formatContentId(comment.contentId),
  }
);

export const notificationSchema = new schema.Entity(
  'notifications',
  {},
  {
    // eslint-disable-next-line no-underscore-dangle
    idAttribute: notification => notification.id || notification._id,
  }
);

export const proposalSchema = new schema.Entity(
  'proposals',
  {
    community: communitySchema,
    proposer: userSchema,
  },
  {
    idAttribute: formatProposalId,
    processStrategy: makeValidator('proposal', proposalType),
  }
);

export const reportSchema = new schema.Entity(
  'reports',
  {
    author: userSchema,
  },
  {
    idAttribute: formatReportId,
  }
);
