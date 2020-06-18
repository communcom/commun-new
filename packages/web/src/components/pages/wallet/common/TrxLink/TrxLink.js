import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { styles } from '@commun/ui';

import env from 'shared/env';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

const Trx = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px 2px;
  line-height: 6px;
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 4px;

  ${is('href')`
    transition: border-color 0.3s ease 0s, color 0.3s ease 0s;

    &:hover,
    &:focus {
      border-color: ${({ theme }) => theme.colors.black};
      color: ${({ theme }) => theme.colors.black};
    }
  `};
`;

const Circle = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 8px;
  height: 8px;

  background-color: ${({ theme }) => theme.colors.gray};
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;

  &:hover,
  &:focus {
    ${styles.withBottomLeftTooltip};
  }
`;

function TrxLink({ trxId, hasMemo, t, className }) {
  const host = env.WEB_EXPLORER_URL || 'https://explorer.cyberway.io';

  return (
    <Link to={`${host}/trx/${trxId}`} passHref>
      <Trx target="_blank" rel="noopener nofollow" className={className}>
        TRX
        {hasMemo ? <Circle aria-label={t('components.wallet.transfer_history.with_memo')} /> : null}
      </Trx>
    </Link>
  );
}

TrxLink.propTypes = {
  trxId: PropTypes.string.isRequired,
  hasMemo: PropTypes.bool,
};

TrxLink.defaultProps = {
  hasMemo: false,
};

export default withTranslation()(TrxLink);
