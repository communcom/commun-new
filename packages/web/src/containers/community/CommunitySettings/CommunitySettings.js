import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';

import { Card } from '@commun/ui';
import withTabs from 'utils/hocs/withTabs';
import NavigationTabBar from 'components/NavigationTabBar';
import Redirect from 'components/Redirect';

import { Header, Title } from 'containers/community/common';
import CurrentSettings from './CurrentSettings';
import ProposalsList from './ProposalsList';
import NewProposal from './NewProposal';

const NavigationTabBarStyled = styled(NavigationTabBar)`
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  border-bottom: none;
  border-radius: 4px 4px 0 0;
`;

const Wrapper = styled(Card)`
  padding-top: 2px;
  border-top: none !important;
  border-radius: 0 0 4px 4px !important;
`;

const RedirectStyled = styled(Redirect)`
  height: 280px;
  min-height: unset;
`;

const TABS = {
  current: {
    tabName: 'Current',
    route: 'community',
    index: true,
    Component: CurrentSettings,
  },
  proposals: {
    tabName: 'Proposals',
    route: 'community',
    Component: ProposalsList,
  },
  new: {
    tabName: 'New proposal',
    route: 'community',
    Component: NewProposal,
  },
};

@withRouter
@withTabs(TABS, 'current', 'subSection')
export default class CommunitySettings extends PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    communityId: PropTypes.string.isRequired,
    communityAlias: PropTypes.string.isRequired,
    tabs: PropTypes.shape({}).isRequired,
    tab: PropTypes.shape({}).isRequired,
    tabProps: PropTypes.shape({}).isRequired,
  };

  renderBody() {
    const { tab, tabProps, communityId, communityAlias } = this.props;

    if (!tab) {
      return (
        <Wrapper>
          <RedirectStyled route="community" params={{ communityAlias, section: 'settings' }} />
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <Header>
          <Title>{tab.tabName}</Title>
        </Header>
        <tab.Component {...tabProps} communityId={communityId} communityAlias={communityAlias} />
      </Wrapper>
    );
  }

  render() {
    const { communityAlias, tabs } = this.props;

    return (
      <>
        <NavigationTabBarStyled
          sectionField="subSection"
          tabs={tabs}
          params={{ communityAlias, section: 'settings' }}
          isCommunity
          noBorder
        />
        {this.renderBody()}
      </>
    );
  }
}
