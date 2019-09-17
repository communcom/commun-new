import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { CircleLoader } from '@commun/ui';

import DropZone from 'components/DropZone';
import Avatar from 'components/Avatar';
import DropZoneOutline from 'components/DropZoneOutline';
import UploadButton from 'components/UploadButton';

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

  &:hover ${UploadWrapper}::after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(150, 150, 150, 0.2);
  }

  &:hover ${UploadButton} {
    color: #333;
  }
`;

export default class CoverAvatar extends PureComponent {
  static propTypes = {
    entityId: PropTypes.string.isRequired,
    editable: PropTypes.bool,
    isCommunity: PropTypes.bool,
    isDragAndDrop: PropTypes.bool.isRequired,
    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    editable: false,
    isCommunity: false,
    onUpdate: null,
  };

  state = {};

  onUpload = async url => {
    const { onUpdate } = this.props;

    if (onUpdate) {
      await onUpdate(url);
    }
  };

  render() {
    const { entityId, isCommunity, isDragAndDrop, editable, className } = this.props;

    if (editable) {
      return (
        <DropZone onlyImages onUpload={this.onUpload}>
          {({ getRootProps, getInputProps, isDragActive, isLoading }) => {
            const rootProps = getRootProps();
            const inputProps = getInputProps();

            return (
              <Wrapper className={className} {...rootProps}>
                <UploadWrapper>
                  {isCommunity ? (
                    <AvatarStyled communityId={entityId} />
                  ) : (
                    <AvatarStyled userId={entityId} />
                  )}
                  <input
                    {...inputProps}
                    name={
                      isCommunity ? 'community__avatar-file-input' : 'profile__avatar-file-input'
                    }
                  />
                  {isDragAndDrop ? <DropZoneOutline active={isDragActive} round /> : null}
                  {isLoading ? <CircleLoader isArc /> : null}
                </UploadWrapper>
                <UploadButton />
              </Wrapper>
            );
          }}
        </DropZone>
      );
    }

    return isCommunity ? (
      <Avatar communityId={entityId} className={className} />
    ) : (
      <Avatar userId={entityId} className={className} />
    );
  }
}
