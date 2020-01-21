import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Comment } from 'components/comment';

export default class CommentsList extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    inFeed: PropTypes.bool,
  };

  static defaultProps = {
    inFeed: false,
  };

  render() {
    const { order, inFeed } = this.props;

    return (
      <>
        {order.map(id => (
          <Comment key={id} commentId={id} inFeed={inFeed} />
        ))}
      </>
    );
  }
}
