import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ToggleFeature } from '@flopflip/react-redux';

import { Icon } from '@commun/icons';
import { ListItem, ListItemAvatar, ListItemText, Search, up } from '@commun/ui';
import { multiArgsMemoize } from 'utils/common';
import { FEATURE_EXCHANGE_CARBON } from 'shared/featureFlags';

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

  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
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

  padding: 20px 15px 0;

  width: 100%;
`;

const HeaderTitle = styled.div`
  flex-grow: 1;

  font-size: 15px;
  font-weight: 600;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
`;

const SearchStyled = styled(Search)`
  width: 100%;
  margin-bottom: 15px;
  background-color: #fff;
`;

const Content = styled.div`
  flex-grow: 1;

  padding: 15px 10px;
  width: 100%;

  overflow-y: scroll;
`;

const EmptyListStyled = styled(EmptyList)`
  margin-top: 15px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
`;

const ListItemStyled = styled(ListItem)`
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
`;

const ListItemAvatarStyled = styled(ListItemAvatar)`
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.colors.blue};
  background: ${({ theme }) => theme.colors.blue};
  border-radius: 50%;
`;

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

  filterChangeHandler = text => {
    this.setState({
      filterText: text,
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
          <CloseButtonStyled left isWhiteBackground onClick={this.onCloseClick} />
        </Header>
        <Content>
          <SearchStyled
            inverted
            label="Search tokens"
            type="search"
            placeholder="Search..."
            value={filterText}
            onChange={this.filterChangeHandler}
          />

          <ToggleFeature flag={FEATURE_EXCHANGE_CARBON}>
            <ListItemStyled onItemClick={() => this.onItemClick('USD')}>
              <ListItemAvatarStyled>
                <Icon name="card" width="24" height="17" />
              </ListItemAvatarStyled>
              <ListItemText primary="Visa/Master Card" primaryBold />
            </ListItemStyled>
          </ToggleFeature>
          {tokensList}
        </Content>
      </Wrapper>
    );
  }
}
