import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import EmptyContentHolder, { NO_NOTIFICATIONS } from 'components/EmptyContentHolder';
import Notification from 'components/Notification';

const Wrapper = styled.section`
  margin-bottom: 20px;
  padding: 0 16px;
  background-color: #fff;

  ${up('tablet')} {
    border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
    border-radius: 4px;
  }
`;

const Header = styled.header`
  padding: 22px 0;

  ${up('tablet')} {
    padding: 18px 0;
  }
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  letter-spacing: -0.41px;
`;

export default class ProfileNotifications extends PureComponent {
  static propTypes = {
    accountOwner: PropTypes.string.isRequired,
    notificationsQuantity: PropTypes.number.isRequired,
    notificationsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  renderNotifications() {
    const { notificationsList, accountOwner } = this.props;

    return notificationsList.map(item => (
      <Notification
        key={item.type + item.created}
        notification={item}
        accountOwner={accountOwner}
      />
    ));
  }

  render() {
    const { notificationsQuantity } = this.props;

    if (!notificationsQuantity) {
      return <EmptyContentHolder type={NO_NOTIFICATIONS} />;
    }

    return (
      <Wrapper>
        <Header>
          <Title>{notificationsQuantity} Notifications</Title>
        </Header>
        {this.renderNotifications()}
      </Wrapper>
    );
  }
}
