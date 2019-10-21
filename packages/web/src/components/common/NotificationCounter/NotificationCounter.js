import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';
import { Link } from 'shared/routes';
import NotificationsWindow from 'components/common/NotificationsWindow';

const NotificationsIcon = styled(Icon)`
  width: 24px;
  height: 24px;

  ${is('isActive')`
    color: ${({ theme }) => theme.colors.contextBlue};
  `};
`;

const NotificationsCount = styled.span`
  position: absolute;
  top: 5px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 24px;
  height: 20px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.errorTextRed};
  border: 2px solid #fff;
  border-radius: 50px;

  ${up.tablet} {
    top: 8px;
    right: auto;
    left: calc(100% - 28px);
  }
`;

export default class NotificationCounter extends PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    iconComponent: PropTypes.any.isRequired,
    freshCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool.isRequired,
    getNotificationsCount: PropTypes.func.isRequired,
  };

  state = {
    isOpen: false,
  };

  async componentDidMount() {
    const { getNotificationsCount } = this.props;

    try {
      await getNotificationsCount();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  openNotificationsHandler = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  onNeedClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { iconComponent, freshCount, isMobile } = this.props;
    const { isOpen } = this.state;

    const IconComponent = iconComponent;

    let notificationCounter = null;

    if (freshCount && freshCount > 0) {
      notificationCounter = (
        <NotificationsCount>{freshCount < 99 ? freshCount : '99+'}</NotificationsCount>
      );
    }

    if (isMobile) {
      return (
        <Link route="notifications" passHref>
          <IconComponent aria-label="Notifications" isLink>
            <NotificationsIcon name="notifications" />
            {notificationCounter}
          </IconComponent>
        </Link>
      );
    }

    return (
      <>
        <IconComponent
          name="notifications"
          aria-label="Notifications"
          onClick={this.openNotificationsHandler}
        >
          <NotificationsIcon name="notifications-desktop" isActive={isOpen} />
          {notificationCounter}
        </IconComponent>
        {isOpen ? <NotificationsWindow onNeedClose={this.onNeedClose} /> : null}
      </>
    );
  }
}
