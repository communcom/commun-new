import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input, up } from '@commun/ui';

import { COMMUNITY_CREATION_TOKENS_NUMBER } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

import AsyncAction from 'components/common/AsyncAction';
import CoverImage from 'components/common/CoverImage';
import {
  ActionsWrapper,
  ContentWrapper,
  CoverAvatar,
  FollowButton,
  InfoWrapper,
  Wrapper,
} from 'components/common/EntityHeader';

const InputStyled = styled(Input)`
  flex-grow: 1;

  @media (min-width: 601px) {
    max-width: 355px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  padding-left: 10px;

  ${up.desktop} {
    padding-left: 15px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 1;
`;

const InfoWrapperStyled = styled(InfoWrapper)`
  flex-direction: column;
  align-items: stretch;

  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const ActionsWrapperStyled = styled(ActionsWrapper)`
  @media (max-width: 600px) {
    width: 100%;
    padding: 20px 0 10px;
    align-self: center;
  }
`;

const AsyncActionStyled = styled(AsyncAction)`
  @media (max-width: 600px) {
    width: 100%;

    & button {
      flex-grow: 1;
    }
  }
`;

const systemNames = [
  '_next',
  'hot',
  'trending',
  'feed',
  'faq',
  'agreement',
  'communities',
  'community',
  'policies',
  'search',
  'wallet',
  'settings',
  'blacklist',
  'notifications',
  'leaderboard',
  'payment',
];

@withTranslation()
export default class CreateCommunityHeader extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string,
    name: PropTypes.string,
    avatarUrl: PropTypes.string,
    coverUrl: PropTypes.string,
    communBalance: PropTypes.number,

    setAvatar: PropTypes.func.isRequired,
    setCover: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,
    fetchUsersCommunities: PropTypes.func.isRequired,
    getCommunity: PropTypes.func.isRequired,
    createCommunity: PropTypes.func.isRequired,
    restoreCommunityCreation: PropTypes.func.isRequired,
    openNotEnoughCommunsModal: PropTypes.func.isRequired,
    openCreateCommunityConfirmationModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    communityId: '',
    name: '',
    avatarUrl: '',
    coverUrl: '',
    communBalance: 0,
  };

  state = {
    hasError: false,
  };

  onAvatarUpdate = async url => {
    const { setAvatar } = this.props;

    setAvatar(url);
  };

  onCoverUpdate = async url => {
    const { setCover } = this.props;

    setCover(url);
  };

  onNameChange = e => {
    const { name, setName } = this.props;
    const { hasError } = this.state;
    const { value } = e.target;
    const nextValue = name ? value : value.trim();

    if (systemNames.includes(nextValue)) {
      this.setState({ hasError: true });
    } else if (hasError) {
      this.setState({ hasError: false });
    }

    setName(nextValue);
  };

  onCreateCommunityClick = async e => {
    e.preventDefault();

    const {
      name,
      communityId,
      communBalance,
      getCommunity,
      fetchUsersCommunities,
      openCreateCommunityConfirmationModal,
      openNotEnoughCommunsModal,
      createCommunity,
      restoreCommunityCreation,
    } = this.props;

    let pendingCommunityId = communityId;
    let canChangeCommunitySettings = true;

    try {
      const { communities } = await fetchUsersCommunities();
      const pendingCommunity = communities.find(community => !community.isDone);

      if (pendingCommunity) {
        const { community } = await getCommunity(pendingCommunity.communityId);
        pendingCommunityId = pendingCommunity.communityId;
        canChangeCommunitySettings = community.canChangeSettings;
      }
    } catch (err) {
      // eslint-disable-next-line
      console.warn('Cannot get pending community data from prism', err);
    }

    const hasPendingCommunity = Boolean(pendingCommunityId);

    if (
      communBalance < COMMUNITY_CREATION_TOKENS_NUMBER &&
      (!hasPendingCommunity || (hasPendingCommunity && canChangeCommunitySettings))
    ) {
      openNotEnoughCommunsModal();
    } else {
      openCreateCommunityConfirmationModal({
        isFinalConfirmation: true,
        createCommunity: hasPendingCommunity
          ? () => restoreCommunityCreation(pendingCommunityId, name)
          : () => createCommunity(name),
      });
    }
  };

  renderCommunityName() {
    const { name, t } = this.props;
    const { hasError } = this.state;

    return (
      <InputStyled
        fluid
        title={t('components.createCommunity.create_community_header.community_name_placeholder')}
        value={name}
        isError={hasError}
        onChange={this.onNameChange}
      />
    );
  }

  render() {
    const { t, name, avatarUrl, coverUrl } = this.props;

    return (
      <Wrapper>
        <CoverImage
          coverUrl={coverUrl}
          isCommunityCreation
          editable
          onUpdate={this.onCoverUpdate}
        />
        <ContentWrapper>
          <InfoWrapperStyled>
            <InfoContainer>
              <CoverAvatar
                avatarUrl={avatarUrl}
                isCommunity
                isCommunityCreation
                editable
                onUpdate={this.onAvatarUpdate}
              />
              <InputWrapper>{this.renderCommunityName()}</InputWrapper>
            </InfoContainer>
            <ActionsWrapperStyled>
              <AsyncActionStyled onClickHandler={this.onCreateCommunityClick}>
                <FollowButton name="create-community-header__create" primary disabled={!name}>
                  {t('components.createCommunity.create_community_header.create')}
                </FollowButton>
              </AsyncActionStyled>
            </ActionsWrapperStyled>
          </InfoWrapperStyled>
        </ContentWrapper>
      </Wrapper>
    );
  }
}
