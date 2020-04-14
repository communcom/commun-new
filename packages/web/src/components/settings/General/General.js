import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Panel, Dropdown } from '@commun/ui';
import { LOCALES } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

import SettingsItem from '../SettingsItem';

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

  onSelectLocale = value => {
    const { onChangeSettings } = this.props;
    const options = {
      basic: {
        locale: value,
      },
    };

    onChangeSettings(options);
  };

  onSelectNsfw = value => {
    const { onChangeSettings } = this.props;
    const options = {
      basic: {
        nsfw: value,
      },
    };

    onChangeSettings(options);
  };

  getLocaleSelect = () => {
    const { settings } = this.props;
    const locale = settings.locale || 'en';

    return (
      <Dropdown noBorder isCompact value={locale} items={LOCALES} onSelect={this.onSelectLocale} />
    );
  };

  getNsfwSelect = () => {
    const { t, settings } = this.props;
    const nsfw = settings.nsfw || 'warn';

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
        <SettingsItem
          label={t('components.settings.general.nsfw_content')}
          controlComponent={this.getNsfwSelect()}
        />
      </Panel>
    );
  }
}
