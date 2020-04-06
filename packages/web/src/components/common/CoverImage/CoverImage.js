/* stylelint-disable no-descending-specificity */
import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import AvatarEditor from 'react-avatar-editor';
import throttle from 'lodash.throttle';

import { styles, up, Button, Loader } from '@commun/ui';
import { Icon } from '@commun/icons';
import { withTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { validateImageFile, uploadImage } from 'utils/images/upload';
import { getImageRotationByExif } from 'utils/images/common';

import UploadButton from 'components/common/UploadButton';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

const ActionsWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 74px;
  padding: 0 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  z-index: 1;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0.15s, opacity 0.15s;

  ${up.desktop} {
    border-radius: 0;
  }

  ${is('isVisible')`
    visibility: visible;
    opacity: 1;
  `};
`;

const RightActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  transform: translateY(-20px);

  & > :not(:last-child) {
    margin-right: 10px;
  }

  ${up.mobileLandscape} {
    justify-content: flex-start;
    width: auto;
  }

  ${up.desktop} {
    transform: translateY(0);
  }
`;

const LeftActionsWrapper = styled.div`
  display: none;

  ${up.mobileLandscape} {
    display: block;
    transform: translateY(-20px);
  }

  ${up.desktop} {
    transform: translateY(0);
  }
`;

const DropDownMenuStyled = styled(DropDownMenu)`
  position: absolute;
  right: 16px;
  bottom: 40px;
  z-index: 5;

  ${up.desktop} {
    bottom: 16px;
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;

  &:hover ${UploadButton} {
    color: #333;
  }
`;

const Wrapper = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 180px;
  user-select: none;
  z-index: 1;
  overflow: hidden;

  ${is('isAbsolute')`
    position: absolute;
    top: 0;
    left: 0;
  `};

  ${up.mobileLandscape} {
    border-radius: 6px 6px 0 0;
  }

  ${up.desktop} {
    height: 210px;
    min-height: 210px;
  }
`;

const SimpleImage = styled(Wrapper)`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: ${({ theme }) => theme.colors.blue};
`;

const ProfileCover = styled.div`
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: ${({ theme }) => theme.colors.blue};

  ${is('isAbsolute')`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `};

  ${up.desktop} {
    border-radius: 6px 6px 0 0;
  }
`;

const UploadButtonStyled = styled(UploadButton)`
  position: static;
  background: rgba(0, 0, 0, 0.5);

  & svg {
    color: #fff;
  }
`;

const SingleUploadButton = styled(UploadButton)`
  bottom: 40px;
  right: 15px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);

  ${up.desktop} {
    bottom: 16px;
  }

  & svg {
    color: #fff;
  }
`;

const HiddenInput = styled.input`
  ${styles.visuallyHidden};
`;

const Badge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  padding: 0 14px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  visibility: hidden;
  opacity: 0;
  transition: visibility 0.15s, opacity 0.15s;

  & > :not(:last-child) {
    margin-right: 12px;
  }

  ${is('isVisible')`
    visibility: visible;
    opacity: 1;
  `};
`;

const MoveIcon = styled(Icon).attrs({ name: 'move' })`
  width: 24px;
  height: 24px;
`;

const BadgeText = styled.p`
  font-size: 13px;
  font-weight: normal;
  line-height: 15px;
  letter-spacing: -0.31px;
`;

const EditorWrapper = styled.div``;

const LoaderStyled = styled(Loader)`
  & > svg {
    width: 16px;
    height: 16px;
  }
`;

const canvasStyles = {
  borderRadius: '6px 6px 0 0',
  margin: '-3px 0',
};

