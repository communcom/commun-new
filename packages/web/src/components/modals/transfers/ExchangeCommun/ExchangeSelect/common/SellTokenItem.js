import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Glyph } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

import { CommunLogo } from 'components/modals/transfers/common.styled';
import TokenAvatar from 'components/pages/wallet/TokenAvatar';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  height: 64px;
  width: 100%;
  padding: 6px 15px;

  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px;

  ${is('onClick')`
    cursor: pointer;
  `}
`;

const LogoWrapper = styled.div`
  display: flex;

  margin-right: 10px;
`;

const TokenName = styled.div`
  flex-grow: 1;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;

  color: ${({ theme }) => theme.colors.gray};
`;

const Text = styled.div`
  font-weight: 600;
  font-size: 15px;
`;

const DropDownIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;

  margin-left: 15px;

  color: ${({ theme }) => theme.colors.gray};
`;

const CardLogo = styled(Glyph).attrs({ icon: 'card', size: 'small' })``;

@withTranslation()
export default class SellTokenItem extends PureComponent {
  static propTypes = {
    token: PropTypes.object,
    onSelectClick: PropTypes.func,
  };

  static defaultProps = {
    token: null,
    onSelectClick: undefined,
  };

  renderAvatar() {
    const {
      token: { symbol },
    } = this.props;

    if (symbol === COMMUN_SYMBOL) {
      return <CommunLogo size="small" />;
    }

    if (symbol === 'USD') {
      return <CardLogo />;
    }

    return <TokenAvatar name={symbol} isSmall />;
  }

  renderBody = () => {
    const { token, onSelectClick, t } = this.props;

    if (!token) {
      return (
        <>
          <TokenName>
            <Text>{t('common.token')}</Text>
          </TokenName>
          <DropDownIcon />
        </>
      );
    }

    const { symbol } = token;

    return (
      <>
        <LogoWrapper>{this.renderAvatar()}</LogoWrapper>
        <TokenName>
          {symbol === 'USD' ? (
            <Title>{t('modals.transfers.exchange_commun.select.sell_token_item.use')}</Title>
          ) : null}
          <Text>
            {symbol === 'USD'
              ? t('modals.transfers.exchange_commun.select.sell_token_item.card')
              : symbol}
          </Text>
        </TokenName>
        {onSelectClick ? <DropDownIcon /> : null}
      </>
    );
  };

  render() {
    const { onSelectClick, className } = this.props;

    return (
      <Wrapper className={className} onClick={onSelectClick}>
        {this.renderBody()}
      </Wrapper>
    );
  }
}
