import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Glyph } from '@commun/ui';

import { formatNumber } from 'utils/format';

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

const GlyphWrapper = styled(Glyph).attrs({ icon: 'commun', size: 'medium' })`
  background-color: ${({ theme }) => theme.colors.lightBlue};
`;

const BackIcon = styled(Icon).attrs({ name: 'arrow-back' })`
  padding: 4px;

  width: 30px;
  height: 30px;

  color: ${({ theme }) => theme.colors.white};
`;

const BackAction = styled.div``;

const MoreIcon = styled(Icon).attrs({ name: 'vertical-more' })`
  width: 20px;
  height: 20px;

  color: ${({ theme }) => theme.colors.white};
`;

const MoreAction = styled.div``;

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
  color: ${({ theme }) => theme.colors.white};
`;

const TotalBalanceCount = styled.p`
  font-size: 30px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

const BalancePanel = ({ totalBalance, enableActions, actionPanelRenderer, className }) => (
  <Wrapper className={className}>
    <Header>
      {enableActions && (
        <BackAction>
          <BackIcon />
        </BackAction>
      )}
      <PointSelect>
        <GlyphWrapper />
      </PointSelect>
      {enableActions && (
        <MoreAction>
          <MoreIcon />
        </MoreAction>
      )}
    </Header>
    <TotalPoints>
      <TotalBalanceTitle>Estimated Commun holdings</TotalBalanceTitle>
      <TotalBalanceCount>{formatNumber(totalBalance)}</TotalBalanceCount>
    </TotalPoints>
    {actionPanelRenderer()}
  </Wrapper>
);

BalancePanel.propTypes = {
  totalBalance: PropTypes.string,
  enableActions: PropTypes.bool,
  actionPanelRenderer: PropTypes.func.isRequired,
};

BalancePanel.defaultProps = {
  totalBalance: '0',
  enableActions: false,
};

export default BalancePanel;
