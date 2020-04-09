import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input, up } from '@commun/ui';
import { withTranslation } from 'shared/i18n';
import {
  COMMUNITY_CREATION_KEY,
  COMMUNITY_CREATION_TOKENS_NUMBER,
  COMMUN_SYMBOL,
} from 'shared/constants';
import { displayError } from 'utils/toastsMessages';
import { getDefaultRules } from 'utils/community';

import CoverImage from 'components/common/CoverImage';
import AsyncAction from 'components/common/AsyncAction';
import {
  Wrapper,
  ContentWrapper,
  InfoWrapper,
  CoverAvatar,
  FollowButton,
  ActionsWrapper,
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

@withTranslation()
export default class CreateCommunityHeader extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    avatarUrl: PropTypes.string,
    coverUrl: PropTypes.string,
    communityCreationState: PropTypes.object.isRequired,
    communBalance: PropTypes.number,

    setAvatar: PropTypes.func.isRequired,
    setCover: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,
    createNewCommunity: PropTypes.func.isRequired,
    setCommunitySettings: PropTypes.func.isRequired,
    startCommunityCreation: PropTypes.func.isRequired,
    openNotEnoughCommunsModal: PropTypes.func.isRequired,
    openCreateCommunityConfirmationModal: PropTypes.func.isRequired,
    transfer: PropTypes.func.isRequired,
    fetchCommunity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    name: '',
    avatarUrl: '',
    coverUrl: '',
    communBalance: 0,
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
    const { value } = e.target;
    const nextValue = name ? value : value.trim();

    setName(nextValue);
  };

  onCreateCommunityClick = e => {
    e.preventDefault();

    const {
      communBalance,
      openCreateCommunityConfirmationModal,
      openNotEnoughCommunsModal,
    } = this.props;

    if (communBalance < COMMUNITY_CREATION_TOKENS_NUMBER) {
      openNotEnoughCommunsModal();
    } else {
      openCreateCommunityConfirmationModal({
        isFinalConfirmation: true,
        createCommunity: this.createCommunity,
      });
    }
  };

  createCommunity = async () => {
    const {
      name,
      communityCreationState,
      createNewCommunity,
      setCommunitySettings,
      startCommunityCreation,
      transfer,
      fetchCommunity,
    } = this.props;

    const language = communityCreationState.language?.code || 'en';
    const trimmedName = name.trim();
    const rules = communityCreationState.rules.length
      ? communityCreationState.rules
      : getDefaultRules(communityCreationState.language);

    try {
      // TODO: don't know answer format. Also name duplication error should be processed
      const { communityId } = await createNewCommunity({ name: trimmedName });
      const communitySettings = {
        ...communityCreationState,
        rules: JSON.stringify(rules),
        language: language.toLowerCase(),
        name: trimmedName,
        communityId,
      };

      await setCommunitySettings(communitySettings);
      const trx = await transfer(
        // TODO: our service account userId
        'anyUserId',
        COMMUNITY_CREATION_TOKENS_NUMBER,
        COMMUN_SYMBOL,
        `for community: ${communityId}`
      );
      const trxId = trx?.processed?.id;
      await startCommunityCreation(communityId, trxId);
      // TODO: we should get communityAlias from fetchCommunity for redirect to new community page
      await fetchCommunity({ communityId });
      localStorage.removeItem(COMMUNITY_CREATION_KEY);
    } catch (err) {
      displayError(err);
    }
  };

  renderCommunityName() {
    const { name, t } = this.props;

    return (
      <InputStyled
        fluid
        title={t('components.createCommunity.create_community_header.community_name_placeholder')}
        value={name}
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
