import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { styles, up } from '@commun/ui';

import { contentIdType } from 'types/common';

import Post from 'containers/post';
import PostForm from 'components/common/PostForm';

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.white};

  position: fixed;
  top: 64px;
  bottom: 0;
  width: 100%;
  margin-bottom: 0;
  z-index: 105;

  ${styles.breakWord};

  ${up.tablet} {
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 4px;
    position: relative;
    top: auto;
    bottom: auto;
    max-width: 502px;
    margin-bottom: 8px;
  }
`;

export default class PostEditModal extends PureComponent {
  static propTypes = {
    contentId: contentIdType.isRequired,
    close: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, props }) {
    const { contentId } = props;
    return Post.getInitialProps({ store, contentId });
  }

  render() {
    const { contentId, close } = this.props;

    return (
      <Wrapper>
        <PostForm contentId={contentId} isEdit onClose={close} />
      </Wrapper>
    );
  }
}
