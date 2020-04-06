import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// import { displayError, displaySuccess } from 'utils/toastsMessages';
import { Input } from '@commun/ui';
import { withTranslation } from 'shared/i18n';

import CoverImage from 'components/common/CoverImage';
import AsyncAction from 'components/common/AsyncAction';
import {
  Wrapper,
  ContentWrapper,
  InfoWrapper,
  CoverAvatar,
  NameWrapper,
  InfoContainer,
  FollowButton,
  ActionsWrapper,
} from 'components/common/EntityHeader';

const InputStyled = styled(Input)`
  max-width: 355px;
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
          successMessage="Proposal for cover changing has created"
          onUpdate={this.onCoverUpdate}
        />
        <ContentWrapper>
          <InfoWrapper>
            <CoverAvatar
              isCommunity
              avatarUrl={avatarUrl}
              isCommunityCreation
              successMessage="Proposal for avatar changing has created"
              editable
              onUpdate={this.onAvatarUpdate}
            />
            <InfoContainer>
              <NameWrapper>{this.renderCommunityName()}</NameWrapper>
            </InfoContainer>
            <ActionsWrapper>
              {/*  TODO: create community action */}
              <AsyncAction onClickHandler={() => {}}>
                <FollowButton name="create-community-header__create" primary>
                  {t('components.createCommunity.create_community_header.create')}
                </FollowButton>
              </AsyncAction>
            </ActionsWrapper>
          </InfoWrapper>
        </ContentWrapper>
      </Wrapper>
    );
  }
}
