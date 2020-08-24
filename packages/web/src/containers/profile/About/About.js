import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled, { css } from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Card, styles } from '@commun/ui';

import { profileType } from 'types';
import { SOCIAL_LINKS_LIST, SOCIAL_MESSENGERS_LIST } from 'shared/constants';
import { FEATURE_SETTINGS_LINKS, FEATURE_SETTINGS_MESSENGERS } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import activeLink from 'utils/hocs/activeLink';

import Content, { StickyAside } from 'components/common/Content';
import EmptyList from 'components/common/EmptyList';

const Wrapper = styled.div``;

const CardWrapper = styled(Card)`
  position: relative;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 22px 15px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const Bio = styled.div`
  padding: 20px 15px 15px;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 15px;
`;

const BioEdit = styled.a`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
`;

const BioText = styled.div`
  padding-top: 15px;
  font-size: 14px;
  white-space: pre-wrap;
`;

const Contact = styled.div`
  display: flex;
  padding: 20px 15px;

  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const Website = styled.div`
  padding: 20px 15px 15px;
  border-top: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const WebsiteInfo = styled.div`
  display: flex;
  padding-top: 15px;
`;

const ContactIcon = styled(Icon)`
  width: 20px;
  height: 20px;

  ${is('isDesktop')`
    width: 30px;
    height: 30px;
  `}
`;

const ContactInfo = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const ContactTop = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
`;

const ContactName = styled.div`
  flex: 1;
  font-size: 15px;
`;

const Value = styled.div`
  flex: 1;
  margin-right: 50px;
  font-size: 15px;
  ${styles.breakWord}
`;

const ContactTextLink = styled.a`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
`;

const ContactIconLink = styled.a``;

const OpenStub = styled.div`
  width: 24px;
  height: 24px;
`;

const OpenCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  color: ${({ theme }) => theme.colors.gray};
`;

const ChevronIcon = styled(Icon).attrs({ name: 'chevron' })`
  transform: rotate(-90deg);
`;

const ContactDefault = styled.div`
  margin-top: 15px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

// SidebarCard
const SidebarCard = styled(Card)`
  padding: 10px 0;
`;

const SidebarLink = activeLink(styled.a`
  position: relative;
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 15px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  cursor: pointer;

  ${({ active }) =>
    active
      ? css`
          background-color: ${({ theme }) => theme.colors.lighterGray};

          &::after {
            position: absolute;
            content: '';
            left: 0;
            top: 50%;
            width: 2px;
            height: 15px;
            margin-top: -7px;
            border-radius: 1px;
            background-color: ${({ theme }) => theme.colors.blue};
          }
        `
      : null}
`);

const REGEXP_URL = /http(s)?:\/\/(.+)/;

@withRouter
@withTranslation()
export default class About extends Component {
  static propTypes = {
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    profile: profileType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,
    featureFlags: PropTypes.object.isRequired,
  };

  renderWebsite() {
    const { profile, t } = this.props;

    if (!profile.personal.websiteUrl) {
      return null;
    }

    const originalUrl = profile.personal.websiteUrl;
    const urlName = originalUrl.replace(REGEXP_URL, '$2');
    const url = REGEXP_URL.test(originalUrl) ? originalUrl : `http://${originalUrl}`;

    return (
      <Website>
        <Title>{t('components.profile.about.website')}</Title>
        <WebsiteInfo>
          <Value>
            <ContactTextLink href={url} target="_blank" rel="noopener noreferrer noindex">
              {urlName}
            </ContactTextLink>
          </Value>
          <ContactIconLink href={url} target="_blank" rel="noopener noreferrer noindex">
            <OpenCircle>
              <ChevronIcon />
            </OpenCircle>
          </ContactIconLink>
        </WebsiteInfo>
      </Website>
    );
  }

