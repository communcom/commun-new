import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Link } from 'shared/routes';
import env from 'shared/env';

const Trx = styled.a`
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

export default function TrxLink({ trxId, className }) {
  const host = env.WEB_EXPLORER_URL || 'https://explorer.cyberway.io';

  return (
    <Link to={`${host}/trx/${trxId}`} passHref>
      <Trx target="_blank" rel="noopener nofollow" className={className}>
        TRX
      </Trx>
    </Link>
  );
}

TrxLink.propTypes = {
  trxId: PropTypes.string.isRequired,
};
