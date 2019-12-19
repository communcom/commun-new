import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Notification from 'components/common/Notification/Notification';

const List = styled.ul``;

const DateHeader = styled.li`
  padding: 0 15px;
  margin-bottom: 10px;
  line-height: 16px;
  font-size: 12px;
  font-weight: 600;
`;

const NotificationItem = styled.li`
  list-style: none;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export default class NotificationList extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    orderWithDates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    isCompact: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    wrapper: PropTypes.any,
  };

  static defaultProps = {
    isCompact: false,
    wrapper: null,
  };

  render() {
    const { orderWithDates, isCompact, wrapper, ...props } = this.props;

    if (!orderWithDates.length) {
      return null;
    }

    const ItemWrapper = wrapper || NotificationItem;

    const nowDate = new Date();
    const todayDate = nowDate.toDateString();
    nowDate.setDate(nowDate.getDate() - 1);
    const yesterdayDate = nowDate.toDateString();
    let lastDate = null;

    return (
      <List {...props}>
        {orderWithDates.map(({ id, date }) => {
          let dateHeader = null;

          if (date !== lastDate) {
            switch (date) {
              case todayDate:
                dateHeader = 'Today';
                break;
              case yesterdayDate:
                dateHeader = 'Yesterday';
                break;
              default:
                dateHeader = date;
            }
          }

          lastDate = date;

          return (
            <Fragment key={id}>
              {dateHeader ? <DateHeader>{dateHeader}</DateHeader> : null}
              <ItemWrapper>
                <Notification isCompact={isCompact} notificationId={id} />
              </ItemWrapper>
            </Fragment>
          );
        })}
      </List>
    );
  }
}
