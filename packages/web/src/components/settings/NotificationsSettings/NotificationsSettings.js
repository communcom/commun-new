/* eslint-disable no-else-return,no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'ramda';
import styled from 'styled-components';
import by from 'styled-by';

import { Icon } from '@commun/icons';
import { Panel, Switch } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { displayError } from 'utils/toastsMessages';
import SplashLoader from 'components/common/SplashLoader';

import SettingsItem from '../SettingsItem';

const Wrapper = styled.div`
  position: relative;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.blue};

  ${by('type', {
    reply: `background-color: #ff9a62;`,
    mention: `background-color: #62c6ff;`,
  })}
`;

const IconStyled = styled(Icon)`
  display: block;
  color: #fff;
`;

const SWITCHERS = [
  {
    type: 'upvote',
    labelLocalKey: 'upvote',
    icon: {
      name: 'notif-upvote',
      size: 14,
    },
  },
  // {
  //   name: 'transfer',
  //   label: 'Points transfer',
  //   icon: { name: 'transfer-points' },
  // },
  {
    type: 'reply',
    labelLocalKey: 'reply',
    icon: {
      name: 'notif-reply',
      size: 16,
    },
  },
  {
    type: 'mention',
    labelLocalKey: 'mention',
    icon: {
      name: 'notif-mention',
      size: 12,
    },
  },
  {
    type: 'subscribe',
    labelLocalKey: 'subscribe',
    icon: {
      name: 'notif-subscribe',
      size: 12,
    },
  },
  {
    type: 'reward',
    labelLocalKey: 'rewards',
    icon: {
      name: 'notif-reward',
      size: 12,
    },
  },
  {
    type: 'transfer',
    labelLocalKey: 'transfers',
    icon: {
      name: 'arrow-convert',
      size: 16,
    },
  },
];

@withTranslation()
export default class NotificationsSettings extends PureComponent {
  static propTypes = {
    getNotificationsSettings: PropTypes.func.isRequired,
    setNotificationsSettings: PropTypes.func.isRequired,
  };

  state = {
    disabled: null,
    isLoaded: false,
  };

  async componentDidMount() {
    const { getNotificationsSettings } = this.props;

    try {
      const { disabled } = await getNotificationsSettings();

      this.setState({
        disabled,
        isLoaded: true,
      });
    } catch (err) {
      displayError("Can't load notifications settings:", err);
    }
  }

  handleSwitchChange = async (name, checked) => {
    const { setNotificationsSettings } = this.props;
    const { disabled } = this.state;

    const prevChecked = !disabled.includes(name);

    const updated = this.toggle(name, checked);

    this.setState({
      disabled: updated,
    });

    try {
      await setNotificationsSettings({ disable: updated });
    } catch (err) {
      displayError("Can't update notifications settings:", err);

      this.setState({
        disabled: this.toggle(name, prevChecked),
      });
    }
  };

  toggle(name, checked) {
    const { disabled } = this.state;

    if (checked) {
      return disabled.filter(type => type !== name);
    } else {
      return uniq(disabled.concat(name));
    }
  }

  renderSwitchers() {
    const { t } = this.props;
    const { disabled, isLoaded } = this.state;

    return SWITCHERS.map(({ type, labelLocalKey, icon }) => (
      <SettingsItem
        key={type}
        label={t(`components.settings.notifications_settings.switchers.${labelLocalKey}`)}
        icon={
          <IconWrapper type={type}>
            <IconStyled name={icon.name} size={icon.size} />
          </IconWrapper>
        }
        controlComponent={
          isLoaded ? (
            <Switch
              name={`settings__notify-${type}`}
              value={!disabled.includes(type)}
              onChange={checked => this.handleSwitchChange(type, checked)}
            />
          ) : (
            <span />
          )
        }
      />
    ));
  }

  render() {
    const { t } = this.props;
    const { isLoaded } = this.state;

    return (
      <Panel title={t('components.settings.notifications_settings.title')}>
        <Wrapper>
          {this.renderSwitchers()}
          {isLoaded ? null : <SplashLoader />}
        </Wrapper>
      </Panel>
    );
  }
}
