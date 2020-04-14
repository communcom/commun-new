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
import { multiArgsMemoize } from 'utils/common';
import { displayError } from 'utils/toastsMessages';
import { withTranslation } from 'shared/i18n';
import { fetchCommunityMembers } from 'store/actions/gate';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import UserRow from 'components/common/UserRow';
import EmptyList from 'components/common/EmptyList';

const Wrapper = styled(Card)`
  padding: 12px 10px 0;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  ${up.tablet} {
    padding: 20px 15px 0;
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

const TopWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 15px 10px;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;

  & > :not(:last-child) {
    margin-right: 9px;
  }

  ${up.tablet} {
    padding: 0;
    margin-bottom: 0;
    background-color: unset;
    border-radius: 0;
  }
`;

const Items = styled.ul`
  border-radius: 10px;
  overflow: hidden;

  & > :not(:last-child) {
    margin-bottom: 2px;
  }

  ${up.tablet} {
    padding-top: 20px;
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

const SearchStyled = styled(Search)`
  flex-grow: 1;

  & input {
    &,
    &::placeholder {
      font-size: 15px;
      line-height: 20px;
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

    fetchCommunityMembers: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(
      fetchCommunityMembers({
        communityId: parentInitialProps.communityId,
      })
    );
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
          <Items>
            {finalItems.map(({ userId }) => (
              <UserRow userId={userId} key={userId} />
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
          </TopWrapper>
        ) : null}
        {this.renderItems()}
      </Wrapper>
    );
  }
}
