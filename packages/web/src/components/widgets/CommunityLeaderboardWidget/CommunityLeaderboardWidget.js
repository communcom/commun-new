import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SideBarNavigation from 'components/common/SideBarNavigation';

const SideBarNavigationStyled = styled(SideBarNavigation)`
  margin-bottom: 8px;
`;

const CommunityLeaderboardWidget = ({ tabs }) => (
  <SideBarNavigationStyled
    sectionKey="section"
    subSectionKey="subSection"
    tabsLocalePath="components.leaderboard.tabs"
    items={tabs}
  />
);

CommunityLeaderboardWidget.propTypes = {};

export default CommunityLeaderboardWidget;
