/* eslint-disable no-else-return,no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'ramda';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { theme, Panel, Switch } from '@commun/ui';

import { displayError } from 'utils/toastsMessages';
import SplashLoader from 'components/common/SplashLoader';

import SettingsItem from '../SettingsItem';

const SWITCHERS = [
  {
    type: 'upvote',
    label: 'Upvote',
    icon: {
      name: 'notif-upvote',
      color: theme.colors.blue,
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
    label: 'Reply',
    icon: {
      name: 'notif-reply',
      color: '#ff9a62',
      size: 16,
    },
  },
  {
    type: 'mention',
    label: 'Mention',
    icon: {
      name: 'notif-mention',
      color: '#62c6ff',
      size: 12,
    },
  },
  {
    type: 'subscribe',
    label: 'Subscribe',
    icon: {
      name: 'notif-subscribe',
      color: theme.colors.blue,
      size: 12,
    },
  },
  // {
  //   name: 'reward',
  //   label: 'Rewards for posts',
  //   icon: { name: 'post-rewards' },
  // },
  // {
  //   name: 'curatorReward',
  //   label: 'Rewards for votes',
  //   icon: { name: 'votes-rewards' },
  // },
];

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
`;

const IconStyled = styled(Icon)`
  display: block;
  color: #fff;
`;

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
    const { disabled, isLoaded } = this.state;

    return SWITCHERS.map(({ type, label, icon }) => (
      <SettingsItem
        key={type}
        label={label}
        icon={
          <IconWrapper style={{ backgroundColor: icon.color }}>
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
    const { isLoaded } = this.state;

    return (
      <Panel title="Online notifications">
        <Wrapper>
          {this.renderSwitchers()}
          {isLoaded ? null : <SplashLoader />}
        </Wrapper>
      </Panel>
    );
  }
}
