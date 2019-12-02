import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Comment from '../Comment';

export default class CommentsList extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    inFeed: PropTypes.bool,
    isModal: PropTypes.bool,
  };

  static defaultProps = {
    inFeed: false,
    isModal: false,
  };

  render() {
    const { order, inFeed, isModal } = this.props;

    return (
      <>
        {order.map(id => (
          <Comment key={id} commentId={id} inFeed={inFeed} isModal={isModal} />
        ))}
      </>
    );
  }
}
