import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { withRouter } from 'next/router';
import styled, { css } from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Card, styles, up } from '@commun/ui';

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
  margin: 10px;
  border-radius: 10px;

  ${up.tablet} {
    margin: 0;
    border-radius: 0;
  }

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
  align-items: center;
  padding: 20px 15px;

  ${up.tablet} {
    align-items: normal;
  }

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

const GroupName = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  ${up.tablet} {
    flex-direction: row;
  }
`;

const ContactName = styled.div`
  flex: 1;
  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.gray};

  ${up.tablet} {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.black};
  }
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

const JoinedDate = styled.div`
  padding: 20px;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.gray};
`;

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

    return contacts.map(({ name, href, value, iconName, default: defaultContact, type }) => (
      <Contact>
        <ContactIcon name={iconName} isDesktop={isDesktop} />
        <ContactInfo>
          <ContactTop>
            <GroupName>
              <ContactName>
                {name}{' '}
                {!isDesktop &&
                  defaultContact &&
                  `(${t('components.profile.about.preferrable_mobile')})`}
              </ContactName>
              <Value>
                {href ? (
                  <ContactTextLink href={href} target="_blank" rel="noopener noreferrer noindex">
                    {type === 'username' ? `@${value}` : value}
                  </ContactTextLink>
                ) : type === 'username' ? (
                  `@${value}`
                ) : (
                  value
                )}
              </Value>
            </GroupName>
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
          {isDesktop && defaultContact ? (
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

        <CardWrapper>
          <JoinedDate>
            {t('components.profile.profile_header.joined')}{' '}
            {profile
              ? dayjs(profile.registration.time).format('MMMM D, YYYY')
              : `{${t('components.profile.profile_header.not_available')}}`}
          </JoinedDate>
        </CardWrapper>
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

    if (
      featureFlags[FEATURE_SETTINGS_MESSENGERS] &&
      Object.keys(profile.personal?.messengers || []).length
    ) {
      sidebarLinks.push({
        name: t('components.profile.about.tabs.messengers'),
        hash: 'messengers',
      });
    }

    if (featureFlags[FEATURE_SETTINGS_LINKS] && Object.keys(profile.personal?.links || []).length) {
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
