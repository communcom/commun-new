import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Dropdown, Panel, Switch } from '@commun/ui';

import { LOCALES } from 'shared/constants';
import { FEATURE_POST_FEED_COMMENTS } from 'shared/featureFlags';
import { i18n, withTranslation } from 'shared/i18n';

import SettingsItem from 'components/pages/settings/SettingsItem';

const DropdownStyled = styled(Dropdown)`
  min-width: 100px;
  text-align: right;
`;

const NSFW = [{ value: 'hide' }, { value: 'warn' }, { value: 'show' }];
const THEME = [{ value: 'light' }, { value: 'system' }, { value: 'dark' }];

@withTranslation()
export default class General extends PureComponent {
  static propTypes = {
    settings: PropTypes.shape({
      locale: PropTypes.string,
      localesPosts: PropTypes.array,
      currencyPosts: PropTypes.string,
      nsfw: PropTypes.string,
      theme: PropTypes.string,
      isShowCommentsInFeed: PropTypes.bool,
      isHideEmptyBalances: PropTypes.bool,
    }).isRequired,
    featureFlags: PropTypes.object.isRequired,

    fetchSettings: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { fetchSettings } = this.props;

    try {
      await fetchSettings();
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  }

  componentDidUpdate() {
    const { settings } = this.props;

    const { locale } = settings;

    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }

    if (dayjs.locale() !== locale) {
      dayjs.locale(locale);
    }
  }

  settingsChangeHandler = async options => {
    const { updateSettings } = this.props;

    try {
      await updateSettings(options);

      const { basic } = options;

      if (basic && basic.locale) {
        i18n.changeLanguage(basic.locale);
        dayjs.locale(basic.locale);
      }
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  };

  onChange = property => value => {
    const options = {
      basic: {
        [property]: value,
      },
    };

    this.settingsChangeHandler(options);
  };

  getLocaleSelect = () => {
    const { settings } = this.props;
    const { locale } = settings;

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

  getLocalPostseSelect = () => {
    const { settings, t } = this.props;
    const { localesPosts } = settings;

    return (
      <DropdownStyled
        noBorder
        isCompact
        isMulti
        placeholder={t('common.all')}
        value={localesPosts}
        items={LOCALES}
        onSelect={this.onChange('localesPosts')}
      />
    );
  };

  getCurrencyPosts = () => {
    const { settings, t } = this.props;

    const CURRENCIES = [
      { value: 'USD', label: '$ USD' },
      { value: 'CMN', label: 'Commun' },
      { value: 'POINTS', label: t('common.point', { count: 1 }) },
    ];

    const currency = settings.currencyPosts;

    return (
      <Dropdown
        noBorder
        isCompact
        value={currency}
        items={CURRENCIES}
        onSelect={this.onChange('currencyPosts')}
      />
    );
  };

  getNsfwSelect = () => {
    const { t, settings } = this.props;
    const { nsfw } = settings;

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
    const { theme } = settings;

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
    const { isShowCommentsInFeed } = settings;

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
    const { isHideEmptyBalances } = settings;

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
          label={t('components.settings.general.languagePosts')}
          controlComponent={this.getLocalPostseSelect()}
        />{' '}
        <SettingsItem
          label={t('components.settings.general.currencyPosts')}
          controlComponent={this.getCurrencyPosts()}
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
