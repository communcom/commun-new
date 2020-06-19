import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, CloseButton, InvisibleText, Loader, Search } from '@commun/ui';

import { communityType } from 'types/common';
import { COMMUNITIES_AIRDROP_COUNT, ONBOARDING_REGISTRATION_WAIT_KEY } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { trackEvent } from 'utils/analytics';
import { multiArgsMemoize } from 'utils/common';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { OPENED_FROM_ONBOARDING_COMMUNITIES, SHOW_MODAL_LOGIN } from 'store/constants';

import AsyncAction from 'components/common/AsyncAction';
import Avatar from 'components/common/Avatar';
import CommunityRow from 'components/common/CommunityRow';
import EmptyList from 'components/common/EmptyList';
import InfinityScrollWrapper from 'components/common/InfinityScrollWrapper';
import { Content, Wrapper } from '../common.styled';

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
  margin-right: 10px;

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
    margin-bottom: 10px;
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

const SwitchWrapper = styled.div`
  display: flex;
  padding: 11px 0;
`;

const SwitchText = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
`;

const SwitchButton = styled(SwitchText).attrs({ as: 'button', type: 'button' })`
  color: ${({ theme }) => theme.colors.blue};
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
  padding: 20px 10px;
  box-shadow: 0px -10px 36px rgba(174, 181, 206, 0.21);
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.white};

  @media (min-width: 400px) {
    padding: 20px;
  }
`;

const LoaderStyled = styled(Loader)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.blue};
`;

@withTranslation()
export default class Communities extends PureComponent {
  static propTypes = {
    refId: PropTypes.string,
    items: PropTypes.arrayOf(communityType).isRequired,
    pendingCommunities: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentUserId: PropTypes.string.isRequired,
    isSignUp: PropTypes.bool.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    selectedItems: PropTypes.arrayOf(communityType),
    selectedItemsIds: PropTypes.arrayOf(PropTypes.string),

    onChangeLoading: PropTypes.func,
    getCommunities: PropTypes.func.isRequired,
    joinCommunity: PropTypes.func.isRequired,
    leaveCommunity: PropTypes.func.isRequired,
    unauthRemoveCommunity: PropTypes.func.isRequired,
    fetchCommunity: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    fetchOnboardingCommunitySubscriptions: PropTypes.func.isRequired,
    unauthClearCommunities: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    openSignUpModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    clearOnboardingCommunities: PropTypes.func.isRequired,
  };

  static defaultProps = {
    refId: null,
    selectedItems: [],
    selectedItemsIds: [],

    onChangeLoading: undefined,
  };

  state = {
    filterText: '',
    isLoading: false,
  };

  filterItems = multiArgsMemoize((items, filter) =>
    items.filter(community => community.name.toLowerCase().startsWith(filter))
  );

  async componentDidMount() {
    const { getCommunities, refId, clearOnboardingCommunities } = this.props;

    clearOnboardingCommunities();

    try {
      await getCommunities({ sortingToken: refId });
    } catch (err) {
      displayError(err);
    }
  }

  componentWillUnmount() {
    const { clearOnboardingCommunities } = this.props;

    localStorage.removeItem(ONBOARDING_REGISTRATION_WAIT_KEY);
    clearOnboardingCommunities();
  }

  replaceWithLoginModal = async () => {
    const { openModal, close } = this.props;

    close(openModal(SHOW_MODAL_LOGIN));
  };

  onFilterChange = text => {
    this.setState({
      filterText: text,
    });
  };

  onLeave = async communityId => {
    const {
      isSignUp,
      leaveCommunity,
      unauthRemoveCommunity,
      waitForTransaction,
      fetchCommunity,
      t,
    } = this.props;

    this.setState({
      isLoading: true,
    });

    try {
      if (isSignUp) {
        await unauthRemoveCommunity(communityId);
      } else {
        const result = await leaveCommunity(communityId, true);
        displaySuccess(t('toastsMessages.community.unfollowed'));

        await waitForTransaction(result.transaction_id);
        await fetchCommunity({ communityId });
      }
    } catch (err) {
      displayError(err);
    }

    this.setState({
      isLoading: false,
    });
  };

  getChosenCommunities() {
    const { isSignUp, pendingCommunities, selectedItems } = this.props;
    const myCommunities = isSignUp
      ? pendingCommunities.map(communityId => ({ communityId }))
      : [...selectedItems];

    while (myCommunities.length < COMMUNITIES_AIRDROP_COUNT) {
      myCommunities.push({
        communityId: Math.random(),
        isEmpty: true,
      });
    }

    return myCommunities.slice(0, COMMUNITIES_AIRDROP_COUNT);
  }

  checkLoadMore = async () => {
    const { items, isAllowLoadMore, getCommunities, refId } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    await getCommunities({
      offset: items.length,
      sortingToken: refId,
    });
  };

