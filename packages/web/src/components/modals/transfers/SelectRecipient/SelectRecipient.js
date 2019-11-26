/* eslint-disable lines-between-class-members,no-underscore-dangle */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import styled from 'styled-components';

import { Search, up } from '@commun/ui';

import UsersLayout from 'components/wallet/UsersLayout';

import { CloseButtonStyled } from '../common.styled';

const MIN_SYMBOLS = 2;

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
  flex-direction: column;
  align-items: center;

  padding: 17px 15px;

  width: 100%;
`;

const HeaderTitle = styled.div`
  flex-grow: 1;

  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
`;

const SearchStyled = styled(Search)`
  margin-top: 18px;
  width: 100%;
`;

const Content = styled.div`
  flex: 1;
  padding: 0 10px;

  width: 100%;

  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  overflow-y: scroll;
`;

export default class SelectRecipient extends PureComponent {
  static propTypes = {
    itemsFriends: PropTypes.arrayOf(PropTypes.shape({})),
    loggedUserId: PropTypes.string.isRequired,

    close: PropTypes.func.isRequired,
    getUserSubscriptions: PropTypes.func.isRequired,
    suggestNames: PropTypes.func.isRequired,
  };

  static defaultProps = {
    itemsFriends: [],
  };

  state = {
    filterUsername: '',
    items: [],
  };

  load = throttle(
    async value => {
      if (value.length < MIN_SYMBOLS) {
        return;
      }

      try {
        const { suggestNames } = this.props;

        const result = await suggestNames(value);

        if (!this.unmount) {
          this.setState({
            items: result.items,
          });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    300,
    { leading: false }
  );

  componentDidMount() {
    const { loggedUserId, getUserSubscriptions } = this.props;

    getUserSubscriptions({
      userId: loggedUserId,
    });
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  itemClickHandler = user => {
    const { close } = this.props;

    close({ selectedUser: user });
  };

  closeModal = () => {
    const { close } = this.props;
    close();
  };

  onInputChange = e => {
    const value = e.target.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, '');

    this.setState({
      filterUsername: value,
    });

    if (value.length < MIN_SYMBOLS) {
      return;
    }

    this.load(value);
  };

  render() {
    const { itemsFriends } = this.props;
    const { filterUsername, items } = this.state;

    let users = [];
    if (items.length) {
      users = items;
    } else if (!filterUsername.length) {
      users = itemsFriends;
    }

    return (
      <Wrapper>
        <Header>
          <HeaderTitle>Choose friend</HeaderTitle>
          <CloseButtonStyled onClick={this.closeModal} />
          <SearchStyled
            name="send-points__search-input"
            inverted
            label="Search"
            type="search"
            placeholder="Search..."
            value={filterUsername}
            onChange={this.onInputChange}
          />
        </Header>
        <Content>
          <UsersLayout layoutType="list" items={users} itemClickHandler={this.itemClickHandler} />
        </Content>
      </Wrapper>
    );
  }
}
