import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Search, InvisibleText, CloseButton } from '@commun/ui';
import { Icon } from '@commun/icons';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { ONBOARDING_REGISTRATION_WAIT_KEY } from 'shared/constants';
import { communityType } from 'types/common';
import { multiArgsMemoize } from 'utils/common';

import InfinityScrollWrapper from 'components/common/InfinityScrollWrapper';
import EmptyList from 'components/common/EmptyList';
import CommunityRow from 'components/common/CommunityRow';
import Avatar from 'components/common/Avatar';
import AsyncAction from 'components/common/AsyncAction';
import { Wrapper, Content } from '../common.styled';

const ContentStyled = styled(Content)`
  margin: 0 20px;
`;

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
    border-color: #ededf2;
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

const AsyncActionStyled = styled(AsyncAction)`
  position: absolute;
  top: -4px;
  right: -4px;
  color: #fff;
  width: 24px;
  height: 24px;
`;

const CloseButtonStyled = styled(CloseButton)`
  background: ${({ theme }) => theme.colors.blue};
  color: #fff;
  border: 2px solid #fff;

  &:hover,
  &:focus {
    color: #fff;
  }
`;

const ItemsContainer = styled.div`
  position: relative;
  flex: 1;
  margin-top: 20px;
`;

const Items = styled.ul`
  position: absolute;
  display: block;
  width: 100%;
  top: 0;
  bottom: 0;
  overflow: auto;
  overflow-x: hidden;
`;

const StepInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;

  & > :not(:last-child) {
    margin-bottom: 5px;
  }
`;

const StepName = styled.h2`
  font-weight: bold;
  font-size: 24px;
  line-height: 33px;
`;

const StepDesc = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
`;

export const Actions = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 90px;
  padding: 20px 20px;
  box-shadow: 0px -10px 36px rgba(174, 181, 206, 0.21);
  border-radius: 20px;
  background: #fff;
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
    fetchOnboardingCommunitySubscriptions: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,

    next: PropTypes.func.isRequired,
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

  componentWillUnmount() {
    localStorage.removeItem(ONBOARDING_REGISTRATION_WAIT_KEY);
  }

  onFilterChange = text => {
    this.setState({
      filterText: text,
    });
  };

  onLeave = async communityId => {
    const { leaveCommunity, waitForTransaction, fetchCommunity } = this.props;

    this.setState({
      isLoading: true,
    });

    try {
      const result = await leaveCommunity(communityId);
      displaySuccess('Community unfollowed');

      await waitForTransaction(result.transaction_id);
      await fetchCommunity({ communityId });
    } catch (err) {
      displayError(err);
    }

    this.setState({
      isLoading: false,
    });
  };

  getChosenCommunities() {
    const { items } = this.props;
    const myCommunities = items.filter(item => item.isSubscribed);

    while (myCommunities.length < 3) {
      myCommunities.push({
        communityId: Math.random(),
        isEmpty: true,
      });
    }

    return myCommunities.slice(0, 3);
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

  handleNextClick = async () => {
    const { next, currentUserId, fetchOnboardingCommunitySubscriptions } = this.props;

    const chosenCommunities = this.getChosenCommunities();

    await fetchOnboardingCommunitySubscriptions({
      userId: currentUserId,
      communityIds: chosenCommunities.map(community => community.communityId),
    });

    next();
  };

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

  renderEmpty() {
    const { items } = this.props;

    if (items.length) {
      return <EmptyList headerText="Nothing is found" noIcon />;
    }

    return null;
  }

  render() {
    const { items } = this.props;
    const { filterText, isLoading } = this.state;

    const chosenCommunities = this.getChosenCommunities();
    const myCommunities = chosenCommunities.filter(item => !item.isEmpty);

    return (
      <Wrapper>
        <ContentStyled>
          <StepInfo>
            <StepName>Get you first points</StepName>
            <StepDesc>
              Subscribe to at least 3 communities and get your first Community Points
            </StepDesc>
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
        </ContentStyled>

        <Actions>
          <LeftActionsWrapper>
            {chosenCommunities.map(({ communityId, isEmpty }) => (
              <ActionWrapper key={communityId} isEmpty={isEmpty}>
                {isEmpty ? null : (
                  <>
                    <AvatarStyled isCommunity communityId={communityId} />
                    <AsyncActionStyled onClickHandler={() => this.onLeave(communityId)}>
                      <CloseButtonStyled />
                    </AsyncActionStyled>
                  </>
                )}
              </ActionWrapper>
            ))}
          </LeftActionsWrapper>
          <RightActionsWrapper>
            <SubmitButton
              disabled={myCommunities.length < 3 || isLoading}
              onClick={this.handleNextClick}
            >
              <IconStyled name="chevron" />
              <InvisibleText>Finish</InvisibleText>
            </SubmitButton>
          </RightActionsWrapper>
        </Actions>
      </Wrapper>
    );
  }
}
