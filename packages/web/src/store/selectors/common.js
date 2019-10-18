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
    author: entitySelector('users', post.author)(state),
    community: entitySelector('communities', post.community)(state),
  };
};

export const entityArraySelector = (type, ids) => state =>
  ids.map(id => entitySelector(type, id)(state));

export const myCommunitiesSelector = state => {
  const { isEnd, order } = statusSelector('myCommunities')(state);

  if (order.length === 0 && isEnd) {
    return null;
  }

  return entityArraySelector('communities', order)(state);
};
