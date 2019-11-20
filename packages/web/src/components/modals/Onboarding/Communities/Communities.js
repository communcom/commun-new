import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Search, InvisibleText, CloseButton } from '@commun/ui';
import { Icon } from '@commun/icons';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { communityType } from 'types/common';
import { multiArgsMemoize } from 'utils/common';

import InfinityScrollWrapper from 'components/common/InfinityScrollWrapper';
import EmptyList from 'components/common/EmptyList';
import CommunityRow from 'components/common/CommunityRow';
import Avatar from 'components/common/Avatar';
import {
  Wrapper,
  Header,
  Items,
  StepInfo,
  StepName,
  StepDesc,
  Actions,
  BackButton,
} from '../common.styled';

const ActionWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: 2px dashed ${({ theme }) => theme.colors.blue};
  border-radius: 100%;

  ${is('isEmpty')`
    border-color: ${({ theme }) => theme.colors.gray};
  `};
`;

const LeftActionsWrapper = styled.div`
  display: flex;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const RightActionsWrapper = styled.div`
  display: flex;
`;

const AvatarStyled = styled(Avatar)`
  border: 1px solid #fff;
`;

const SubmitButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.blue};
  color: #fff;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

const IconStyled = styled(Icon)`
  width: 20px;
  height: 20px;
  transform: rotate(-90deg);
`;

const CloseButtonStyled = styled(CloseButton)`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${({ theme }) => theme.colors.blue};
  color: #fff;
  border: 2px solid #fff;

  &:hover,
  &:focus {
    color: #fff;
  }
`;

const ItemsContainer = styled.div`
  margin-top: 20px;
`;

export default class Communities extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    currentUserId: PropTypes.string.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,

    getCommunities: PropTypes.func.isRequired,
    leaveCommunity: PropTypes.func.isRequired,
    fetchCommunity: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    goToStep: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    filterText: '',
    isLoading: false,
  };

  filterItems = multiArgsMemoize((items, filter) =>
    items.filter(community => community.name.toLowerCase().startsWith(filter))
  );

  async componentDidMount() {
    const { currentUserId, getCommunities } = this.props;

    try {
      await getCommunities({
        userId: currentUserId,
      });
    } catch (err) {
      displayError(err);
    }
  }

  onFilterChange = e => {
    this.setState({
      filterText: e.target.value,
    });
  };

  onLeave = async communityId => {
    const { leaveCommunity, waitForTransaction, fetchCommunity } = this.props;

    this.setState({
      isLoading: true,
    });

    try {
      const result = await leaveCommunity(communityId);
      displaySuccess('User unfollowed');

      await waitForTransaction(result.transaction_id);
      await fetchCommunity({ communityId });
    } catch (err) {
      displayError(err);
    }

    this.setState({
      isLoading: false,
    });
  };

  onBackClick = () => {
    const { goToStep } = this.props;

    goToStep(2);
  };

  getMyCommunities() {
    const { items } = this.props;
    const myCommunities = items.filter(item => item.isSubscribed);

    if (myCommunities.length < 3) {
      while (myCommunities.length < 3) {
        myCommunities.push({
          communityId: Math.random(),
          isEmpty: true,
        });
      }
    }

    if (myCommunities.length > 3) {
      myCommunities.length = 3;
    }

    return myCommunities;
  }

  checkLoadMore = async () => {
    const { currentUserId, items, isAllowLoadMore, getCommunities } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    await getCommunities({
      currentUserId,
      offset: items.length,
    });
  };

  renderEmpty() {
    const { items } = this.props;

    if (items.length) {
      return <EmptyList headerText="Nothing is found" noIcon />;
    }

    return null;
  }

  renderItems() {
    const { items, isAllowLoadMore } = this.props;
    const { filterText } = this.state;

    let finalItems = items;

    if (filterText.trim()) {
      finalItems = this.filterItems(items, filterText.trim().toLowerCase());
    }

    return (
      <ItemsContainer>
        <InfinityScrollWrapper disabled={!isAllowLoadMore} onNeedLoadMore={this.checkLoadMore}>
          {props => (
            <>
              <Items {...props}>
                {finalItems.map(({ communityId }) => (
                  <CommunityRow isOnboarding communityId={communityId} key={communityId} />
                ))}
              </Items>
              {!finalItems.length ? this.renderEmpty() : null}
            </>
          )}
        </InfinityScrollWrapper>
      </ItemsContainer>
    );
  }

  render() {
    const { items, close } = this.props;
    const { filterText, isLoading } = this.state;

    const chosenCommunities = this.getMyCommunities();
    const myCommunities = chosenCommunities.filter(item => !item.isEmpty);

    return (
      <Wrapper withActions>
        <Header>
          <BackButton onClick={this.onBackClick} />
        </Header>
        <StepInfo>
          <StepName>Build your feed</StepName>
          <StepDesc>You need to subscribe at least 3 communities</StepDesc>
        </StepInfo>
        {items.length ? (
          <Search
            name="profile-user-communities__search-input"
            inverted
            label="Search"
            type="search"
            placeholder="Search..."
            value={filterText}
            onChange={this.onFilterChange}
          />
        ) : null}
        {this.renderItems()}
        <Actions>
          <LeftActionsWrapper>
            {chosenCommunities.map(({ communityId, isEmpty }) => (
              <ActionWrapper key={communityId} isEmpty={isEmpty}>
                {isEmpty ? null : (
                  <>
                    <AvatarStyled isCommunity communityId={communityId} />
                    <CloseButtonStyled
                      disabled={isLoading}
                      onClick={() => this.onLeave(communityId)}
                    />
                  </>
                )}
              </ActionWrapper>
            ))}
          </LeftActionsWrapper>
          <RightActionsWrapper>
            <SubmitButton disabled={myCommunities.length < 3 || isLoading} onClick={close}>
              <IconStyled name="chevron" />
              <InvisibleText>Finish</InvisibleText>
            </SubmitButton>
          </RightActionsWrapper>
        </Actions>
      </Wrapper>
    );
  }
}
