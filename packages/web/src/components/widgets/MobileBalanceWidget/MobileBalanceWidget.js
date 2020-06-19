import React, { memo } from 'react';
import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

import { IconGetPoints, IconGetPointsWrapper } from 'components/widgets/common';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;
  box-shadow: 0 14px 24px rgba(106, 128, 245, 0.4);
  border-radius: 15px;

  ${({ theme }) => `
    background: linear-gradient(
      295.14deg,
      ${theme.colors.blue} -7.34%,
      #a4b1f9 120.21%
    ),
    ${theme.colors.blue};
  `};

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const IconGetPointsWrapperStyled = styled(IconGetPointsWrapper)`
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.2);
`;

const IconGetPointsStyled = styled(IconGetPoints)`
  width: 26px;
  height: 26px;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const InfoText = styled.p`
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.9);
`;

const InfoBalance = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #fff;
`;

const WalletLink = styled.a`
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  align-items: center;
  max-width: 110px;
  padding: 10px 15px;
  font-weight: 600;
  font-size: 15px;
  line-height: 1;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: #fff;
`;

const NextIcon = styled(Icon).attrs({ name: 'back' })`
  width: 7px;
  height: 12px;
  margin-left: 8px;
  transform: rotate(180deg);
`;

function MobileBalanceWidget({ balance, currentUser, isBalanceUpdated }) {
  const { t } = useTranslation();

  if (!currentUser) {
    return null;
  }

  return (
    <Wrapper>
      <IconGetPointsWrapperStyled>
        <IconGetPointsStyled />
      </IconGetPointsWrapperStyled>
      <InfoWrapper>
        <InfoText>{t('common.equity_value_commun')}</InfoText>
        <InfoBalance>
          {!isBalanceUpdated ? <ContentLoader width="100" height="5" /> : balance}
        </InfoBalance>
      </InfoWrapper>
      <Link route="wallet" passHref>
        <WalletLink>
          {t('widgets.mobile_balance.wallet')} <NextIcon />
        </WalletLink>
      </Link>
    </Wrapper>
  );
}

MobileBalanceWidget.propTypes = {
  balance: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  isBalanceUpdated: PropTypes.bool,
};

MobileBalanceWidget.defaultProps = {
  currentUser: null,
  isBalanceUpdated: false,
};

export default memo(MobileBalanceWidget);
