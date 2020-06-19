import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { InvisibleText } from '@commun/ui';

import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

import Amount from 'components/common/Amount';
import CurrencyGlyph from 'components/pages/wallet/common/CurrencyGlyph/CurrencyGlyph';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 30px;
  padding: 20px 15px 30px;

  width: 100%;

  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 0 0 25px 25px;
  box-shadow: 0px 10px 44px rgba(29, 59, 220, 0.5);
`;

const Header = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 25px;

  width: 100%;
`;

const PointSelect = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

const BackIcon = styled(Icon).attrs({ name: 'arrow-back' })`
  padding: 4px;

  width: 30px;
  height: 30px;

  color: #fff;
`;

const BackAction = styled.a``;

const MoreIcon = styled(Icon).attrs({ name: 'more' })`
  width: 20px;
  height: 20px;

  color: #fff;
`;

// TODO: not implemented yet
const MoreAction = styled.div`
  visibility: hidden;
`;

const TotalPoints = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 30px;
`;

const TotalBalanceTitle = styled.p`
  margin-bottom: 5px;

  font-size: 15px;
  font-weight: 600;
  color: #fff;
`;

const TotalBalanceCount = styled.p`
  font-size: 30px;
  font-weight: 600;
  color: #fff;
`;

const BalancePanel = ({
  currency,
  currentUser,
  totalBalance,
  enableActions,
  actionPanelRenderer,
  onCurrencyClick,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper className={className}>
      <Header>
        {enableActions && currentUser ? (
          <Link route="profile" params={{ username: currentUser }} passHref>
            <BackAction>
              <BackIcon />
              <InvisibleText>{`To ${currentUser}'s profile`}</InvisibleText>
            </BackAction>
          </Link>
        ) : null}
        <PointSelect>
          <CurrencyGlyph
            isMobile
            isActive={currency === 'USD'}
            currency="USD"
            size="medium"
            onClick={onCurrencyClick('USD')}
          />
          <CurrencyGlyph
            isMobile
            isActive={currency === 'CMN'}
            currency="CMN"
            size="medium"
            onClick={onCurrencyClick('CMN')}
          />
        </PointSelect>
        {enableActions && (
          <MoreAction>
            <MoreIcon />
          </MoreAction>
        )}
      </Header>
      <TotalPoints>
        <TotalBalanceTitle>{t('common.equity_value')}</TotalBalanceTitle>
        <TotalBalanceCount>
          <Amount value={totalBalance} />
        </TotalBalanceCount>
      </TotalPoints>
      {actionPanelRenderer()}
    </Wrapper>
  );
};

BalancePanel.propTypes = {
  currency: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
  totalBalance: PropTypes.string,
  enableActions: PropTypes.bool,
  actionPanelRenderer: PropTypes.func.isRequired,
  onCurrencyClick: PropTypes.func.isRequired,
};

BalancePanel.defaultProps = {
  totalBalance: '0',
  enableActions: false,
};

export default BalancePanel;
