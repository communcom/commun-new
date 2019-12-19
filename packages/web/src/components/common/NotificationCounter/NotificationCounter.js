import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';
import { Link } from 'shared/routes';
import NotificationsWindow from 'components/common/NotificationsWindow';

const Action = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 5px;
  margin-right: 10px;
`;

const Button = styled(Action).attrs({ as: 'button', type: 'button' })``;

const ButtonInner = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const BellIcon = styled(Icon).attrs({ name: 'bell' })`
  width: 20px;
  height: 20px;

  ${is('isActive')`
    color: ${({ theme }) => theme.colors.blue};
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
    freshCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool.isRequired,
    // getNotificationsCount: PropTypes.func.isRequired,
  };

  state = {
    isOpen: false,
  };

  async componentDidMount() {
    /* TODO:
    const { getNotificationsCount } = this.props;

    try {
      await getNotificationsCount();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    */
  }

  toggleNotifications = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  onClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { freshCount, isMobile } = this.props;
    const { isOpen } = this.state;

    let notificationCounter = null;

    if (freshCount && freshCount > 0) {
      notificationCounter = (
        <NotificationsCount>{freshCount < 99 ? freshCount : '99+'}</NotificationsCount>
      );
    }

    if (isMobile) {
      return (
        <Link route="notifications" passHref>
          <Action title="Notifications">
            <ButtonInner>
              <BellIcon />
              {notificationCounter}
            </ButtonInner>
          </Action>
        </Link>
      );
    }

    return (
      <>
        <Button title="Notifications" onClick={this.toggleNotifications}>
          <ButtonInner>
            <BellIcon isActive={isOpen} />
            {notificationCounter}
          </ButtonInner>
        </Button>
        {isOpen ? <NotificationsWindow close={this.onClose} /> : null}
      </>
    );
  }
}
