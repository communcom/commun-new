import React from 'react';
import PropTypes from 'prop-types';

import env from 'shared/env';
import { useTranslation } from 'shared/i18n';

import { DropDownMenuItem } from 'components/common/DropDownMenu';

export default function ExplorerTransactionMenuItem({ meta }) {
  const { t } = useTranslation();

  if (!meta.trxId) {
    return null;
  }

  const host = env.WEB_EXPLORER_URL || 'https://explorer.cyberway.io';

  return (
    <DropDownMenuItem target="_blank" href={`${host}/trx/${meta.trxId}`}>
      {t('menu.post.view_in_explorer')}
    </DropDownMenuItem>
  );
}

ExplorerTransactionMenuItem.propTypes = {
  meta: PropTypes.shape({
    trxId: PropTypes.string,
  }).isRequired,
};
