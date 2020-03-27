import React from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import styled from 'styled-components';
import is from 'styled-is';

import { Glyph, ButtonWithTooltip, up } from '@commun/ui';
import { FEATURE_EXCHANGE_COMMON } from 'shared/featureFlags';
import { useTranslation } from 'shared/i18n';

import NotReadyTooltip from 'components/tooltips/NotReadyTooltip';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 42px;
  background-color: ${({ theme }) => theme.colors.mediumBlue};
  border-radius: 15px;

  ${up.mobileLandscape} {
    width: 300px;
  }

  ${is('isTotalBalance')`
    ${up.mobileLandscape} {
      width: 220px;
      padding: 0;
      background-color: ${({ theme }) => theme.colors.white};
      border-radius: unset;
    }
  `};
`;

const SendIcon = styled(Glyph).attrs({ icon: 'arrow', size: 'small' })`
  margin-bottom: 7px;
  background-color: ${({ theme }) => theme.colors.lightBlue};
  transform: rotate(180deg);
`;

const BuyIcon = styled(Glyph).attrs({ icon: 'add', size: 'small' })`
  margin-bottom: 7px;

  background-color: ${({ theme }) => theme.colors.lightBlue};

  & > svg {
    width: 14px;
    height: 14px;
  }
`;

const SellIcon = styled(Glyph).attrs({ icon: 'usd', size: 'small' })`
  margin-bottom: 7px;
  background-color: ${({ theme }) => theme.colors.lightBlue};
`;

const ConvertIcon = styled(Glyph).attrs({ icon: 'convert', size: 'small' })`
  margin-bottom: 7px;
  background-color: ${({ theme }) => theme.colors.lightBlue};
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  font-size: 12px;

  color: ${({ theme }) => theme.colors.white};
  outline: none;
  transition: color 0.15s;

  ${is('isTotalBalance')`
    ${is('isDisabled')`
      & > div {
        background-color: ${({ theme }) => theme.colors.gray};
      }
    `};

    ${up.mobileLandscape} {
      color: ${({ theme }) => theme.colors.blue};

      ${is('isDisabled')`
        color: ${({ theme }) => theme.colors.gray};
      `};

      & > div {
        color: ${({ theme }) => theme.colors.blue};
        background-color: ${({ theme }) => theme.colors.lightGrayBlue};

        ${is('isDisabled')`
          color: ${({ theme }) => theme.colors.gray};
        `};
      }

      &:hover,
      &:focus {
        color: ${({ theme }) => theme.colors.blueHover};

        & > div {
          color: ${({ theme }) => theme.colors.blueHover};
        }
      }
    }
  `};
`;

const ButtonWithTooltipStyled = styled(ButtonWithTooltip)`
  flex: 1;
`;

const NotReadyTooltipStyled = styled(NotReadyTooltip)`
  transform: translateX(calc(50% - 35px));
`;

const ActionsPanel = ({
  sendPointsHandler,
  exchangeCommunHandler,
  convertPointsHandler,
  symbol,
  isTotalBalance,
  featureToggles,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper isTotalBalance={isTotalBalance} className={className}>
      <Action
        isTotalBalance={isTotalBalance}
        name="total-balance__send-points"
        onClick={sendPointsHandler}
      >
        <SendIcon />
        {t('components.wallet.actions_panel.send')}
      </Action>
      {isTotalBalance ? (
        <ButtonWithTooltipStyled
          button={clickHandler => (
            <Action
              isTotalBalance
              name="total-balance__sell-points"
              isDisabled
              onClick={clickHandler}
            >
              <SellIcon isDisabled />
              {t('components.wallet.actions_panel.sell')}
            </Action>
          )}
          tooltip={clickHandler => <NotReadyTooltipStyled closeHandler={clickHandler} />}
        />
      ) : null}
      {featureToggles[FEATURE_EXCHANGE_COMMON] && symbol === 'CMN' ? (
        <Action
          name="total-balance__buy-points"
          isTotalBalance={isTotalBalance}
          onClick={exchangeCommunHandler}
        >
          <BuyIcon />
          {t('components.wallet.actions_panel.buy')}
        </Action>
      ) : null}
      <Action
        name="total-balance__convert-points"
        isTotalBalance={isTotalBalance}
        onClick={convertPointsHandler}
      >
        <ConvertIcon />
        {t('components.wallet.actions_panel.convert')}
      </Action>
    </Wrapper>
  );
};

ActionsPanel.propTypes = {
  symbol: PropTypes.string.isRequired,
  isTotalBalance: PropTypes.bool,
  featureToggles: PropTypes.object.isRequired,

  sendPointsHandler: PropTypes.func.isRequired,
  exchangeCommunHandler: PropTypes.func.isRequired,
  convertPointsHandler: PropTypes.func.isRequired,
};

ActionsPanel.defaultProps = {
  isTotalBalance: false,
};

export default injectFeatureToggles([FEATURE_EXCHANGE_COMMON])(ActionsPanel);
