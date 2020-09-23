import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';

import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import { SHOW_MODAL_MOBILE_COMMUNITY_LEADER_MENU, SHOW_MODAL_MOBILE_MENU } from 'store/constants';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px 15px;
  background-color: #ffffff;
`;

const ButtonStyled = styled(Button).attrs({ as: 'a' })`
  display: flex;
  align-items: center;
  height: 44px;
  border-radius: 10px;
`;

const ButtonCounter = styled(ButtonStyled)`
  flex: 1;
  justify-content: space-between;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;

  &:not(:first-child) {
    margin-left: 10px;
  }
`;

// const Counter = styled.div`
//   color: ${({ theme }) => theme.colors.black};
// `;

const ButtonSettings = styled(ButtonStyled)`
  justify-content: center;
  min-width: 44px;
  margin-left: 15px;
  padding: 0;
`;

const SettingsIcon = styled(Icon).attrs({ name: 'gear' })`
  width: 28px;
  height: 28px;
  color: #fff;
`;

export default function ManageCommunityMobileWidget({
  communityId,
  communityAlias,
  selectCommunity,
  openModal,
}) {
  const { t } = useTranslation();

  const onWidgetClick = () => {
    selectCommunity({
      communityId,
    });
  };

  const onOpenMobileMenu = () => {
    openModal(SHOW_MODAL_MOBILE_COMMUNITY_LEADER_MENU, {
      communityId,
    });
  };

  return (
    <Wrapper onClick={onWidgetClick}>
      <Link route="leaderboard" params={{ section: 'reports' }}>
        <ButtonCounter>
          {t('widgets.manage_community.reports')}
          {/* <Counter>12</Counter> */}
        </ButtonCounter>
      </Link>

      <Link route="leaderboard" params={{ section: 'proposals' }}>
        <ButtonCounter>
          {t('widgets.manage_community.proposals')}
          {/* <Counter>15</Counter> */}
        </ButtonCounter>
      </Link>
      <ButtonSettings primary onClick={onOpenMobileMenu}>
        <SettingsIcon />
      </ButtonSettings>
    </Wrapper>
  );
}

ManageCommunityMobileWidget.propTypes = {
  communityId: PropTypes.string.isRequired,
  communityAlias: PropTypes.string.isRequired,

  selectCommunity: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};
