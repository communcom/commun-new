import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import TokenAvatar from 'components/wallet/TokenAvatar';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  padding: 6px 15px;

  width: 100%;

  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  background: #fff;
  border-radius: 10px;

  cursor: pointer;
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

const SubTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const DropDownIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;

  margin-left: 15px;

  color: ${({ theme }) => theme.colors.gray};
`;

export default class SellTokenItem extends PureComponent {
  static propTypes = {
    token: PropTypes.object,
    onSelectClick: PropTypes.func,
  };

  static defaultProps = {
    token: null,
    onSelectClick: undefined,
  };

  renderBody = () => {
    const { token } = this.props;

    if (!token) {
      return (
        <>
          <TokenName>
            <SubTitle>Sell</SubTitle>
            <Title>Token</Title>
          </TokenName>
          <DropDownIcon />
        </>
      );
    }

    const { symbol } = token;

    return (
      <>
        <LogoWrapper>
          <TokenAvatar name={symbol} />
        </LogoWrapper>
        <TokenName>
          <SubTitle>Sell</SubTitle>
          <Title>{symbol}</Title>
        </TokenName>
        <DropDownIcon />
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
