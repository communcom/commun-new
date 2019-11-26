import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Panel, Switch } from '@commun/ui';
import SettingsItem from './SettingsItem';

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.gray};

  ${is('isReversed')`
    transform: rotate(180deg);
  `};
`;

export default class Notifications extends PureComponent {
  static propTypes = {
    settings: PropTypes.shape({}).isRequired,
    onChangeSettings: PropTypes.func.isRequired,
  };

  renderSwitchers = () => {
    const { settings: values } = this.props;
    const switchers = [
      {
        name: 'upvote',
        label: 'Upvote',
        icon: { name: 'long-arrow', isReversed: true },
      },
      {
        name: 'downvote',
        label: 'Downvote',
        icon: { name: 'long-arrow' },
      },
      {
        name: 'transfer',
        label: 'Points transfer',
        icon: { name: 'transfer-points' },
      },
      {
        name: 'reply',
        label: 'Comment and reply',
        icon: { name: 'chat' },
      },
      {
        name: 'mention',
        label: 'Mention',
        icon: { name: 'notifications' },
      },
      {
        name: 'reward',
        label: 'Rewards for posts',
        icon: { name: 'post-rewards' },
      },
      {
        name: 'curatorReward',
        label: 'Rewards for votes',
        icon: { name: 'votes-rewards' },
      },
    ];

    return switchers.map(({ name, label, icon }) => (
      <SettingsItem
        key={name}
        label={label}
        icon={<IconStyled {...icon} />}
        controlComponent={
          <Switch
            name={`settings__notify-${name}`}
            value={values[name]}
            onChange={this.handleSwitchChange(name)}
          />
        }
      />
    ));
  };

  handleSwitchChange = name => value => {
    const { onChangeSettings } = this.props;
    const options = {
      notify: {
        show: {
          [name]: value,
        },
      },
    };

    onChangeSettings(options);
  };

  render() {
    return <Panel title="Notifications">{this.renderSwitchers()}</Panel>;
  }
}
