import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { Router } from 'shared/routes';

const ArticleEditorWindow = dynamic(() => import('containers/articleEditor'));

export default function ArticleEditorSlot({ isUserLoaded, isHydration }) {
  const router = useRouter();

  function close() {
    // Remove all query params from url.
    const newUrl = router.asPath.replace(/\?.+$/, '');
    Router.pushRoute(newUrl, { shallow: true });
  }

  if (router.query.editor && isUserLoaded && !isHydration) {
    return <ArticleEditorWindow onClose={close} />;
  }

  return null;
}

ArticleEditorSlot.propTypes = {
  isUserLoaded: PropTypes.bool.isRequired,
  isHydration: PropTypes.bool.isRequired,
};
