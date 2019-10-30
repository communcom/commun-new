import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { CircleLoader, up } from '@commun/ui';

import DropZone from 'components/common/DropZone';
import DropZoneOutline from 'components/common/DropZoneOutline';
import UploadButton from 'components/common/UploadButton';

const Wrapper = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 180px;
  z-index: 1;
  user-select: none;
  border-radius: 0px 0px 30px 30px;

  ${is('isAbsolute')`
    position: absolute;
    top: 0;
    left: 0;
  `};

  ${up.mobileLandscape} {
    border-radius: 6px 6px 30px 30px;
  }

  ${up.desktop} {
    height: 210px;
    min-height: 210px;
    border-radius: 6px 6px 0 0;
  }
`;

const SimpleImage = styled(Wrapper)`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: ${({ theme }) => theme.colors.blue};
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
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 0 0 30px 30px;

  ${is('isAbsolute')`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `};

  ${up.mobileLandscape} {
    border-radius: 6px 6px 30px 30px;
  }

  ${up.desktop} {
    border-radius: 6px 6px 0 0;
  }
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
    communityId: PropTypes.string,
    coverUrl: PropTypes.string,
    editable: PropTypes.bool,
    isAbsolute: PropTypes.bool,
    isDragAndDrop: PropTypes.bool.isRequired,
    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    communityId: null,
    coverUrl: null,
    isAbsolute: false,
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
    const { communityId, coverUrl, editable, isDragAndDrop, isAbsolute } = this.props;

    const style = {};

    if (coverUrl) {
      style.backgroundColor = 'unset';
      style.backgroundImage = `url("${coverUrl}")`;
    }

    if (editable) {
      return (
        <DropZone onlyImages onUpload={this.onUpload}>
          {({ getRootProps, getInputProps, isDragActive, isLoading }) => (
            <UploadWrapper {...getRootProps()} isAbsolute={isAbsolute}>
              <ProfileCover style={style} isAbsolute={isAbsolute} />
              <input
                {...getInputProps()}
                name={communityId ? 'community__cover-file-input' : 'profile__cover-file-input'}
              />
              <UploadButtonStyled />
              {isDragAndDrop ? <DropZoneOutline active={isDragActive} /> : null}
              {isLoading ? <CircleLoader isArc /> : null}
            </UploadWrapper>
          )}
        </DropZone>
      );
    }

    return <SimpleImage style={style} dragabble={false} isAbsolute={isAbsolute} />;
  }
}
