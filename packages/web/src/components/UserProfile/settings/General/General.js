import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { i18n } from 'shared/i18n';

import { Panel, Dropdown } from '@commun/ui';
import SettingsItem from '../SettingsItem';

const LOCALES = [{ value: 'en', label: 'English' }, { value: 'ru', label: 'Russian' }];

const NSFW = [
  { value: 'hide', label: 'Always hide' },
  { value: 'warn', label: 'Always alert' },
  { value: 'show', label: 'Always show' },
];

function pickExisting(list, values) {
  for (const value of values) {
    const found = list.find(item => item.value === value);

    if (found) {
      return found.value;
    }
  }

  return list[0].value;
}

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
    locale: pickExisting(LOCALES, [this.props.settings.locale, i18n.language, 'en']),
    nsfw: pickExisting(NSFW, [this.props.settings.nsfw, 'warn']),
    /* eslint-enable */
  };

  onSelectLocale = value => {
    const { onChangeSettings } = this.props;
    const options = {
      basic: {
        locale: value,
      },
    };

    this.setState({
      locale: value,
    });

    onChangeSettings(options);
  };

  onSelectNsfw = value => {
    const { onChangeSettings } = this.props;
    const options = {
      basic: {
        nsfw: value,
      },
    };

    this.setState({
      nsfw: value,
    });

    onChangeSettings(options);
  };

  getLocaleSelect = () => {
    const { locale } = this.state;

    return (
      <Dropdown noBorder isCompact value={locale} items={LOCALES} onSelect={this.onSelectLocale} />
    );
  };

  getNsfwSelect = () => {
    const { nsfw } = this.state;

    return <Dropdown noBorder isCompact value={nsfw} items={NSFW} onSelect={this.onSelectNsfw} />;
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
