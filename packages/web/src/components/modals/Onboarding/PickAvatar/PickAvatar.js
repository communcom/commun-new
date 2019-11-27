import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { styles, up, Button } from '@commun/ui';
import { Icon } from '@commun/icons';
import { validateImageFile } from 'utils/images/upload';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { profileType } from 'types';

import Avatar from 'components/common/Avatar';
import { Wrapper, Header, StepInfo, StepName, BackButton } from '../common.styled';

const ContentWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const AvatarStyled = styled(Avatar)`
  width: 100px;
  height: 100px;
  margin-bottom: 25px;

  ${up.tablet} {
    width: 226px;
    height: 226px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;

  ${up.tablet} {
    align-items: center;
    margin-bottom: 50px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const IconWrapperStyled = styled(IconWrapper)`
  background-color: ${({ theme }) => theme.colors.blue};
  color: #fff;
  transition: background-color 0.15s;
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: max-content;
  padding: 0 15px;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  line-height: normal;
  color: ${({ theme }) => theme.colors.blue};
  transition: color 0.15s;
  cursor: pointer;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }

  &:hover ${/* sc-selector */ IconWrapperStyled}, &:focus ${/* sc-selector */ IconWrapperStyled} {
    background-color: ${({ theme }) => theme.colors.blueHover};
  }

  ${is('isRed')`
    color: ${({ theme }) => theme.colors.lightRed};

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.red};
    }
  `};
`;

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;

  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

const ButtonStyled = styled(Button)`
  width: 288px;
  height: 50px;
  border-radius: 100px;

  ${is('isPlainText')`
    background-color: #fff;
  `};
`;

const HiddenInput = styled.input.attrs({ type: 'file' })`
  ${styles.visuallyHidden};
`;

export default class PickAvatar extends Component {
  static propTypes = {
    currentUserId: PropTypes.string.isRequired,
    profile: profileType.isRequired,

    close: PropTypes.func.isRequired,
    goToStep: PropTypes.func.isRequired,
    onSelectImage: PropTypes.func.isRequired,
    updateProfileMeta: PropTypes.func.isRequired,
  };

  onAddPhoto = e => {
    const { onSelectImage } = this.props;
    const file = e.target ? e.target.files[0] : e;

    if (validateImageFile(file)) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const image = reader.result;
        onSelectImage(image, this.goToEditor);
      };

      reader.readAsDataURL(file);
    }
  };

  onDeletePhoto = async () => {
    const { updateProfileMeta } = this.props;

    try {
      await updateProfileMeta({
        avatarUrl: '',
      });
      displaySuccess('Photo successfully deleted!');
    } catch (err) {
      displayError(err);
    }
  };

  goToEditor = () => {
    const { goToStep } = this.props;

    goToStep(1);
  };

  goToDescription = () => {
    const { goToStep } = this.props;

    goToStep(2);
  };

  renderPhotoActions() {
    const { profile } = this.props;
    const { avatarUrl } = profile.personal;

    return (
      <>
        <Action as="label" type={undefined}>
          <IconWrapper>
            <IconStyled name={avatarUrl ? 'edit-photo' : 'add-photo'} />
          </IconWrapper>
          {avatarUrl ? 'Edit Photo' : 'Add Photo'}
          <HiddenInput
            type="file"
            accept="image/*"
            id="avatar-file-input"
            name="onboarding__avatar-file-input"
            onChange={this.onAddPhoto}
          />
        </Action>
        {avatarUrl ? (
          <Action name="onboarding__delete-photo" isRed onClick={this.onDeletePhoto}>
            <IconWrapper>
              <IconStyled name="delete" />
            </IconWrapper>
            Delete Photo
          </Action>
        ) : null}
      </>
    );
  }

  renderButtons() {
    const { profile } = this.props;
    const { avatarUrl } = profile.personal;

    if (avatarUrl) {
      return (
        <ButtonStyled primary onClick={this.goToDescription}>
          Next
        </ButtonStyled>
      );
    }

    return (
      <ButtonStyled isPlainText onClick={this.goToDescription}>
        Continue without photo
      </ButtonStyled>
    );
  }

  render() {
    const { currentUserId, close } = this.props;

    return (
      <Wrapper>
        <Header>
          <BackButton onClick={close} />
        </Header>
        <StepInfo>
          <StepName>Pick profile picture</StepName>
        </StepInfo>
        <ContentWrapper>
          <AvatarStyled userId={currentUserId} />
          <ActionsWrapper>{this.renderPhotoActions()}</ActionsWrapper>
          <ButtonsWrapper>{this.renderButtons()}</ButtonsWrapper>
        </ContentWrapper>
      </Wrapper>
    );
  }
}
