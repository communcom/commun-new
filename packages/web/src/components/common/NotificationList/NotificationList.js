import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Notification from 'components/common/Notification';

const Wrapper = styled.ul`
  padding-bottom: 5px;
`;

const DateHeader = styled.li`
  padding: 0 15px;
  margin-bottom: 10px;
  line-height: 16px;
  font-size: 12px;
  font-weight: 600;
`;

const NotificationItem = styled.li`
  list-style: none;
`;

export default class NotificationList extends PureComponent {
  static propTypes = {
    orderWithDates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

  // eslint-disable-next-line class-methods-use-this
  renderDateIfNeeded(date, lastDate, dates) {
    let dateHeader = null;

    if (date !== lastDate) {
      switch (date) {
        case dates.today:
          dateHeader = 'Today';
          break;
        case dates.yesterday:
          dateHeader = 'Yesterday';
          break;
        default:
          dateHeader = date;
      }
    }

    if (!dateHeader) {
      return null;
    }

    return <DateHeader>{dateHeader}</DateHeader>;
  }

  render() {
    const { orderWithDates, className } = this.props;

    if (!orderWithDates.length) {
      return null;
    }

    const nowDate = new Date();
    const yesterdayDate = new Date(nowDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    let lastDate = null;

    const dates = {
      today: nowDate.toDateString(),
      yesterday: yesterdayDate.toDateString(),
    };

    return (
      <Wrapper className={className}>
        {orderWithDates.map(({ id, date }) => {
          lastDate = date;

          return (
            <Fragment key={id}>
              {this.renderDateIfNeeded(date, lastDate, dates)}
              <NotificationItem>
                <Notification notificationId={id} />
              </NotificationItem>
            </Fragment>
          );
        })}
      </Wrapper>
    );
  }
}
