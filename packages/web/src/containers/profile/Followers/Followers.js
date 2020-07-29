import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, PaginationLoader } from '@commun/ui';

import { userType } from 'types/common';
import { withTranslation } from 'shared/i18n';
import { multiArgsMemoize } from 'utils/common';
import { getUserSubscribers } from 'store/actions/gate';

import EmptyList from 'components/common/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import UserRow from 'components/common/UserRow';
import { Items, SearchStyled, TopWrapper, Wrapper } from '../common';

const BigButton = styled(Button)`
  height: 38px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

@withTranslation()
export default class ProfileFollowers extends Component {
  // eslint-disable-next-line react/sort-comp
  static propTypes = {
    userId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(userType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getUserSubscribers: PropTypes.func.isRequired,

    openModalEditor: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(
      getUserSubscribers({
        userId: parentInitialProps.userId,
      })
    );

    return {
      namespacesRequired: [],
    };
  }

  state = {
    filterText: '',
  };

  filterItems = multiArgsMemoize((items, filter) =>
    items.filter(user => user.username.startsWith(filter))
  );

  onFilterChange = text => {
    this.setState({
      filterText: text,
    });
  };

  onNewPostClick = () => {
    const { openModalEditor } = this.props;
    openModalEditor();
  };

  onNeedLoadMore = () => {
    // eslint-disable-next-line no-shadow
    const { userId, isLoading, isEnd, items, getUserSubscribers } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    getUserSubscribers({
      userId,
      offset: items.length,
    });
  };

  renderEmpty() {
    const { isOwner, items, t } = this.props;

    if (items.length) {
      return <EmptyList noIcon />;
    }

    if (isOwner) {
      return (
        <EmptyList
          headerText={t('components.profile.followers.empty')}
          subText={t('components.profile.followers.empty-desc')}
        >
          <ButtonsWrapper>
            {/* TODO: should be implemented later */}
            {/* <BigButton primary>Find new friends</BigButton> */}
            <BigButton primary onClick={this.onNewPostClick}>
              {t('components.profile.followers.create')}
            </BigButton>
          </ButtonsWrapper>
        </EmptyList>
      );
    }

    return <EmptyList headerText={t('components.profile.followers.empty')} />;
  }

  renderItems() {
    const { items, isEnd, isLoading } = this.props;
    const { filterText } = this.state;

    let finalItems = items;

    if (filterText.trim()) {
      finalItems = this.filterItems(items, filterText.trim().toLowerCase());
    }

    return (
      <>
        <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
          <Items hasChildren={finalItems.length}>
            {finalItems.map(({ userId }) => (
              <UserRow key={userId} userId={userId} />
            ))}
          </Items>
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && finalItems.length === 0 ? this.renderEmpty() : null}
      </>
    );
  }

  render() {
    const { items, t } = this.props;
    const { filterText } = this.state;

    return (
      <Wrapper>
        {items.length ? (
          <TopWrapper>
            <SearchStyled
              name="profile-subscriptions__search-input"
              inverted
              label={t('common.search')}
              type="search"
              placeholder={t('common.search_placeholder')}
              value={filterText}
              onChange={this.onFilterChange}
            />
          </TopWrapper>
        ) : null}
        {this.renderItems()}
      </Wrapper>
    );
  }
}
