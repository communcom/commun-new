import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Comment from '../Comment';

const Wrapper = styled.div``;

export default class CommentList extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoading: PropTypes.bool,
    inFeed: PropTypes.bool,
  };

  static defaultProps = {
    isLoading: false,
    inFeed: false,
  };

  render() {
    const { order, isLoading, inFeed } = this.props;

    if (order.length === 0 && !isLoading && !inFeed) {
      return <Wrapper>No comments yet</Wrapper>;
    }

    return (
      <>
        {order.map(id => (
          <Comment key={id} commentId={id} />
        ))}
      </>
    );
  }
}
