import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import UsersLayout from 'components/wallet/UsersLayout';

import { CloseButtonStyled } from '../common.styled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 550px;
  width: 375px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 25px 25px 0 0;

  ${up.mobileLandscape} {
    padding-bottom: 32px;

    width: 350px;

    border-radius: 25px;
  }
`;

const Header = styled.div`
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

  width: 100%;

  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  overflow-y: scroll;
`;

export default class SelectRecipient extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({})),
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
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
    const { items } = this.props;
    return (
      <Wrapper>
        <Header>
          <HeaderTitle>Choose friend</HeaderTitle>
          <CloseButtonStyled onClick={this.closeModal} />
        </Header>
        <Content>
          <UsersLayout layoutType="list" items={items} itemClickHandler={this.itemClickHandler} />
        </Content>
      </Wrapper>
    );
  }
}
