import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Comment } from 'components/comment';

export default class CommentsList extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {
    const { order } = this.props;

    return (
      <>
        {order.map(id => (
          <Comment key={id} commentId={id} />
        ))}
      </>
    );
  }
}
