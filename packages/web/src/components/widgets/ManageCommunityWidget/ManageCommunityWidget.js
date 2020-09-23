import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

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

const LINKS = [
  {
    name: 'reports',
    route: () => 'leaderboard',
    params: { section: 'reports' },
    icon: 'attention',
  },
  {
    name: 'proposals',
    route: () => 'leaderboard',
    params: { section: 'proposals' },
    icon: 'warning',
  },
  {
    name: 'members',
    route: alias => `${alias}/members`,
    icon: 'user',
  },
  // TODO issue #2668
  // {
  //   name: 'ban',
  //   route: alias => `${alias}/ban`,
  //   icon: 'block',
  // },
  {
    name: 'settings',
    route: alias => `${alias}/settings`,
    icon: 'gear',
  },
];

export default function ManageCommunityWidget({ communityId, communityAlias, selectCommunity }) {
  const { t } = useTranslation();

  const onWidgetClick = () => {
    selectCommunity({
      communityId,
    });
  };

  return (
    <WidgetWrapper>
      {LINKS.map(({ name, route, params, icon }) => (
        <Link key={name} route={route(communityAlias)} params={params} passHref>
          <WidgetCardStyled noPadding onClick={onWidgetClick}>
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
  communityId: PropTypes.string.isRequired,
  communityAlias: PropTypes.string.isRequired,

  selectCommunity: PropTypes.func.isRequired,
};