@withTranslation()
export default class CoverImage extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string,
    coverUrl: PropTypes.string,
    editable: PropTypes.bool,
    isAbsolute: PropTypes.bool,
    isDesktop: PropTypes.bool,
    successMessage: PropTypes.string,

    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    communityId: null,
    coverUrl: null,
    isAbsolute: false,
    isDesktop: false,
    editable: false,
    onUpdate: null,
    successMessage: null,
  };

  state = {
    image: '',
    imageRotation: 0,
    editorWidth: 850,
    editorHeight: 210,
    isUpdating: false,
    isActionsVisible: true,
  };

  fileInputRef = createRef();

  dropdownMenuRef = createRef();

  wrapperRef = createRef();

  editorRef = createRef();

  componentDidMount() {
    this.getEditorSize();

    window.addEventListener('resize', this.getEditorSize);
  }

  componentWillUnmount() {
    this.unmount = true;

    window.removeEventListener('resize', this.getEditorSize);
    window.removeEventListener('mouseup', this.onEndMovePhoto);
    window.removeEventListener('touchend', this.onEndMovePhoto);

    this.getEditorSize.cancel();
  }

  onOpenMenu = () => {
    if (this.dropdownMenuRef.current) {
      this.dropdownMenuRef.current.onHandlerClick();
    }
  };

  onEditClick = () => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.click();
    }
  };

  onUpload = async (url = '') => {
    const { onUpdate, t } = this.props;

    if (onUpdate) {
      await onUpdate(url);

      if (!url) {
        displaySuccess(t('modals.cover_image.toastsMessages.image_deleted'));
      }
    }
  };

  onAddPhoto = async e => {
    const file = e.target ? e.target.files[0] : e;

    if (!file) {
      return;
    }

    if (validateImageFile(file)) {
      if (file.type === 'image/gif') {
        await this.updateCover(file);
        return;
      }

      const reader = new FileReader();

      reader.onloadend = async () => {
        const image = reader.result;
        const imageRotation = await getImageRotationByExif(file);

        this.setState({ image, imageRotation });
      };

      reader.readAsDataURL(file);
    }
  };

  onCancelClick = () => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
    }

    this.setState({
      image: '',
      imageRotation: 0,
    });
  };

  onSaveClick = async () => {
    const editor = this.editorRef.current;

    if (!editor) {
      return;
    }

    try {
      this.setState({
        isUpdating: true,
      });

      editor.getImageScaledToCanvas().toBlob(async image => {
        await this.updateCover(image);
      });
    } catch (err) {
      displayError(err);
    }
  };

  onStartMovePhoto = e => {
    e.preventDefault();

    window.addEventListener('touchend', this.onEndMovePhoto);
    window.addEventListener('mouseup', this.onEndMovePhoto);

    this.setState({ isActionsVisible: false });
  };

  onEndMovePhoto = e => {
    e.preventDefault();

    window.removeEventListener('mouseup', this.onEndMovePhoto);
    window.removeEventListener('touchend', this.onEndMovePhoto);

    this.setState({ isActionsVisible: true });
  };

  getEditorSize = throttle(() => {
    if (this.wrapperRef?.current) {
      const wrapper = this.wrapperRef.current;
      const width = wrapper.offsetWidth;
      const height = wrapper.offsetHeight;

      this.setState({
        editorWidth: width,
        editorHeight: height,
      });
    }
  }, 100);

  async updateCover(image) {
    try {
      const { onUpdate, successMessage, t } = this.props;
      const url = await uploadImage(image);

      if (!this.unmount && url) {
        await onUpdate(url);
        displaySuccess(successMessage || t('modals.cover_image.toastsMessages.image_updated'));

        if (this.fileInputRef.current) {
          this.fileInputRef.current.value = '';
        }

        this.setState({
          isUpdating: false,
          image: '',
          imageRotation: 0,
        });
      }
    } catch (err) {
      displayError(err);
    }
  }

  renderCover(style) {
    const { isAbsolute, t } = this.props;
    const { image, imageRotation, editorWidth, editorHeight, isActionsVisible } = this.state;

    if (image) {
      return (
        <EditorWrapper onTouchStart={this.onStartMovePhoto} onMouseDown={this.onStartMovePhoto}>
          <Badge isVisible={isActionsVisible}>
            <MoveIcon />
            <BadgeText>{t('modals.cover_image.drag_to_move')}</BadgeText>
          </Badge>
          <AvatarEditor
            ref={this.editorRef}
            image={image}
            width={editorWidth}
            height={editorHeight}
            border={[0, 3]}
            style={canvasStyles}
            rotate={imageRotation}
          />
        </EditorWrapper>
      );
    }

    return <ProfileCover style={style} isAbsolute={isAbsolute} />;
  }

  renderActions() {
    const { image, isUpdating, isActionsVisible } = this.state;
    const { coverUrl, isDesktop, t } = this.props;

    if (image) {
      return (
        <ActionsWrapper isVisible={isActionsVisible}>
          <LeftActionsWrapper>
            <Button primary onClick={this.onEditClick}>
              {t('modals.cover_image.choose')}
            </Button>
          </LeftActionsWrapper>
          <RightActionsWrapper>
            <Button onClick={this.onCancelClick}>{t('common.cancel')}</Button>
            <Button primary onClick={this.onSaveClick}>
              {isUpdating ? <LoaderStyled /> : t('common.save')}
            </Button>
          </RightActionsWrapper>
        </ActionsWrapper>
      );
    }

    if (coverUrl) {
      return (
        <DropDownMenuStyled
          ref={this.dropdownMenuRef}
          align="right"
          openAt={isDesktop ? 'bottom' : 'top'}
          handler={props => <UploadButtonStyled {...props} title={t('common.update')} />}
          items={() => (
            <>
              <DropDownMenuItem onClick={this.onEditClick}>
                {t('modals.cover_image.edit_photo')}
              </DropDownMenuItem>
              <DropDownMenuItem onClick={() => this.onUpload()}>
                {t('modals.cover_image.delete_photo')}
              </DropDownMenuItem>
            </>
          )}
        />
      );
    }

    return (
      <SingleUploadButton title={t('modals.cover_cover.upload_cover')} onClick={this.onEditClick} />
    );
  }

  render() {
    const { communityId, coverUrl, editable, isAbsolute } = this.props;
    const style = {};

    if (coverUrl) {
      style.backgroundColor = 'unset';
      style.backgroundImage = `url("${coverUrl}")`;
    }

    if (editable) {
      return (
        <Container>
          <Wrapper ref={this.wrapperRef} isAbsolute={isAbsolute}>
            {this.renderCover(style)}
            <HiddenInput
              ref={this.fileInputRef}
              type="file"
              accept="image/*"
              name={communityId ? 'community__cover-file-input' : 'profile__cover-file-input'}
              onChange={this.onAddPhoto}
            />
          </Wrapper>
          {this.renderActions()}
        </Container>
      );
    }

    return <SimpleImage style={style} isAbsolute={isAbsolute} />;
  }
}
