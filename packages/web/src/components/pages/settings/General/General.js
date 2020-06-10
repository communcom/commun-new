import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Panel, Dropdown, Switch } from '@commun/ui';
import { LOCALES } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { FEATURE_POST_FEED_COMMENTS } from 'shared/featureFlags';

import SettingsItem from '../SettingsItem';

const NSFW = [{ value: 'hide' }, { value: 'warn' }, { value: 'show' }];
const THEME = [{ value: 'light' }, { value: 'system' }, { value: 'dark' }];

@withTranslation()
export default class General extends PureComponent {
  static propTypes = {
    settings: PropTypes.shape({
      locale: PropTypes.string,
      nsfw: PropTypes.string,
      theme: PropTypes.string,
      isShowCommentsInFeed: PropTypes.bool,
      isHideEmptyBalances: PropTypes.bool,
    }).isRequired,
    featureFlags: PropTypes.object.isRequired,

    onChangeSettings: PropTypes.func.isRequired,
  };

  onChange = property => value => {
    const { onChangeSettings } = this.props;
    const options = {
      basic: {
        [property]: value,
      },
    };

    onChangeSettings(options);
  };

  getLocaleSelect = () => {
    const { settings } = this.props;
    const locale = settings.locale || LOCALES[0].value;

    return (
      <Dropdown
        noBorder
        isCompact
        value={locale}
        items={LOCALES}
        onSelect={this.onChange('locale')}
      />
    );
  };

  getNsfwSelect = () => {
    const { t, settings } = this.props;
    const nsfw = settings.nsfw || NSFW[0].value;

    const NSFW_FULL = NSFW.map(({ value }) => ({
      value,
      label: t(`components.settings.general.nsfw_type.${value}`),
    }));

    return (
      <Dropdown
        noBorder
        isCompact
        value={nsfw}
        items={NSFW_FULL}
        onSelect={this.onChange('nsfw')}
      />
    );
  };

  getThemeSelect = () => {
    const { t, settings } = this.props;
    const theme = settings.theme || THEME[0].value;

    const THEME_FULL = THEME.map(({ value }) => ({
      value,
      label: t(`components.settings.general.theme_type.${value}`),
    }));

    return (
      <Dropdown
        noBorder
        isCompact
        value={theme}
        items={THEME_FULL}
        onSelect={this.onChange('theme')}
      />
    );
  };

  getCommentsInFeedSwitcher = () => {
    const { settings } = this.props;
    const isShowCommentsInFeed = settings.isShowCommentsInFeed || false;

    return (
      <Switch
        name="settings__general-commentsInFeed"
        value={isShowCommentsInFeed}
        onChange={this.onChange('isShowCommentsInFeed')}
      />
    );
  };

  getEmptyBalancesSwitcher = () => {
    const { settings } = this.props;
    const isHideEmptyBalances = settings.isHideEmptyBalances || false;

    return (
      <Switch
        name="settings__general-commentsInFeed"
        value={isHideEmptyBalances}
        onChange={this.onChange('isHideEmptyBalances')}
      />
    );
  };

  render() {
    const { t, featureFlags } = this.props;

    return (
      <Panel title={t('components.settings.general.title')}>
        <SettingsItem
          label={t('components.settings.general.language')}
          controlComponent={this.getLocaleSelect()}
        />
        <SettingsItem
          label={t('components.settings.general.theme')}
          controlComponent={this.getThemeSelect()}
        />
        <SettingsItem
          label={t('components.settings.general.nsfw_content')}
          controlComponent={this.getNsfwSelect()}
        />
        {featureFlags[FEATURE_POST_FEED_COMMENTS] ? (
          <SettingsItem
            label={t(`components.settings.general.comments_in_feed`)}
            controlComponent={this.getCommentsInFeedSwitcher()}
          />
        ) : null}
        <SettingsItem
          label={t(`components.wallet.my_points.hide_empty_balances`)}
          controlComponent={this.getEmptyBalancesSwitcher()}
        />
      </Panel>
    );
  }
}
