/* eslint-disable no-param-reassign */

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

export const formatProposalId = ({ communityId, community, proposer, proposalId }) =>
  `${communityId || community}/${proposer}/${proposalId}`;

export const formatReportId = proposal => {
  let reasonKey = proposal.reason;

  try {
    reasonKey = JSON.parse(proposal.reason)
      .sort()
      .join('|');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Invalid report reason');
  }

  return `${formatContentId(proposal.contentId)}/${proposal.author}/${reasonKey}`;
};

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

const proposalValidator = makeValidator('proposal', proposalType);

function processProposal(proposal) {
  proposal.communityId = proposal.community.communityId;
  proposal.proposerId = proposal.proposer.userId;

  proposal.contentId = {
    communityId: proposal.community.communityId,
    proposer: proposal.proposer.userId,
    proposalId: proposal.proposalId,
  };

  return proposalValidator(proposal);
}

export const proposalSchema = new schema.Entity(
  'proposals',
  {
    community: communitySchema,
    proposer: userSchema,
  },
  {
    idAttribute: formatProposalId,
    processStrategy: processProposal,
  }
);

export const postSchema = new schema.Entity(
  'posts',
  {
    author: userSchema,
    community: communitySchema,
    // proposal exists only in reports
    proposal: proposalSchema,
  },
  {
    idAttribute: post => formatContentId(post.contentId),
    processStrategy: post => {
      post.authorId = post.author.userId;
      post.communityId = post.community.communityId;
      return post;
    },
  }
);

function normalizeComment(comment) {
  comment.authorId = comment.author.userId;
  comment.communityId = comment.community.communityId;
  return comment;
}

export const nestedCommentSchema = new schema.Entity(
  'postComments',
  {
    author: userSchema,
    community: communitySchema,
  },
  {
    idAttribute: comment => formatContentId(comment.contentId),
    processStrategy: normalizeComment,
  }
);

export const commentSchema = new schema.Entity(
  'postComments',
  {
    author: userSchema,
    community: communitySchema,
    children: [nestedCommentSchema],
    // proposal exists only in reports
    proposal: proposalSchema,
  },
  {
    idAttribute: comment => formatContentId(comment.contentId),
    processStrategy: normalizeComment,
  }
);

export const updateCommentSchema = new schema.Entity(
  'updateComments',
  {
    author: userSchema,
    community: communitySchema,
  },
  {
    idAttribute: comment => formatContentId(comment.contentId),
    processStrategy: normalizeComment,
  }
);

export const profileCommentSchema = new schema.Entity(
  'profileComments',
  {
    author: userSchema,
    community: communitySchema,
  },
  {
    idAttribute: comment => formatContentId(comment.contentId),
    processStrategy: normalizeComment,
  }
);

export const notificationSchema = new schema.Entity(
  'notifications',
  {
    community: communitySchema,
    voter: userSchema,
    author: userSchema,
  },
  {
    idAttribute: notification => notification.id,
  }
);

export const reportSchema = new schema.Entity(
  'reports',
  {
    author: userSchema,
  },
  {
    idAttribute: report => formatReportId(report),
    processStrategy: report => {
      report.authorId = report.author.userId;
      return report;
    },
  }
);
