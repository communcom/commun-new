/* eslint-disable react/forbid-prop-types */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Notification from 'components/common/Notification';

const List = styled.ul``;

const NotificationItem = styled.li`
  list-style: none;
`;

export default class NotificationList extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isCompact: PropTypes.bool,
    wrapper: PropTypes.any,
  };

  static defaultProps = {
    isCompact: false,
    wrapper: null,
  };

  render() {
    const { order, isCompact, wrapper, ...props } = this.props;

    if (!order.length) {
      return null;
    }

    const ItemWrapper = wrapper || NotificationItem;

    return (
      <List {...props}>
        {order.map(id => (
          <ItemWrapper key={id}>
            <Notification isCompact={isCompact} notificationId={id} />
          </ItemWrapper>
        ))}
      </List>
    );
  }
}
