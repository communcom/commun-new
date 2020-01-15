import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import { Icon } from '@commun/icons';
import Post from 'containers/post';
import { contentIdType, extendedPostType } from 'types/common';
import { withRouter } from 'next/router';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  min-height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  min-height: calc(var(--vh, 1vh) * 100);

  ${up.tablet} {
    width: 670px;
    min-height: unset;
  }
`;

const BackButton = styled.button.attrs({ type: 'button' })`
  position: fixed;
  top: 18px;
  left: 15px;
  display: flex;
  align-items: center;
  padding: 5px 10px 5px 0;
  z-index: 20;
  color: ${({ theme }) => theme.colors.gray};

  ${up.tablet} {
    display: none;
  }
`;

const BackIcon = styled(Icon).attrs({ name: 'back' })`
  width: 11px;
  height: 18px;
`;

@withRouter
export default class PostModal extends PureComponent {
  static propTypes = {
    currentUserId: PropTypes.string,
    contentId: contentIdType.isRequired,
    post: extendedPostType.isRequired,
    hash: PropTypes.string,
    router: PropTypes.shape({}).isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUserId: null,
    hash: null,
  };

  static async getInitialProps({ store, props }) {
    return Post.getInitialProps({ store, contentId: props.contentId });
  }

  componentDidMount() {
    const { router } = this.props;

    this.actualizeUrl();

    router.events.on('routeChangeComplete', this.onRouteChange);
  }

  componentWillUnmount() {
    const { router } = this.props;

    router.events.off('routeChangeComplete', this.onRouteChange);

    if (!this.isCloseOnRouting) {
      window.history.pushState({}, null, this.backUrl);
    }
  }

  onBackClick = () => {
    this.closeModal();
  };

  onRouteChange = () => {
    this.isCloseOnRouting = true;
    this.closeModal();
  };

  closeModal = () => {
    const { close } = this.props;
    close();
  };

  actualizeUrl() {
    const { contentId, currentUserId, post, hash } = this.props;
    const { permlink } = contentId;

    const loc = window.location;

    this.backUrl = `${loc.pathname}${loc.search}${loc.hash}`;

    const postUrl = `/${post.community.alias}/@${post.author.username}/${permlink}${
      currentUserId ? `?invite=${currentUserId}` : ''
    }${hash ? `#${hash}` : ''}`;

    window.history.pushState({}, null, postUrl);
  }

  render() {
    const { contentId, hash } = this.props;

    return (
      <Wrapper>
        <BackButton aria-label="back" name="post-modal__back" onClick={this.onBackClick}>
          <BackIcon />
        </BackButton>
        <Post isModal contentId={contentId} commentId={hash} close={this.closeModal} />
      </Wrapper>
    );
  }
}
