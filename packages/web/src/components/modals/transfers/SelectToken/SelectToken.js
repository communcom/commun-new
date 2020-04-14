import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ToggleFeature } from '@flopflip/react-redux';

import { Icon } from '@commun/icons';
import { ListItem, ListItemAvatar, ListItemText, Search, SplashLoader, up } from '@commun/ui';
import { FEATURE_EXCHANGE_CARBON } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import { multiArgsMemoize } from 'utils/common';
import { displayError } from 'utils/toastsMessages';

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
  background-color: ${({ theme }) => theme.colors.white};
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
  background: ${({ theme }) => theme.colors.white};
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

@withTranslation()
export default class SelectToken extends PureComponent {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.object),

    getExchangeCurrenciesFull: PropTypes.func.isRequired,

    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tokens: [],
  };

  state = {
    filterText: '',
    isLoading: false,
  };

  async componentDidMount() {
    const { getExchangeCurrenciesFull } = this.props;

    this.setState({ isLoading: true });

    try {
      await getExchangeCurrenciesFull();
    } catch (err) {
      displayError(err);
    }

    this.setState({ isLoading: false });
  }

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

  onItemClick = token => {
    const { close } = this.props;
    close(token);
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  renderTokensList() {
    const { tokens, t } = this.props;
    const { filterText, isLoading } = this.state;

    const finalItems = filterText.trim() ? this.filterItems(tokens, filterText.trim()) : tokens;

    if (finalItems.length) {
      return <TokensList tokens={finalItems} onItemClick={this.onItemClick} />;
    }

    if (isLoading) {
      return <SplashLoader />;
    }

    return <EmptyListStyled headerText={t('modals.transfers.select_token.no_found')} />;
  }

  render() {
    const { t } = this.props;
    const { filterText } = this.state;

    return (
      <Wrapper>
        <Header>
          <HeaderTitle>{t('modals.transfers.select_token.title')}</HeaderTitle>
          <CloseButtonStyled left isWhiteBackground onClick={this.onCloseClick} />
        </Header>
        <Content>
          <SearchStyled
            inverted
            label={t('modals.transfers.select_token.search')}
            type="search"
            placeholder={t('common.search_placeholder')}
            value={filterText}
            onChange={this.filterChangeHandler}
          />

          <ToggleFeature flag={FEATURE_EXCHANGE_CARBON}>
            <ListItemStyled onItemClick={() => this.onItemClick({ symbol: 'USD' })}>
              <ListItemAvatarStyled>
                <Icon name="card" width="24" height="17" />
              </ListItemAvatarStyled>
              <ListItemText primary={t('modals.transfers.select_token.card')} primaryBold />
            </ListItemStyled>
          </ToggleFeature>
          {this.renderTokensList()}
        </Content>
      </Wrapper>
    );
  }
}
