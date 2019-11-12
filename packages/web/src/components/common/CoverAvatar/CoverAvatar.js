import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { styles } from '@commun/ui';
import { SHOW_MODAL_AVATAR_EDIT } from 'store/constants/modalTypes';
import { validateImageFile } from 'utils/uploadImage';

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

export default class CoverAvatar extends PureComponent {
  static propTypes = {
    editable: PropTypes.bool,
    communityId: PropTypes.string,
    userId: PropTypes.string,

    onUpdate: PropTypes.func,
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    editable: false,
    onUpdate: null,
    communityId: undefined,
    userId: undefined,
  };

  state = {};

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

  onAddPhoto = e => {
    const { openModal, onUpdate } = this.props;
    const file = e.target ? e.target.files[0] : e;

    if (validateImageFile(file)) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const image = reader.result;
        openModal(SHOW_MODAL_AVATAR_EDIT, { image, onUpdate, fileInputRef: this.fileInputRef });
      };

      reader.readAsDataURL(file);
    }
  };

  render() {
    const { userId, communityId, editable, className } = this.props;

    if (editable) {
      return (
        <Wrapper className={className}>
          <UploadWrapper onClick={this.onOpenMenu}>
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
          <DropDownMenu
            ref={this.dropdownMenuRef}
            align="left"
            openAt="bottom"
            handler={props => <UploadButton {...props} isAvatar />}
            items={() => (
              <>
                <DropDownMenuItem onClick={this.onEditClick}>Edit photo</DropDownMenuItem>
                <DropDownMenuItem onClick={() => this.onUpload()}>Delete photo</DropDownMenuItem>
              </>
            )}
          />
        </Wrapper>
      );
    }

    if (communityId) {
      return <Avatar communityId={communityId} className={className} />;
    }

    return <Avatar userId={userId} className={className} />;
  }
}
