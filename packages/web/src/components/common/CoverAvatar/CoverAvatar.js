import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { styles } from '@commun/ui';
import { SHOW_MODAL_AVATAR_EDIT } from 'store/constants/modalTypes';
import { withTranslation } from 'shared/i18n';
import { validateImageFile, uploadImage } from 'utils/images/upload';
import { getImageRotationByExif } from 'utils/images/common';
import { displaySuccess, displayError } from 'utils/toastsMessages';

import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import Avatar from 'components/common/Avatar';
import UploadButton from 'components/common/UploadButton';

const UploadWrapper = styled.div`
  display: block;
  position: relative;
  height: 100%;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
`;

const AvatarStyled = styled(Avatar)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: unset;
  height: unset;
`;

const Wrapper = styled.div`
  position: relative;

  &:hover ${UploadButton} {
    color: #333;
  }
`;

const HiddenInput = styled.input`
  ${styles.visuallyHidden};
`;

@withTranslation()
export default class CoverAvatar extends PureComponent {
  static propTypes = {
    editable: PropTypes.bool,
    communityId: PropTypes.string,
    userId: PropTypes.string,
    avatarUrl: PropTypes.string,
    successMessage: PropTypes.string,

    onUpdate: PropTypes.func,
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    editable: false,
    onUpdate: null,
    communityId: undefined,
    userId: undefined,
    avatarUrl: undefined,
    successMessage: null,
  };

  fileInputRef = createRef();

  dropdownMenuRef = createRef();

  onOpenMenu = () => {
    if (this.dropdownMenuRef.current) {
      this.dropdownMenuRef.current.onHandlerClick();
    }
  };

  onUpload = async (url = '') => {
    const { onUpdate } = this.props;

    if (onUpdate) {
      await onUpdate(url);
    }
  };

  onEditClick = () => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.click();
    }
  };

  onAddPhoto = async e => {
    const { successMessage, openModal, onUpdate } = this.props;
    const file = e.target ? e.target.files[0] : e;

    if (validateImageFile(file)) {
      if (file.type === 'image/gif') {
        await this.updateAvatar(file);
        return;
      }

      const reader = new FileReader();

      reader.onloadend = async () => {
        const image = reader.result;
        const imageRotation = await getImageRotationByExif(file);

        openModal(SHOW_MODAL_AVATAR_EDIT, {
          image,
          onUpdate,
          fileInputRef: this.fileInputRef,
          successMessage,
          imageRotation,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  async updateAvatar(image) {
    try {
      const { successMessage, onUpdate, t } = this.props;
      const url = await uploadImage(image);

      if (!this.unmount && url) {
        await onUpdate(url);
        displaySuccess(
          successMessage || t('components.cover_avatar.toastsMessages.avatar_updated')
        );

        if (this.fileInputRef?.current) {
          this.fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      displayError(err);
    }
  }

  renderDropdown() {
    const { avatarUrl } = this.props;

    if (avatarUrl) {
      return (
        <DropDownMenu
          ref={this.dropdownMenuRef}
          align="left"
          openAt="bottom"
          handler={props => <UploadButton {...props} isAvatar title="Update" />}
          items={() => (
            <>
              <DropDownMenuItem onClick={this.onEditClick}>Edit photo</DropDownMenuItem>
              <DropDownMenuItem onClick={() => this.onUpload()}>Delete photo</DropDownMenuItem>
            </>
          )}
        />
      );
    }

    return <UploadButton isAvatar title="Upload new avatar image" onClick={this.onEditClick} />;
  }

  render() {
    const { avatarUrl, userId, communityId, editable, className } = this.props;

    if (editable) {
      return (
        <Wrapper className={className}>
          <UploadWrapper onClick={avatarUrl ? this.onOpenMenu : this.onEditClick}>
            {communityId ? (
              <AvatarStyled communityId={communityId} />
            ) : (
              <AvatarStyled userId={userId} />
            )}
            <HiddenInput
              ref={this.fileInputRef}
              type="file"
              accept="image/*"
              id="avatar-file-input"
              name={communityId ? 'community__avatar-file-input' : 'profile__avatar-file-input'}
              onChange={this.onAddPhoto}
            />
          </UploadWrapper>
          {this.renderDropdown()}
        </Wrapper>
      );
    }

    if (communityId) {
      return <Avatar communityId={communityId} className={className} />;
    }

    return <Avatar userId={userId} className={className} />;
  }
}
