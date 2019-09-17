import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { Icon } from '@commun/icons';
import Post from 'containers/post';
import { contentIdType } from 'types/common';
import { withRouter } from 'next/router';

const TopPanel = styled.div`
  display: block;
  background: #fff;

  ${up('tablet')} {
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
    hash: PropTypes.string,
    router: PropTypes.shape({}).isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    hash: null,
  };

  static async getInitialProps({ store, props }) {
    return Post.getInitialProps({ store, query: props.contentId });
  }

  componentDidMount() {
    const { contentId, hash, router } = this.props;

    const { userId, permlink } = contentId;

    const loc = window.location;

    this.backUrl = `${loc.pathname}${loc.search}${loc.hash}`;

    const postUrl = `/posts/${userId}/${permlink}${hash ? `#${hash}` : ''}`;

    window.history.pushState({}, null, postUrl);

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

  render() {
    const { contentId } = this.props;

    return (
      <div>
        <TopPanel>
          <BackButton aria-label="back" name="post-modal__back" onClick={this.onBackClick}>
            <BackIcon />
          </BackButton>
        </TopPanel>
        <Post contentId={contentId} isModal />
      </div>
    );
  }
}