  handleNextClick = async () => {
    const {
      pendingCommunities,
      isSignUp,
      onChangeLoading,
      joinCommunity,
      fetchOnboardingCommunitySubscriptions,
      unauthClearCommunities,
      getBalance,
      openSignUpModal,
      next,
      selectedItemsIds,
    } = this.props;
    let { currentUserId } = this.props;

    this.setState({
      isLoading: true,
    });

    if (onChangeLoading) {
      onChangeLoading(true);
    }

    let user;
    let chosenCommunities = [];

    if (isSignUp) {
      user = await openSignUpModal({
        openedFrom: OPENED_FROM_ONBOARDING_COMMUNITIES,
      });

      if (!user) {
        this.setState({
          isLoading: false,
        });

        if (onChangeLoading) {
          onChangeLoading(false);
        }

        return;
      }

      currentUserId = user.userId;
      chosenCommunities = pendingCommunities;

      await Promise.all(chosenCommunities.map(communityId => joinCommunity(communityId)));
    } else {
      chosenCommunities = [...selectedItemsIds];
    }

    const communityIds = chosenCommunities.slice(0, COMMUNITIES_AIRDROP_COUNT);

    await fetchOnboardingCommunitySubscriptions({
      userId: currentUserId,
      communityIds,
    });

    trackEvent('Bounty subscribe', {
      num: chosenCommunities.length,
    });

    unauthClearCommunities();

    setTimeout(() => {
      getBalance();
    }, 4000);

    this.setState({
      isLoading: false,
    });

    if (onChangeLoading) {
      onChangeLoading(false);
    }

    next();
  };

  renderItems() {
    const { items, isAllowLoadMore, isSignUp } = this.props;
    const { filterText } = this.state;

    let finalItems = items;

    if (filterText.trim()) {
      finalItems = this.filterItems(items, filterText.trim().toLowerCase());
    }

    return (
      <ItemsContainer>
        <InfinityScrollWrapper disabled={!isAllowLoadMore} onNeedLoadMore={this.checkLoadMore}>
          {props =>
            finalItems.length ? (
              <Items {...props}>
                {finalItems.map(({ communityId }) => (
                  <CommunityRow
                    key={communityId}
                    isOnboarding
                    isSignUp={isSignUp}
                    communityId={communityId}
                  />
                ))}
              </Items>
            ) : (
              this.renderEmpty()
            )
          }
        </InfinityScrollWrapper>
      </ItemsContainer>
    );
  }

  renderEmpty() {
    const { items } = this.props;

    if (items.length) {
      return <EmptyList noIcon />;
    }

    return null;
  }

  renderSignUpButton(isDisabled) {
    const { t } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return <LoaderStyled />;
    }

    return (
      <Button primary disabled={isDisabled} onClick={this.handleNextClick}>
        {t('modals.onboarding_registration.communities.sign_up')}
      </Button>
    );
  }

  render() {
    const { items, isSignUp, t } = this.props;
    const { filterText, isLoading } = this.state;

    const chosenCommunities = this.getChosenCommunities();
    const myCommunities = chosenCommunities.filter(item => !item.isEmpty);

    const isDisabled = myCommunities.length < COMMUNITIES_AIRDROP_COUNT || isLoading;

    return (
      <Wrapper>
        <ContentStyled>
          <StepInfo>
            <StepName>
              {isSignUp
                ? t('modals.onboarding_registration.communities.title-sign_up')
                : t('modals.onboarding_registration.communities.title')}
            </StepName>
            <StepDesc>
              {t('modals.onboarding_registration.communities.text', {
                count: COMMUNITIES_AIRDROP_COUNT,
                COMMUNITIES_AIRDROP_COUNT,
              })}
            </StepDesc>
            {isSignUp ? (
              <SwitchWrapper>
                <SwitchText>
                  {t('modals.onboarding_registration.communities.sign_in_text')}
                </SwitchText>
                <SwitchButton onClick={this.replaceWithLoginModal}>
                  &nbsp;{t('modals.onboarding_registration.communities.sign_in')}
                </SwitchButton>
              </SwitchWrapper>
            ) : null}
          </StepInfo>

          {items.length ? (
            <Search
              name="profile-user-communities__search-input"
              inverted
              label={t('common.search')}
              type="search"
              placeholder={t('common.search_placeholder')}
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
            {isSignUp ? (
              this.renderSignUpButton(isDisabled)
            ) : (
              <SubmitButton disabled={isDisabled} onClick={this.handleNextClick}>
                <IconStyled name="chevron" />
                <InvisibleText>
                  {t('modals.onboarding_registration.communities.finish')}
                </InvisibleText>
              </SubmitButton>
            )}
          </RightActionsWrapper>
        </Actions>
      </Wrapper>
    );
  }
}
