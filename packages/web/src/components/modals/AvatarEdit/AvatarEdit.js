import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';

import { InvisibleText, Loader } from '@commun/ui';
import { withTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { uploadImage } from 'utils/images/upload';

import {
  Wrapper,
  DescriptionHeader,
  ModalName,
  Actions,
  CloseButtonStyled,
  BackButton,
} from '../common/common.styled';
import {
  RANGE_MIN,
  RANGE_MAX,
  RANGE_STEP,
  ROTATE_STEP,
  RANGE_THUMB_SIZE,
  EditorWrapper,
  ControlsWrapper,
  RangeWrapper,
  RangeFilledLine,
  Range,
  ScaleIcon,
  RotateIcon,
  RotateButton,
  SaveButtonStyled,
  CancelButton,
  ActionContainer,
  editorStyles,
} from '../common/AvatarEdit.styled';

@withTranslation()
class AvatarEdit extends Component {
  static propTypes = {
    image: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    fileInputRef: PropTypes.object.isRequired,
    successMessage: PropTypes.string,
    imageRotation: PropTypes.number,

    close: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    successMessage: null,
    imageRotation: 0,
  };

  editorRef = createRef();

  state = {
    scaleValue: 1,
    // eslint-disable-next-line react/destructuring-assignment
    rotateValue: this.props.imageRotation,
    isUpdating: false,
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  onRangeChange = e => {
    const { value } = e.target;

    this.setState({
      scaleValue: value,
    });
  };

  onRotateClick = () => {
    this.setState(prevState => ({
      rotateValue: prevState.rotateValue < 360 ? prevState.rotateValue + ROTATE_STEP : 0,
    }));
  };

  onCloseClick = () => {
    const { close, fileInputRef } = this.props;
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
    close();
  };

  onSaveClick = async () => {
    const { successMessage, fileInputRef, onUpdate, close } = this.props;
    const editor = this.editorRef.current;

    if (editor) {
      try {
        this.setState({
          isUpdating: true,
        });

        editor.getImageScaledToCanvas().toBlob(async image => {
          const url = await uploadImage(image);

          if (!this.unmount && url) {
            await onUpdate(url);
            displaySuccess(successMessage || 'Avatar updated');

            this.setState({
              isUpdating: false,
            });

            if (fileInputRef?.current) {
              fileInputRef.current.value = '';
            }

            close();
          }
        });
      } catch (err) {
        displayError(err);
      }
    }
  };

  // TODO: should be splitted on separated methods for width and height when canvasSize prop will be added to react-avatar-editor
  setEditorSize() {
    const { isMobile } = this.props;
    let size = 250;

    if (process.browser) {
      const screenWidth = window.innerWidth;

      if (screenWidth >= 360) {
        size = 300;
      }

      if (!isMobile) {
        size = 400;
      }
    }

    return size;
  }

  render() {
    const { image, t } = this.props;
    const { scaleValue, rotateValue, isUpdating } = this.state;
    const filledAreaWidth = scaleValue - 1;
    // фикс, чтобы полоса заполнения не перекрывала ползунок
    const filledAreaFix = RANGE_THUMB_SIZE * filledAreaWidth;

    return (
      <Wrapper>
        <DescriptionHeader>
          <BackButton onClick={this.onCloseClick} />
          <ModalName>{t('modals.avatar_edit.title')}</ModalName>
          <CloseButtonStyled onClick={this.onCloseClick} />
        </DescriptionHeader>
        <EditorWrapper>
          <AvatarEditor
            ref={this.editorRef}
            image={image}
            width={this.setEditorSize()}
            height={this.setEditorSize()}
            border={[10, 50]}
            borderRadius={1000}
            color={[0, 0, 0, 0.5]}
            scale={scaleValue}
            rotate={rotateValue}
            style={editorStyles}
          />
        </EditorWrapper>
        <ActionContainer>
          <ControlsWrapper>
            <RotateButton onClick={this.onRotateClick}>
              <RotateIcon />
              <InvisibleText>{t('modals.avatar_edit.rotate')}</InvisibleText>
            </RotateButton>
            <ScaleIcon />
            <RangeWrapper>
              <RangeFilledLine
                style={{ width: `calc(${filledAreaWidth * 100}% - ${filledAreaFix}px)` }}
              />
              <Range
                min={RANGE_MIN}
                max={RANGE_MAX}
                step={RANGE_STEP}
                value={scaleValue}
                onChange={this.onRangeChange}
              />
            </RangeWrapper>
            <ScaleIcon isBig />
          </ControlsWrapper>
          <Actions>
            <CancelButton onClick={this.onCloseClick}>{t('common.cancel')}</CancelButton>
            <SaveButtonStyled
              isChanged
              disabled={isUpdating}
              name="avatar-submit"
              onClick={this.onSaveClick}
            >
              {isUpdating ? <Loader /> : t('common.save')}
            </SaveButtonStyled>
          </Actions>
        </ActionContainer>
      </Wrapper>
    );
  }
}

export default AvatarEdit;
