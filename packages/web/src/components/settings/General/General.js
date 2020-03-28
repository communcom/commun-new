import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Panel, Dropdown } from '@commun/ui';
import { LOCALES } from 'shared/constants';
import { i18n, withTranslation } from 'shared/i18n';

import SettingsItem from '../SettingsItem';

function pickExisting(list, values) {
  for (const value of values) {
    const found = list.find(item => item.value === value);

    if (found) {
      return found.value;
    }
  }

  return list[0].value;
}

const NSFW = [{ value: 'hide' }, { value: 'warn' }, { value: 'show' }];

@withTranslation()
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
    const { t } = this.props;
    const { nsfw } = this.state;

    const NSFW_FULL = NSFW.map(({ value }) => ({
      value,
      label: t(`components.settings.general.nsfw.${value}`),
    }));

    return (
      <Dropdown noBorder isCompact value={nsfw} items={NSFW_FULL} onSelect={this.onSelectNsfw} />
    );
  };

  render() {
    const { t } = this.props;

    return (
      <Panel title={t('components.settings.general.title')}>
        <SettingsItem
          label={t('components.settings.general.language')}
          controlComponent={this.getLocaleSelect()}
        />
        {/* <SettingsItem label="NSFW content" controlComponent={this.getNsfwSelect()} /> */}
      </Panel>
    );
  }
}
