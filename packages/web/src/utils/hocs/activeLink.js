/* eslint-disable react/prop-types,react/destructuring-assignment,no-param-reassign */

import React, { memo, useEffect, useMemo, useState } from 'react';
import { withRouter } from 'next/router';

import { Link } from 'shared/routes';
import { multiArgsMemoize } from 'utils/common';

const SPLITTER_SYMBOLS = ['/', '?', '#'];

function cutInvite(url) {
  if (!url) {
    return url;
  }

  if (url.includes('invite=')) {
    // eslint-disable-next-line no-param-reassign
    url = url.replace(/[?&]invite=[a-z0-5.]*/, found => found.charAt(0));
  }
  return url.replace(/[&?]$/, '');
}

function isActiveLink(href, currentUrl, includeSubRoutes, includeRoute, includeQueryParams) {
  if (includeQueryParams) {
    currentUrl = cutInvite(currentUrl);
    href = cutInvite(href);
  } else {
    currentUrl = currentUrl.replace(/\?.*$/, '');
    href = href.replace(/\?.*$/, '');
  }

  if (currentUrl === href) {
    return true;
  }

  if (includeSubRoutes && currentUrl.startsWith(href)) {
    const endSymbol = currentUrl.charAt(href.length);

    // Если граничный символ является разделителем то значит путь является дочерним
    if (SPLITTER_SYMBOLS.includes(endSymbol)) {
      return true;
    }
  }

  if (includeRoute && currentUrl.startsWith(includeRoute)) {
    const endSymbol = currentUrl.charAt(includeRoute.length);

    // Если граничный символ является разделителем то значит путь является дочерним
    if (SPLITTER_SYMBOLS.includes(endSymbol)) {
      return true;
    }
  }

  return false;
}

const RouteListener = withRouter(
  // eslint-disable-next-line prefer-arrow-callback,func-names
  memo(function({
    router,
    Comp,
    href,
    includeSubRoutes,
    includeRoute,
    includeQueryParams,
    ...props
  }) {
    const isActiveLazy = useMemo(() => multiArgsMemoize(isActiveLink), []);
    const [currentUrl, setCurrentUrl] = useState(router.asPath);

    useEffect(() => {
      function onRouteChange(url) {
        setCurrentUrl(url);
      }

      router.events.on('routeChangeStart', onRouteChange);

      return () => {
        router.events.off('routeChangeStart', onRouteChange);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isActive = isActiveLazy(
      href,
      currentUrl,
      includeSubRoutes,
      includeRoute,
      includeQueryParams
    );

    return <Comp {...props} href={href} active={isActive} />;
  })
);

/**
 * HOC оборачивающий обычную ссылку во врапер из 'shared/routes' и выставляющий
 * prop active=true в том случае если текущий адрес страницы соответсвует адресу ссылки.
 *
 * При этом нужно прокинуть props:
 *   route {string} - пробросывается в Link из shared/routes
 *   params {params} - пробросывается в Link из shared/routes
 *
 * и дополнительные props непосредственно для HOC'a:
 *  [includeSubRoutes] {boolean} - если выставлен, то состояние active включается даже
 *    тогда когда текущий адрес страницы является дочерним от адреса ссылки.
 *    Пример: ссылка с адресом '/wallet/history' будет активной если текущий адрес страницы является
 *    '/wallet/history' или любой из дочерних, на пример '/wallet/history/transfer' или '/wallet/history/convert'
 *    так же дочерними будут является урлы вида '/wallet/history?param1=value1' и '/wallet/history#someAnchor'
 *    в противном случае все эти урлы будут являться не соотвествующими исходной ссылке.
 */
export default Comp => ({ route, params, scroll = true, ...props }) => (
  <Link route={route} params={params} scroll={scroll} passHref>
    <RouteListener {...props} Comp={Comp} />
  </Link>
);