  renderContacts(contacts) {
    const { isDesktop, t } = this.props;

    return contacts.map(({ name, href, value, iconName, default: defaultContact }) => (
      <Contact>
        <ContactIcon name={iconName} isDesktop={isDesktop} />
        <ContactInfo>
          <ContactTop>
            <ContactName>{name}</ContactName>
            <Value>
              {href ? (
                <ContactTextLink href={href} target="_blank" rel="noopener noreferrer noindex">
                  {value}
                </ContactTextLink>
              ) : (
                value
              )}
            </Value>
            {href ? (
              <ContactIconLink href={href} target="_blank" rel="noopener noreferrer noindex">
                <OpenCircle>
                  <ChevronIcon />
                </OpenCircle>
              </ContactIconLink>
            ) : (
              <OpenStub />
            )}
          </ContactTop>
          {defaultContact ? (
            <ContactDefault>{t('components.profile.about.preferrable')}</ContactDefault>
          ) : null}
        </ContactInfo>
      </Contact>
    ));
  }

  renderContent() {
    const { profile, isOwner, featureFlags, t } = this.props;

    const messengers = [];
    if (featureFlags[FEATURE_SETTINGS_MESSENGERS]) {
      SOCIAL_MESSENGERS_LIST.map(item => {
        const contact = profile.personal?.messengers?.[item.contactId];

        if (contact) {
          messengers.push({
            ...item,
            ...contact,
          });
        }
      });
    }

    const links = [];
    if (featureFlags[FEATURE_SETTINGS_LINKS]) {
      SOCIAL_LINKS_LIST.map(item => {
        const contact = profile.personal?.links?.[item.contactId];

        if (contact) {
          links.push({
            ...item,
            ...contact,
          });
        }
      });
    }

    return (
      <>
        <CardWrapper>
          <CardTitle id="about">{t('components.profile.about.tabs.about')}</CardTitle>
          {profile.personal.biography || profile.personal.websiteUrl ? (
            <>
              <Bio>
                <Title>
                  {t('components.profile.about.bio')}
                  {isOwner ? (
                    <Link route="settings" params={{ section: 'general' }} hash="bio">
                      <BioEdit>{t('common.edit')}</BioEdit>
                    </Link>
                  ) : null}
                </Title>
                <BioText>{profile.personal.biography}</BioText>
              </Bio>
              {this.renderWebsite()}
            </>
          ) : (
            <Bio>
              <EmptyList headerText={t('components.profile.about.no_bio')} />
            </Bio>
          )}
        </CardWrapper>

        {messengers.length ? (
          <CardWrapper>
            <CardTitle id="messengers">{t('components.profile.about.tabs.messengers')}</CardTitle>
            {this.renderContacts(messengers)}
          </CardWrapper>
        ) : null}
        {links.length ? (
          <CardWrapper>
            <CardTitle id="link">{t('components.profile.about.tabs.links')}</CardTitle>
            {this.renderContacts(links)}
          </CardWrapper>
        ) : null}
      </>
    );
  }

  render() {
    const { profile, featureFlags, t } = this.props;

    const sidebarLinks = [
      {
        name: t('components.profile.about.tabs.about'),
      },
    ];

    if (featureFlags[FEATURE_SETTINGS_MESSENGERS] && profile.personal?.links?.length) {
      sidebarLinks.push({
        name: t('components.profile.about.tabs.messengers'),
        hash: 'messengers',
      });
    }

    if (featureFlags[FEATURE_SETTINGS_LINKS] && profile.personal?.messengers?.length) {
      sidebarLinks.push({
        name: t('components.profile.about.tabs.links'),
        hash: 'links',
      });
    }

    return (
      <Content
        aside={() => (
          <StickyAside>
            <SidebarCard>
              {sidebarLinks.map(({ name, hash }) => (
                <SidebarLink
                  route="profile"
                  params={{ username: profile.username, section: 'about' }}
                  hash={hash}
                  includeQueryParams
                  passHref
                >
                  {name}
                </SidebarLink>
              ))}
            </SidebarCard>
          </StickyAside>
        )}
      >
        <Wrapper>{this.renderContent()}</Wrapper>
      </Content>
    );
  }
}
