import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { openModalEditor } from 'store/actions/modals';

export default function ArticleEditorSlot({ isUserLoaded, isHydration, isArticleEditorOpen }) {
  const router = useRouter();

  useEffect(() => {
    if (router.query.editor && isUserLoaded && !isHydration && !isArticleEditorOpen) {
      openModalEditor({ isArticle: true });
    }
  }, [router.query.editor, isUserLoaded, isHydration, isArticleEditorOpen]);

  return null;
}

ArticleEditorSlot.propTypes = {
  isUserLoaded: PropTypes.bool.isRequired,
  isHydration: PropTypes.bool.isRequired,
  isArticleEditorOpen: PropTypes.bool.isRequired,
};
