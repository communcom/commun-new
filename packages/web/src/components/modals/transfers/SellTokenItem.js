import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import TokenAvatar from 'components/wallet/TokenAvatar';
import { COMMUN_SYMBOL } from 'shared/constants';
import { CommunLogo } from 'components/modals/transfers/common.styled';
import { Glyph } from '@commun/ui';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  height: 64px;
  width: 100%;
  padding: 6px 15px;

  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  background: #fff;
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
  font-size: 15px;
`;

const DropDownIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;

  margin-left: 15px;

  color: ${({ theme }) => theme.colors.gray};
`;

const CardLogo = styled(Glyph).attrs({ icon: 'card', size: 'small' })``;

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
    const { token, onSelectClick } = this.props;

    if (!token) {
      return (
        <>
          <TokenName>
            <Title>Token</Title>
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
          <Title>{symbol === 'USD' ? 'CARD' : symbol}</Title>
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
