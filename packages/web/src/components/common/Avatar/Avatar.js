import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

import { Link } from 'shared/routes';
import { proxifyImageUrl } from 'utils/images/proxy';

const AVATAR_SIZE = 40;

const ImgContainer = styled.div`
  display: inline-block;
  flex-shrink: 0;
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  border-radius: 50%;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-position: center;
  object-fit: cover;
  /* for cases when we have image with transparent parts */
  background-color: ${({ theme }) => theme.colors.white};
`;

const AvatarPlaceholder = styled(Icon).attrs({ name: 'avatar' })`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  color: ${({ theme }) => theme.colors.lightGray};
  background-color: ${({ theme }) => theme.colors.white};

  ${is('isBlack')`
    color: ${({ theme }) => theme.colors.black};
  `};
`;

export default class Avatar extends PureComponent {
  static propTypes = {
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
    isBlack: PropTypes.bool,
    useLink: PropTypes.bool,
    route: PropTypes.string,
    routeParams: PropTypes.shape({}),
  };

  static defaultProps = {
    avatarUrl: null,
    name: null,
    isBlack: false,
    useLink: false,
    route: null,
    routeParams: null,
  };

  state = {
    hideImage: false,
  };

  onImageError = () => {
    this.setState({
      hideImage: true,
    });
  };

  render() {
    const { avatarUrl, name, isBlack, useLink, route, routeParams, className } = this.props;
    const { hideImage } = this.state;

    const isWrapInLink = useLink && route;
    const avatar =
      !hideImage && avatarUrl && avatarUrl !== 'none'
        ? proxifyImageUrl(avatarUrl, { size: 100 })
        : null;

    const img = (
      <ImgContainer as={isWrapInLink ? 'a' : 'div'} className={className}>
        {avatar ? (
          <AvatarImage
            src={avatar}
            alt={name ? `${name}'s avatar` : null}
            draggable={false}
            onError={this.onImageError}
          />
        ) : (
          <AvatarPlaceholder
            isBlack={isBlack}
            aria-label={name ? `${name}'s avatar placeholder` : null}
          />
        )}
      </ImgContainer>
    );

    if (isWrapInLink) {
      return (
        <Link route={route} params={routeParams} passHref>
          {img}
        </Link>
      );
    }

    return img;
  }
}
