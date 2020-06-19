import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

import { WidgetCard } from '../common';

const WidgetCardStyled = styled(WidgetCard).attrs({ as: 'a' })`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  height: 50px;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  white-space: nowrap;

  & > :last-child {
    padding-bottom: 0;
  }
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

export default function ManageCommunityWidget({ communityId, selectCommunity }) {
  const { t } = useTranslation();

  const onWidgetClick = () => {
    selectCommunity({
      communityId,
    });
  };

  return (
    <Link route="leaderboard" params={{ section: 'proposals' }} passHref>
      <WidgetCardStyled noPadding onClick={onWidgetClick}>
        <ManageIconWrapper>
          <ManageIcon name="settings" />
        </ManageIconWrapper>
        <ManageText>{t('widgets.manage_community.text')}</ManageText>
      </WidgetCardStyled>
    </Link>
  );
}

ManageCommunityWidget.propTypes = {
  communityId: PropTypes.string.isRequired,

  selectCommunity: PropTypes.func.isRequired,
};
