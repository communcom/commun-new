import { dataSelector, entitySelector } from './common';

export const currentUserSelector = dataSelector(['auth', 'currentUser']);

export const currentUserIdSelector = dataSelector(['auth', 'currentUser', 'userId']);

export const isAuthorizedSelector = state => Boolean(currentUserIdSelector(state));

export const currentUnsafeUserSelector = state => {
  const currentUser = currentUserSelector(state);

  if (currentUser) {
    return currentUser;
  }

  const serverCurrentUser = dataSelector('serverAuth')(state);

  if (serverCurrentUser && serverCurrentUser.userId) {
    return serverCurrentUser;
  }

  return null;
};

export const currentUnsafeUserIdSelector = state => {
  const user = currentUnsafeUserSelector(state);

  if (!user) {
    return null;
  }

  return user.userId;
};

export const isUnsafeAuthorizedSelector = state => Boolean(currentUnsafeUserSelector(state));

export const currentUnsafeServerUserIdSelector = state => {
  if (!process.browser) {
    return dataSelector(['serverAuth', 'userId'])(state);
  }

  return currentUserIdSelector(state);
};

export const currentUnsafeUserEntitySelector = state => {
  const userId = currentUnsafeServerUserIdSelector(state);

  if (userId) {
    return entitySelector('users', userId)(state);
  }

  return null;
};
