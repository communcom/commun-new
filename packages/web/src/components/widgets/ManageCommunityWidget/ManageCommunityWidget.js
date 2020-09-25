/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { FEATURE_COMMUNITY_MANAGE } from 'shared/featureFlags';
import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

import { WidgetCard } from '../common';

const WidgetWrapper = styled(WidgetCard)`
  background: none;
  padding: 0;

  & > :first-child {
    border-radius: 6px 6px 0 0;
  }

  & > :last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-radius: 0 0 6px 6px;
  }
`;

const WidgetCardStyled = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  margin-bottom: 2px;
  height: 50px;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  white-space: nowrap;
`;

const ManageIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const ManageIcon = styled(Icon)`
  display: block;
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.blue};
`;

const ManageText = styled.span`
  margin-left: 10px;
  font-size: 14px;
  font-weight: 600;
`;

function ManageCommunityWidget({ communityAlias, featureToggles }) {
  const { t } = useTranslation();

  const LINKS = [
    {
      name: 'reports',
      params: communityAlias => ({ communityAlias, section: 'reports' }),
      icon: 'attention',
    },
    {
      name: 'proposals',
      params: communityAlias => ({ communityAlias, section: 'proposals' }),
      icon: 'warning',
    },
  ];

  if (featureToggles[FEATURE_COMMUNITY_MANAGE]) {
    LINKS.push(
      {
        name: 'members',

        params: communityAlias => ({ communityAlias, section: 'members' }),
        icon: 'user',
      },
      {
        name: 'ban',
        params: communityAlias => ({ communityAlias, section: 'members', subSection: 'banned' }),
        icon: 'block',
      },
      {
        name: 'settings',
        params: communityAlias => ({ communityAlias, section: 'members', subSection: 'settings' }),
        icon: 'gear',
      }
    );
  }

  return (
    <WidgetWrapper>
      {LINKS.map(({ name, params, icon }) => (
        <Link key={name} route="leaderboard" params={params(communityAlias)} passHref>
          <WidgetCardStyled noPadding>
            <ManageIconWrapper>
              <ManageIcon name={icon} />
            </ManageIconWrapper>
            <ManageText>{t(`widgets.manage_community.${name}`)}</ManageText>
          </WidgetCardStyled>
        </Link>
      ))}
    </WidgetWrapper>
  );
}

ManageCommunityWidget.propTypes = {
  communityAlias: PropTypes.string.isRequired,

  featureToggles: PropTypes.object.isRequired,
};

export default injectFeatureToggles([FEATURE_COMMUNITY_MANAGE])(ManageCommunityWidget);
