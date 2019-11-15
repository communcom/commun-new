import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import AvatarEditor from 'react-avatar-editor';

import { InvisibleText, Loader, up } from '@commun/ui';
import { Icon } from '@commun/icons';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { uploadImage } from 'utils/uploadImage';

import {
  Wrapper,
  DescriptionHeader,
  ModalName,
  Actions,
  SaveButton,
  ResetButton,
  CloseButtonStyled,
  BackButton,
} from '../common/DescriptionModal.styled';

const RANGE_MIN = 1;
const RANGE_MAX = 2;
const RANGE_STEP = 0.05;
const ROTATE_STEP = 90;
const MOZ_RANGE_THUMB_SIZE = 13;
const WEBKIT_RANGE_THUMB_SIZE = 15;
const RANGE_THUMB_SIZE = 15;

const EditorWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 50px;
  background-color: #000;
  overflow: hidden;

  ${up.tablet} {
    margin-bottom: 20px;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  padding: 9px 0 8px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.gray};

  ${up.tablet} {
    margin-bottom: 0;
    padding-right: 20px;
  }
`;

const RangeWrapper = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  height: 15px;
  margin: 0 10px;

  /* styles for firefox and webkit should be splitted! */
  input[type='range']::-webkit-slider-container {
    display: flex;
    align-items: center;
  }

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    width: ${WEBKIT_RANGE_THUMB_SIZE}px;
    height: ${WEBKIT_RANGE_THUMB_SIZE}px;
    border: 1px solid ${({ theme }) => theme.colors.blue};
    border-radius: 100%;
    background-color: #fff;
    transform: translateY(-50%);
    cursor: pointer;
  }

  input[type='range']::-moz-range-track {
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: pointer;
  }

  input[type='range']::-moz-range-thumb {
    appearance: none;
    width: ${MOZ_RANGE_THUMB_SIZE}px;
    height: ${MOZ_RANGE_THUMB_SIZE}px;
    border: 1px solid ${({ theme }) => theme.colors.blue};
    border-radius: 100%;
    background-color: #fff;
    cursor: pointer;
  }

  input[type='range']:focus {
    outline: none !important;
  }

  input[type='range']:focus::-webkit-slider-runnable-track {
    background-color: none !important;
  }
`;

const RangeFilledLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  content: '';
  display: block;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.blue};
  transform: translateY(-100%);
`;

const Range = styled.input.attrs({ type: 'range' })`
  width: 100%;
`;

const ScaleIcon = styled(Icon).attrs({ name: 'mountains' })`
  width: 12px;
  height: 8px;

  ${is('isBig')`
    width: 17px;
    height: 12px;
  `};
`;

const RotateIcon = styled(Icon).attrs({ name: 'transfer-points' })`
  width: 20px;
  height: 20px;
  transform: rotate(45deg);
`;

const RotateButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  margin-right: 12px;
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 100%;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const SaveButtonStyled = styled(SaveButton)`
  width: 100%;

  ${up.tablet} {
    width: auto;
    min-width: 80px;
    height: 34px;
    padding: 0px;
  }
`;

const CancelButton = styled(ResetButton)`
  ${up.tablet} {
    width: auto;
    min-width: 80px;
    height: 34px;
    padding: 10px;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;

  ${up.tablet} {
    flex-direction: row;
    justify-content: flex-start;
  }
`;

// Styled wrapper doesn't work for AvatarEditor
const editorStyles = { margin: '-5px 0' };

class AvatarEdit extends Component {
  static propTypes = {
    image: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    fileInputRef: PropTypes.shape({}).isRequired,

    close: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
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

  onCloseClick = () => {
    const { close, fileInputRef } = this.props;
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
    close();
  };

  onSaveClick = async () => {
    const { fileInputRef, onUpdate, close } = this.props;
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
            displaySuccess('Metadata updated');

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
    const { image } = this.props;
    const { scaleValue, rotateValue, isUpdating } = this.state;
    const filledAreaWidth = scaleValue - 1;
    // фикс, чтобы полоса заполнения не перекрывала ползунок
    const filledAreaFix = RANGE_THUMB_SIZE * filledAreaWidth;

    return (
      <Wrapper>
        <DescriptionHeader>
          <BackButton onClick={this.onCloseClick} />
          <ModalName>Change position</ModalName>
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
              <InvisibleText>Rotate photo</InvisibleText>
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
            <CancelButton onClick={this.onCloseClick}>Cancel</CancelButton>
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

export default AvatarEdit;
