/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, PaginationLoader, up } from '@commun/ui';

import { userType } from 'types';
import { withTranslation } from 'shared/i18n';
import { multiArgsMemoize } from 'utils/common';
import { displayError } from 'utils/toastsMessages';
import { fetchCommunityMembers } from 'store/actions/gate';

import EmptyList from 'components/common/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import SearchInput from 'components/common/SearchInput';
import UserRow from 'components/common/UserRow';

const Wrapper = styled(Card)`
  padding: 12px 10px 0;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  ${up.tablet} {
    padding: 0;
    overflow: hidden;
  }
`;

const HeaderStyled = styled.header`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;

  ${up.tablet} {
    margin-bottom: 10px;
    border-radius: 6px;
  }

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const ListWrapper = styled.ul`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  overflow: hidden;

  & > :not(:last-child) {
    margin-bottom: 2px;
  }

  ${up.tablet} {
    padding: 20px 15px;
    border-radius: 0;

    & > :not(:last-child) {
      margin-bottom: 0;
    }
  }
`;

@withTranslation()
export default class Members extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(userType).isRequired,

    fetchCommunityBlacklist: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(fetchCommunityMembers({ communityId: parentInitialProps.communityId }));
  }

  componentDidUpdate(prevProps) {
    const { communityId, fetchCommunityBlacklist } = this.props;

    if (communityId !== prevProps.communityId) {
      fetchCommunityBlacklist({ communityId });
    }
  }

  state = {
    filterText: '',
  };

  filterItems = multiArgsMemoize((items, filterText) => {
    if (filterText) {
      const filterTextLower = filterText.toLowerCase().trim();
      return items.filter(({ username }) => username.toLowerCase().startsWith(filterTextLower));
    }

    return items;
  });

  onFilterChange = text => {
    this.setState({
      filterText: text,
    });
  };

  onInviteMember = () => {
    // TODO: there will be inviteLeaderHandler
    // eslint-disable-next-line no-alert
    window.alert('Not implemented yet');
  };

  onNeedLoadMore = async () => {
    const { communityId, isLoading, isEnd, items, fetchCommunityBlacklist } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    try {
      await fetchCommunityBlacklist({
        communityId,
        offset: items.length,
      });
    } catch (err) {
      displayError(err);
    }
  };

  renderEmpty() {
    const { items, t } = this.props;

    if (items.length) {
      return <EmptyList noIcon />;
    }

    return <EmptyList noIcon headerText={t('components.leaderboard.banned.no_found')} />;
  }

  renderItems() {
    const { communityId, items, isEnd, isLoading } = this.props;
    const { filterText } = this.state;

    let finalItems = items;

    if (filterText.trim()) {
      finalItems = this.filterItems(items, filterText.trim().toLowerCase());
    }

    return (
      <>
        <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
          {finalItems.length ? (
            <ListWrapper>
              {finalItems.map(({ userId }) => (
                <UserRow
                  userId={userId}
                  communityId={communityId}
                  key={userId}
                  isLeaderboard
                  isBlacklist
                />
              ))}
            </ListWrapper>
          ) : null}
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && finalItems.length === 0 ? this.renderEmpty() : null}
      </>
    );
  }

  render() {
    const { t } = this.props;
    const { filterText } = this.state;

    return (
      <Wrapper>
        <HeaderStyled>
          <SearchInput
            name="community-blacklist__search-member-input"
            inverted
            label={t('common.search')}
            type="search"
            placeholder={t('common.search_placeholder')}
            value={filterText}
            onChange={this.onFilterChange}
          />
        </HeaderStyled>

        {this.renderItems()}
      </Wrapper>
    );
  }
}
