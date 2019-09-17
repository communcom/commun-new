import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { i18n } from 'shared/i18n';

import { Panel, Dropdown } from '@commun/ui';
import SettingsItem from '../SettingsItem';

const LOCALES = [
  {
    value: 'en',
    label: 'English',
  },
  { value: 'ru', label: 'Russian' },
];

const NSFW = [
  {
    value: 'hide',
    label: 'Always hide',
  },
  { value: 'warn', label: 'Always alert' },
  { value: 'show', label: 'Always show' },
];

export default class General extends PureComponent {
  static propTypes = {
    settings: PropTypes.shape({
      locale: PropTypes.string,
      nsfw: PropTypes.string,
    }).isRequired,

    onChangeSettings: PropTypes.func.isRequired,
  };

  state = {
    /* eslint-disable react/destructuring-assignment */
    localeSelectedItem:
      LOCALES.find(item => item.value === this.props.settings.locale) ||
      LOCALES.find(item => item.value === i18n.language) ||
      LOCALES[0],
    nsfwSelectedItem: NSFW.find(item => item.value === this.props.settings.nsfw) || NSFW[1],
    /* eslint-enable */
    isLocaleSelectOpen: false,
    isNsfwSelectOpen: false,
  };

  onSelectLocale = item => {
    const { onChangeSettings } = this.props;
    const options = {
      basic: {
        locale: item.value,
      },
    };
    onChangeSettings(options);
  };

  onSelectNsfw = item => {
    const { onChangeSettings } = this.props;
    const options = {
      basic: {
        nsfw: item.value,
      },
    };
    onChangeSettings(options);
  };

  getLocaleSelect = () => {
    const { isLocaleSelectOpen, localeSelectedItem } = this.state;

    return (
      <Dropdown
        noBorder
        isCompact
        selectedItem={localeSelectedItem}
        isOpen={isLocaleSelectOpen}
        items={LOCALES}
        onSelect={this.onSelectLocale}
      />
    );
  };

  getNsfwSelect = () => {
    const { isNsfwSelectOpen, nsfwSelectedItem } = this.state;

    return (
      <Dropdown
        noBorder
        isCompact
        selectedItem={nsfwSelectedItem}
        isOpen={isNsfwSelectOpen}
        items={NSFW}
        onSelect={this.onSelectNsfw}
      />
    );
  };

  render() {
    return (
      <Panel title="General">
        <SettingsItem label="Interface language" controlComponent={this.getLocaleSelect()} />
        <SettingsItem label="NSFW content" controlComponent={this.getNsfwSelect()} />
      </Panel>
    );
  }
}
