import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// import { displayError, displaySuccess } from 'utils/toastsMessages';
import { Input, up } from '@commun/ui';
import { withTranslation } from 'shared/i18n';

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

    setAvatar: PropTypes.func.isRequired,
    setCover: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,
  };

  static defaultProps = {
    name: '',
    avatarUrl: '',
    coverUrl: '',
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
    const { setName } = this.props;

    setName(e.target.value);
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
    const { t, avatarUrl, coverUrl } = this.props;

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
              {/*  TODO: create community action */}
              <AsyncActionStyled onClickHandler={() => {}}>
                <FollowButton name="create-community-header__create" primary>
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
