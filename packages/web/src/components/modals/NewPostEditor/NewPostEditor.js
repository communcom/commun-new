import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import PostForm from 'components/common/PostForm';

const Wrapper = styled.div`
  flex-basis: 500px;
  background-color: #fff;

  ${up.tablet} {
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
