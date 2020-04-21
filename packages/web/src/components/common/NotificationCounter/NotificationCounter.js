import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { up, styles } from '@commun/ui';
import { Icon } from '@commun/icons';
import { Link } from 'shared/routes';
import { withTranslation } from 'shared/i18n';

import NotificationsWindow from 'components/common/NotificationsWindow';

const Action = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 5px;
  margin-right: 10px;
`;

const Button = styled(Action).attrs({ as: 'button', type: 'button' })`
  position: relative;

  &:hover,
  &:focus {
    ${styles.withBottomTooltip};
  }
`;

const ButtonInner = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #000;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const BellIcon = styled(Icon).attrs({ name: 'bell' })`
  width: 20px;
  height: 20px;

  ${is('isActive')`
    color: ${({ theme }) => theme.colors.blue};
  `};
`;

const UnseenMark = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  border: 1px solid #fff;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.errorTextRed};
`;

const NotificationsCount = styled.span`
  position: absolute;
  top: 5px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  font-size: 9px;
  font-weight: bold;
  line-height: 20px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.errorTextRed};
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 50px;

  ${up.tablet} {
    top: -6px;
    right: calc(100% - 12px);
    left: auto;
  }
`;

@withTranslation()
export default class NotificationCounter extends PureComponent {
  static propTypes = {
    unseenCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool.isRequired,
  };

  state = {
    isOpen: false,
  };

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
    const { unseenCount, isMobile, t } = this.props;
    const { isOpen } = this.state;

    let notificationMark = null;

    if (unseenCount) {
      if (unseenCount > 99) {
        notificationMark = <UnseenMark />;
      } else {
        notificationMark = <NotificationsCount>{unseenCount}</NotificationsCount>;
      }
    }

    if (isMobile) {
      return (
        <Link route="notifications" passHref>
          <Action title={t('components.notification_counter.title')}>
            <ButtonInner>
              <BellIcon />
              {notificationMark}
            </ButtonInner>
          </Action>
        </Link>
      );
    }

    return (
      <>
        <Button
          aria-label={t('components.notification_counter.title')}
          onClick={this.toggleNotifications}
        >
          <ButtonInner>
            <BellIcon isActive={isOpen} />
            {notificationMark}
          </ButtonInner>
        </Button>
        {isOpen ? <NotificationsWindow close={this.onClose} /> : null}
      </>
    );
  }
}
