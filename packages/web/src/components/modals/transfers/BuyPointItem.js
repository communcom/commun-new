import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Avatar } from '@commun/ui';

import { pointType } from 'types/common';
import { COMMUN_SYMBOL } from 'shared/constants';

import { CommunLogo } from './common.styled';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 10px;
  padding: 12px;

  width: 100%;

  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 10px;
`;

const LogoWrapper = styled.div`
  display: flex;

  margin-right: 10px;
`;

const PointName = styled.div`
  flex-grow: 1;
`;

const Balance = styled.div``;

const Title = styled.div`
  font-weight: 600;
  font-size: 15px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const Open = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  margin-left: 15px;

  width: 24px;
  height: 24px;

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  cursor: pointer;
`;

const DropDownIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;

  color: ${({ theme }) => theme.colors.gray};
`;

export default class BuyPointItem extends PureComponent {
  static propTypes = {
    point: pointType,
    onSelectClick: PropTypes.func,
  };

  static defaultProps = {
    point: null,
    onSelectClick: undefined,
  };

  renderBody = () => {
    const { point, onSelectClick } = this.props;

    if (!point) {
      return (
        <>
          <PointName>
            <SubTitle>Buy</SubTitle>
            <Title>Point</Title>
          </PointName>
          <Open onClick={onSelectClick}>
            <DropDownIcon />
          </Open>
        </>
      );
    }

    const { logo, name, balance, symbol } = point;

    return (
      <>
        <LogoWrapper>
          {symbol === COMMUN_SYMBOL ? <CommunLogo /> : <Avatar avatarUrl={logo} name={name} />}
        </LogoWrapper>
        <PointName>
          <SubTitle>Buy</SubTitle>
          <Title>{symbol === COMMUN_SYMBOL ? 'Commun' : name}</Title>
        </PointName>
        <Balance>
          <SubTitle>Balance</SubTitle>
          <Title>{balance}</Title>
        </Balance>
        {onSelectClick && (
          <Open onClick={onSelectClick}>
            <DropDownIcon />
          </Open>
        )}
      </>
    );
  };

  render() {
    return <Wrapper>{this.renderBody()}</Wrapper>;
  }
}
