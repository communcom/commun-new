import isEqual from 'react-fast-compare';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { path as ramdaPath, isNil } from 'ramda';

// utils for selectors
const toArray = path => (Array.isArray(path) ? path : [path]);

export const createFastEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const emptySelector = () => null;

// Структура хранения данных приложения следующая
/*
{
    status: {
        contents: { ... },
        ...
    },
    entities: {
        contents: { ... },
        ...
    }
}
*/

// Выбирает конкретный статус из стора.
// С помощью переменной type указывается тип статуса.
export const statusSelector = path => state => ramdaPath(toArray(path))(state.status);

export const statusWidgetSelector = path => state => ramdaPath(toArray(path))(state.status.widgets);
export const statusLeaderBoardSelector = path => state =>
  ramdaPath(toArray(path))(state.status.leaderBoard);

// Выбирает конкретные сущности из стора.
// С помощью переменной type указывается тип сущности.
export const entitiesSelector = type => state => state.entities[type];

// Entities selectors

// Возвращает конкретную сушность по указанному типу (type) сущности и её id
export const entitySelector = (type, id) => {
  if (!type) {
    throw new Error('Invalid type');
  }

  if (isNil(id)) {
    return emptySelector;
  }

  return state => entitiesSelector(type)(state)[id];
};

export const modeSelector = state => state.ui.mode;

// Выбирает поле ui из стора
export const uiSelector = path => state => ramdaPath(toArray(path))(state.ui);

export const dataSelector = path => state => ramdaPath(toArray(path))(state.data);

export const extendedPostSelector = postId => state => {
  const post = entitySelector('posts', postId)(state);

  if (!post) {
    return null;
  }

  return {
    ...post,
    author: entitySelector('users', post.authorId)(state),
    community: entitySelector('communities', post.communityId)(state),
  };
};

const makeExtendedCommentSelector = entityName => commentId => state => {
  const comment = entitySelector(entityName, commentId)(state);

  if (!comment) {
    return null;
  }

  return {
    ...comment,
    author: entitySelector('users', comment.authorId)(state),
    community: entitySelector('communities', comment.communityId)(state),
  };
};

export const extendedPostCommentSelector = makeExtendedCommentSelector('postComments');
export const extendedProfileCommentSelector = makeExtendedCommentSelector('profileComments');

export const extendedProposalSelector = id => state => {
  const proposal = entitySelector('proposals', id)(state);

  if (!proposal) {
    return null;
  }

  return {
    ...proposal,
    proposer: entitySelector('users', proposal.proposerId)(state),
    community: entitySelector('communities', proposal.communityId)(state),
  };
};

export const extendedPeportSelector = reportId => state => {
  const report = entitySelector('reports', reportId)(state);

  if (!report) {
    return null;
  }

  return {
    ...report,
    author: entitySelector('users', report.authorId)(state),
  };
};

export const entityArraySelector = (type, ids) => state =>
  ids.reduce((acc, id) => {
    const entity = entitySelector(type, id)(state);

    if (entity) {
      acc.push(entity);
    }

    return acc;
  }, []);

export const myCommunitiesIdsSelector = state => statusSelector('myCommunities')(state).order;

export const myCommunitiesSelector = state => {
  const order = myCommunitiesIdsSelector(state);

  return entityArraySelector('communities', order)(state);
};
