import { Router } from 'shared/routes';
import { toQueryString } from 'utils/userAgent';

// eslint-disable-next-line import/prefer-default-export
export function replaceRouteAndAddQuery(router, query) {
  return Router.replaceRoute(
    `${router.asPath.replace(/\?.*$/, '')}?${toQueryString({
      ...router.query,
      ...query,
    })}`,
    {
      shallow: true,
    }
  );
}
