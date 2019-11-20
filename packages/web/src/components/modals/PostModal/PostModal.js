import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import { Icon } from '@commun/icons';
import Post from 'containers/post';
import { contentIdType, extendedPostType } from 'types/common';
import { withRouter } from 'next/router';

const TopPanel = styled.div`
  display: block;
  background: #fff;

  ${up.tablet} {
    display: none;
  }
`;

const BackButton = styled.button.attrs({ type: 'button' })``;

const BackIcon = styled(Icon).attrs({ name: 'back' })`
  width: 30px;
  height: 30px;
  padding: 4px;
  cursor: pointer;
`;

@withRouter
export default class PostModal extends PureComponent {
  static propTypes = {
    contentId: contentIdType.isRequired,
    post: extendedPostType.isRequired,
    hash: PropTypes.string,
    router: PropTypes.shape({}).isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
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
    const { contentId, post, hash } = this.props;
    const { permlink } = contentId;

    const loc = window.location;

    this.backUrl = `${loc.pathname}${loc.search}${loc.hash}`;

    const postUrl = `/${post.community.alias}/@${post.author.username}/${permlink}${
      hash ? `#${hash}` : ''
    }`;

    window.history.pushState({}, null, postUrl);
  }

  render() {
    const { contentId, hash } = this.props;

    return (
      <div>
        <TopPanel>
          <BackButton aria-label="back" name="post-modal__back" onClick={this.onBackClick}>
            <BackIcon />
          </BackButton>
        </TopPanel>
        <Post isModal contentId={contentId} commentId={hash} />
      </div>
    );
  }
}
