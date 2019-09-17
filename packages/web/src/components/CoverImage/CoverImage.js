import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { CircleLoader } from '@commun/ui';

import DropZone from 'components/DropZone';
import DropZoneOutline from 'components/DropZoneOutline';
import UploadButton from 'components/UploadButton';

const Wrapper = styled.div`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 124px;
  z-index: 1;
  user-select: none;

  ${up('desktop')} {
    height: 202px;
  }
`;

const SimpleImage = styled(Wrapper)`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const UploadWrapper = styled(Wrapper)`
  cursor: pointer;

  &:hover::after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(150, 150, 150, 0.2);
  }
`;

const ProfileCover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const UploadButtonStyled = styled(UploadButton)`
  right: 16px;
  bottom: 16px;
  background: rgba(0, 0, 0, 0.5);

  & svg {
    color: #fff;
  }
`;

export default class CoverImage extends PureComponent {
  static propTypes = {
    coverUrl: PropTypes.string,
    editable: PropTypes.bool,
    isCommunity: PropTypes.bool,
    isDragAndDrop: PropTypes.bool.isRequired,
    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    coverUrl: null,
    isCommunity: false,
    editable: false,
    onUpdate: null,
  };

  onUpload = async url => {
    const { onUpdate } = this.props;

    if (onUpdate) {
      await onUpdate(url);
    }
  };

  render() {
    const { coverUrl, editable, isDragAndDrop, isCommunity } = this.props;

    let imageUrl = coverUrl;

    if (!imageUrl) {
      imageUrl = editable ? 'https://i.imgur.com/vUdyTuE.jpg' : 'https://i.imgur.com/5Swt6h6.jpg';

      if (isCommunity) {
        imageUrl = 'https://i.imgur.com/Jrp7VX5.jpg';
      }
    }

    const style = {
      backgroundImage: `url("${imageUrl}")`,
    };

    if (editable) {
      return (
        <DropZone onlyImages onUpload={this.onUpload}>
          {({ getRootProps, getInputProps, isDragActive, isLoading }) => (
            <UploadWrapper {...getRootProps()}>
              <ProfileCover style={style} />
              <input
                {...getInputProps()}
                name={isCommunity ? 'community__cover-file-input' : 'profile__cover-file-input'}
              />
              <UploadButtonStyled />
              {isDragAndDrop ? <DropZoneOutline active={isDragActive} /> : null}
              {isLoading ? <CircleLoader isArc /> : null}
            </UploadWrapper>
          )}
        </DropZone>
      );
    }

    return <SimpleImage style={style} dragabble={false} />;
  }
}
