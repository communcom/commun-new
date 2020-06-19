import React, { Component, createRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import PropTypes from 'prop-types';

import { InvisibleText, Loader } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { uploadImage } from 'utils/images/upload';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import { Actions } from 'components/modals/common';
import {
  ActionContainer,
  CancelButton,
  ControlsWrapper,
  editorStyles,
  EditorWrapper,
  Range,
  RANGE_MAX,
  RANGE_MIN,
  RANGE_STEP,
  RANGE_THUMB_SIZE,
  RangeFilledLine,
  RangeWrapper,
  ROTATE_STEP,
  RotateButton,
  RotateIcon,
  SaveButtonStyled,
  ScaleIcon,
} from 'components/modals/common/AvatarEdit.styled';
import { BackButton, Header, StepInfo, StepName, Wrapper } from '../common.styled';

@withTranslation()
export default class EditAvatar extends Component {
  static propTypes = {
    image: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,

    close: PropTypes.func.isRequired,
    goToStep: PropTypes.func.isRequired,
    updateProfileMeta: PropTypes.func.isRequired,
    onSelectImage: PropTypes.func.isRequired,
  };

  editorRef = createRef();

  state = {
    scaleValue: 1,
    rotateValue: 0,
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

  onCancelClick = () => {
    const { goToStep } = this.props;

    goToStep(0);
  };

  onCloseClick = () => {
    const { close } = this.props;

    close();
  };

  onSaveClick = async () => {
    const { goToStep, onSelectImage } = this.props;
    const editor = this.editorRef.current;

    if (editor) {
      try {
        this.setState({
          isUpdating: true,
        });

        editor.getImageScaledToCanvas().toBlob(async image => {
          const url = await uploadImage(image);

          if (!this.unmount && url) {
            onSelectImage(url);
            await this.updateAvatar(url);
            displaySuccess('Metadata updated');

            this.setState({
              isUpdating: false,
            });

            goToStep(0);
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
        size = 350;
      }
    }

    return size;
  }

  async updateAvatar(url) {
    const { updateProfileMeta } = this.props;

    await updateProfileMeta({
      avatarUrl: url,
    });
  }

  render() {
    const { image } = this.props;
    const { scaleValue, rotateValue, isUpdating } = this.state;
    const filledAreaWidth = scaleValue - 1;
    // фикс, чтобы полоса заполнения не перекрывала ползунок
    const filledAreaFix = RANGE_THUMB_SIZE * filledAreaWidth;

    return (
      <Wrapper>
        <Header>
          <BackButton onClick={this.onCancelClick} />
        </Header>
        <StepInfo>
          <StepName>Place photo</StepName>
        </StepInfo>
        <EditorWrapper>
          <AvatarEditor
            ref={this.editorRef}
            image={image}
            width={this.setEditorSize()}
            height={this.setEditorSize()}
            border={[10, 10]}
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
              <InvisibleText>Rotate photo</InvisibleText>
            </RotateButton>
            <ScaleIcon />
            <RangeWrapper>
              <RangeFilledLine
                style={{
                  width: `calc(${filledAreaWidth * 100}% - ${filledAreaFix}px)`,
                }}
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
            <CancelButton onClick={this.onCancelClick}>Cancel</CancelButton>
            <SaveButtonStyled
              isChanged
              disabled={isUpdating}
              name="avatar-submit"
              onClick={this.onSaveClick}
            >
              {isUpdating ? <Loader /> : 'Save'}
            </SaveButtonStyled>
          </Actions>
        </ActionContainer>
      </Wrapper>
    );
  }
}
