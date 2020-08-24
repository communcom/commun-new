import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Dropdown, Input, Panel, Switch, up } from '@commun/ui';

import { profileType } from 'types';
import { LOCALES } from 'shared/constants';
import { FEATURE_POST_FEED_COMMENTS, FEATURE_SETTINGS_GENERAL_COMMON } from 'shared/featureFlags';
import { i18n, withTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import AsyncButton from 'components/common/AsyncButton';
import CoverAvatarOriginal from 'components/common/CoverAvatar/CoverAvatar.connect';
import CoverImage from 'components/common/CoverImage/CoverImage.connect';
import SettingsItem from 'components/pages/settings/SettingsItem';

const Form = styled.div`
  margin-bottom: 40px;
`;

const SubTitle = styled.div`
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

const CoverAvatar = styled(CoverAvatarOriginal)`
  position: relative;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 1;

  ${up.desktop} {
    position: relative;
    top: 0;
    width: 120px;
    height: 120px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-bottom: 15px;
  }
`;

const AsyncButtonStyled = styled(AsyncButton)`
  flex: 1;
`;

const DropdownStyled = styled(Dropdown)`
  min-width: 100px;
  text-align: right;
`;

const NSFW = [{ value: 'hide' }, { value: 'warn' }, { value: 'show' }];
const THEME = [{ value: 'light' }, { value: 'system' }, { value: 'dark' }];

@withTranslation()
export default class General extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,
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

    updateProfileMeta: PropTypes.func.isRequired,
    fetchSettings: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
  };

  state = {
    personal: this.props.profile.personal,
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

  onAvatarUpdate = async url => {
    const { updateProfileMeta } = this.props;

    await updateProfileMeta({
      avatarUrl: url,
    });
  };

  onCoverUpdate = async url => {
    const { updateProfileMeta } = this.props;

    await updateProfileMeta({
      coverUrl: url,
    });
  };

  onChangeBasicInfo = field => e => {
    const { personal } = this.state;

    this.setState({
      personal: {
        ...(personal || {}),
        [field]: e.target.value,
      },
    });
  };

  handleSaveBasicInfo = async () => {
    const { updateProfileMeta, t } = this.props;
    const { personal } = this.state;

    try {
      await updateProfileMeta(personal);
      displaySuccess(t('toastsMessages.saved'));
    } catch (err) {
      displayError(err);
    }
  };

  render() {
    const { profile, t, featureFlags } = this.props;
    const { personal } = this.state;

    return (
      <Panel title={t('components.settings.general.title')}>
        {featureFlags[FEATURE_SETTINGS_GENERAL_COMMON] ? (
          <>
            <Form>
              <SubTitle>{t('components.settings.general.profile_photo')}</SubTitle>
              <Center>
                <CoverAvatar
                  userId={profile.userId}
                  editable
                  size="big"
                  successMessage={t('components.profile.profile_header.avatar_updated')}
                  onUpdate={this.onAvatarUpdate}
                />
              </Center>
            </Form>
            <Form>
              <SubTitle>{t('components.settings.general.cover_photo')}</SubTitle>
              <Center>
                <CoverImage
                  userId={profile.userId}
                  editable
                  isSettings
                  successMessage={t('components.profile.profile_header.cover_updated')}
                  onUpdate={this.onCoverUpdate}
                />
              </Center>
            </Form>
            <Form>
              <SubTitle>{t('components.settings.general.basic_info')}</SubTitle>
              <Field>
                <Input
                  type="text"
                  title={t('components.settings.general.first_name')}
                  value={personal.firstName}
                  onChange={this.onChangeBasicInfo('firstName')}
                />
              </Field>
              <Field>
                <Input
                  type="text"
                  title={t('components.settings.general.last_name')}
                  value={personal.lastName}
                  onChange={this.onChangeBasicInfo('lastName')}
                />
              </Field>
              <Field>
                <Input
                  type="text"
                  title={t('components.settings.general.username')}
                  value={profile.username}
                  disabled
                />
              </Field>
              <Field>
                <Input
                  type="text"
                  title={t('components.settings.general.website')}
                  value={personal.websiteUrl}
                  onChange={this.onChangeBasicInfo('websiteUrl')}
                />
              </Field>
              <Field>
                <Input
                  id="bio"
                  type="text"
                  title={t('components.settings.general.bio')}
                  value={personal.biography}
                  multiline
                  onChange={this.onChangeBasicInfo('biography')}
                />
              </Field>
              <Field>
                <AsyncButtonStyled primary onClick={this.handleSaveBasicInfo}>
                  {t('common.save')}
                </AsyncButtonStyled>
              </Field>
            </Form>
          </>
        ) : null}

        <SubTitle>{t('components.settings.general.platform_settings')}</SubTitle>
        <SettingsItem
          label={t('components.settings.general.language')}
          controlComponent={this.getLocaleSelect()}
        />
        <SettingsItem
          label={t('components.settings.general.languagePosts')}
          controlComponent={this.getLocalPostseSelect()}
        />
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
