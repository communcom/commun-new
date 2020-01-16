import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// TODO: will be use in next PR
// import { Icon } from '@commun/icons';
import {
  // ListItem,
  // ListItemAvatar,
  // ListItemText,
  Search,
  up,
} from '@commun/ui';
import { multiArgsMemoize } from 'utils/common';

import { TokensList } from 'components/wallet/';
import EmptyList from 'components/common/EmptyList';
import { CloseButtonStyled } from '../common.styled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: fixed;
  bottom: 0;

  height: 550px;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 25px 25px 0 0;
  overflow: hidden;

  ${up.mobileLandscape} {
    position: relative;

    width: 350px;

    border-radius: 25px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 15px;
  padding: 20px 15px 0;

  width: 100%;
`;

const HeaderTitle = styled.div`
  flex-grow: 1;

  margin-bottom: 15px;

  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
`;

const SearchStyled = styled(Search)`
  width: 100%;
`;

const Content = styled.div`
  flex-grow: 1;

  padding: 15px 10px;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  overflow-y: scroll;
`;

const EmptyListStyled = styled(EmptyList)`
  margin-top: 15px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
`;

// TODO: will be use in next PR
// const ListItemStyled = styled(ListItem)`
//   background: #fff;
//   border-radius: 10px;
//   cursor: pointer;
// `;
//
// const ListItemAvatarStyled = styled(ListItemAvatar)`
//   align-items: center;
//   justify-content: center;
//   width: 40px;
//   height: 40px;
//   color: ${({ theme }) => theme.colors.blue};
//   background: ${({ theme }) => theme.colors.blue};
//   border-radius: 50%;
// `;

export default class SelectToken extends PureComponent {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.object),

    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tokens: [],
  };

  state = {
    filterText: '',
  };

  filterItems = multiArgsMemoize((items, filterText) => {
    if (filterText) {
      const filterTextLower = filterText.toLowerCase().trim();
      return items.filter(
        ({ symbol, fullName }) =>
          symbol.toLowerCase().startsWith(filterTextLower) ||
          fullName.toLowerCase().startsWith(filterTextLower)
      );
    }

    return items;
  });

  filterChangeHandler = e => {
    this.setState({
      filterText: e.target.value,
    });
  };

  onItemClick = name => {
    const { close } = this.props;
    close(name);
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { tokens } = this.props;
    const { filterText } = this.state;

    const finalItems = filterText.trim() ? this.filterItems(tokens, filterText.trim()) : tokens;

    const tokensList = finalItems.length ? (
      <TokensList tokens={finalItems} onItemClick={this.onItemClick} />
    ) : (
      <EmptyListStyled headerText="No tokens" />
    );

    return (
      <Wrapper>
        <Header>
          <HeaderTitle>Choose Currency</HeaderTitle>
          <CloseButtonStyled right onClick={this.onCloseClick} />
          <SearchStyled
            inverted
            label="Search tokens"
            type="search"
            placeholder="Search..."
            value={filterText}
            onChange={this.filterChangeHandler}
          />
        </Header>
        <Content>
          {/* TODO: will be use in next PR */}
          {/* <ListItemStyled> */}
          {/*  <ListItemAvatarStyled> */}
          {/*    <Icon name="card" width="24" height="17" /> */}
          {/*  </ListItemAvatarStyled> */}
          {/*  <ListItemText primary="New card" primaryBold secondary="Buy Commun with your card" /> */}
          {/* </ListItemStyled> */}
          {tokensList}
        </Content>
      </Wrapper>
    );
  }
}
