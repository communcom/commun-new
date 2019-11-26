import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { PointsList } from 'components/wallet/';
import { pointsArrayType } from 'types/common';

import { CloseButtonStyled } from '../common.styled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 550px;
  width: 375px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 25px 25px 0 0;
  overflow: hidden;

  ${up.mobileLandscape} {
    width: 350px;

    border-radius: 25px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  margin-bottom: 31px;
  padding: 20px 15px 0;

  width: 100%;
`;

const HeaderTitle = styled.div`
  flex-grow: 1;

  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
`;

const Content = styled.div`
  padding: 0 10px;

  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  overflow-y: scroll;
`;

export default class SelectPoint extends PureComponent {
  static propTypes = {
    points: pointsArrayType,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: [],
  };

  itemClickHandler = name => {
    const { close } = this.props;

    close({ selectedItem: name });
  };

  closeModal = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { points } = this.props;
    return (
      <Wrapper>
        <Header>
          <HeaderTitle>Points</HeaderTitle>
          <CloseButtonStyled onClick={this.closeModal} />
        </Header>
        <Content>
          <PointsList points={points} itemClickHandler={this.itemClickHandler} />
        </Content>
      </Wrapper>
    );
  }
}
