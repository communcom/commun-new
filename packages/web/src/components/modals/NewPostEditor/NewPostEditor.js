import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import PostForm from 'components/common/PostForm';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: #fff;

  ${up.mobileLandscape} {
    position: relative;
    top: unset;
    bottom: unset;
    left: unset;
    right: unset;
    flex-basis: 500px;
    border-radius: 6px;
  }
`;

export default class NewPostEditor extends PureComponent {
  static propTypes = {
    withPhoto: PropTypes.bool,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    withPhoto: false,
  };

  render() {
    const { withPhoto, close } = this.props;

    return (
      <Wrapper>
        <PostForm isChoosePhoto={withPhoto} onClose={close} />
      </Wrapper>
    );
  }
}
