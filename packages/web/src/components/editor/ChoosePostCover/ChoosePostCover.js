import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNot } from 'styled-is';

import { Loader } from '@commun/ui';
import { Icon } from '@commun/icons';
import { ARTICLE_COVER_ASPECT_RATION } from 'shared/constants';
import { validateImageFile, uploadImage } from 'utils/images/upload';

const Wrapper = styled.div`
  position: relative;
  padding-bottom: ${ARTICLE_COVER_ASPECT_RATION}%;
`;

const CoverContainer = styled.form`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  overflow: hidden;

  ${isNot('isShowImage')`
    background: ${({ theme }) => theme.colors.lightGrayBlue};
  `};
`;

const CoverImg = styled.img`
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2px;
`;

const CameraPic = styled.div`
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
  background: url('/images/camera.svg');
`;

const Text = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const SelectFile = styled.span`
  position: relative;
  color: ${({ theme }) => theme.colors.blue};
`;

const FileInput = styled.input.attrs({ type: 'file' })`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 1000px;
  opacity: 0;
  cursor: pointer;
`;

const DropHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed ${({ theme }) => theme.colors.blue};
  border-radius: 10px;
  user-select: none;
  pointer-events: none;
`;

const LoaderStyled = styled(Loader)`
  & > svg {
    width: 48px;
    height: 48px;
  }
`;

const ClearButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 15px;
  right: 15px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #000;
`;

const CrossIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 14px;
  height: 14px;
  color: #fff;
`;

export default class ChoosePostCover extends PureComponent {
  static propTypes = {
    coverUrl: PropTypes.string,
    isDragAndDrop: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    coverUrl: null,
  };

  inputRef = createRef();

  state = {
    isDragOver: false,
    isUploading: false,
  };

  componentWillReceiveProps(nextProps) {
    const { isDragOver } = this.state;

    if (isDragOver && !nextProps.isDragAndDrop) {
      this.setState({
        isDragOver: false,
      });
    }
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  onDragEnter = () => {
    this.setState({
      isDragOver: true,
    });
  };

  onDragLeave = () => {
    this.setState({
      isDragOver: false,
    });
  };

  onUpload = async e => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (validateImageFile(file)) {
      this.setState({
        isUploading: true,
      });

      const url = await uploadImage(file);

      if (this.unmount) {
        return;
      }

      if (url) {
        const { onChange } = this.props;

        this.setState({
          isUploading: false,
        });

        onChange(url);
      } else {
        this.setState({
          isUploading: false,
        });
      }
    }
  };

  onClearClick = () => {
    const { onChange } = this.props;

    this.inputRef.current.value = '';

    onChange(null);
  };

  render() {
    const { coverUrl, isDragAndDrop, className } = this.props;
    const { isUploading, isDragOver } = this.state;

    const isShowImage = !isDragOver && coverUrl;

    let innerContent = null;

    if (isUploading) {
      innerContent = <LoaderStyled />;
    } else if (isDragOver || !coverUrl) {
      innerContent = (
        <EmptyContent>
          <CameraPic />
          <Text>
            {isDragOver ? (
              'Release the mouse button to set image'
            ) : (
              <>
                <SelectFile>Select the file</SelectFile> or drag it here
              </>
            )}
          </Text>
        </EmptyContent>
      );
    }

    return (
      <Wrapper className={className}>
        <CoverContainer
          isShowImage={isShowImage}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
        >
          {isShowImage ? <CoverImg src={coverUrl} /> : null}
          <InputLabel>
            {innerContent}
            <FileInput ref={this.inputRef} onChange={this.onUpload} />
            {isDragAndDrop ? <DropHighlight /> : null}
          </InputLabel>
          {isShowImage ? (
            <ClearButton title="Clear image" onClick={this.onClearClick}>
              <CrossIcon />
            </ClearButton>
          ) : null}
        </CoverContainer>
      </Wrapper>
    );
  }
}
