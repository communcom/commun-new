/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Card,
  PaginationLoader,
  Search,
  up,
  // InvisibleText
} from '@commun/ui';

// import { Icon } from '@commun/icons';
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
    padding: 20px 15px 0;
    border-radius: 0;

    & > :not(:last-child) {
      margin-bottom: 0;
    }
  }
`;

/*
const InviteButton = styled.button.attrs({ type: 'button' })`
  position: relative;
  width: 34px;
  height: 34px;
  padding: 7px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  font-size: 20px;
  line-height: 100%;
  text-align: center;
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.blue};
  }
`;

const EmojiWrapper = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  line-height: 100%;
`;

const PlusIconWrapper = styled.div`
  position: absolute;
  right: -2px;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  line-height: 1;
  background-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid #fff;
  border-radius: 50%;
`;

const PlusIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
`;
*/

@withTranslation()
export default class Members extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(userType).isRequired,

    fetchCommunityMembers: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(fetchCommunityMembers({ communityId: parentInitialProps.communityId }));
  }

  componentDidUpdate(prevProps) {
    const { communityId, fetchCommunityMembers } = this.props;

    if (communityId !== prevProps.communityId) {
      fetchCommunityMembers({ communityId });
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
    const { communityId, isLoading, isEnd, items, fetchCommunityMembers } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    try {
      await fetchCommunityMembers({
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

    return <EmptyList headerText={t('components.community.members.no_found')} />;
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
          {finalItems.length ? (
            <ListWrapper>
              {finalItems.map(({ userId }) => (
                <UserRow userId={userId} key={userId} isLeaderboard />
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
            name="community-members__search-member-input"
            inverted
            label={t('common.search')}
            type="search"
            placeholder={t('common.search_placeholder')}
            value={filterText}
            onChange={this.onFilterChange}
          />

          {/* <InviteButton onClick={this.onInviteMember}> */}
          {/*  /!* eslint-disable-next-line jsx-a11y/accessible-emoji *!/ */}
          {/*  <EmojiWrapper role="img" aria-label="Invite member"> */}
          {/*    🤴🏻 */}
          {/*  </EmojiWrapper> */}
          {/*  <PlusIconWrapper> */}
          {/*    <PlusIcon /> */}
          {/*  </PlusIconWrapper> */}
          {/*  <InvisibleText>Invite member</InvisibleText> */}
          {/* </InviteButton> */}
        </HeaderStyled>

        {this.renderItems()}
      </Wrapper>
    );
  }
}
