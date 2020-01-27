// eslint-disable-next-line import/prefer-default-export
export function extractLinkFromItem(item) {
  switch (item.type) {
    case 'profile':
      return {
        text: item.username,
        route: 'profile',
        params: {
          username: item.username,
        },
      };
    case 'community':
      return {
        text: item.name,
        route: 'community',
        params: {
          communityAlias: item.alias,
        },
      };
    default:
      return null;
  }
}
