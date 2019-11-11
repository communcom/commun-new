import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';

// import { Button } from '@commun/ui';
import { tabInfoType } from 'types';
import { CommunitiesTab } from 'shared/constants';
import withTabs from 'utils/hocs/withTabs';
import activeLink from 'utils/hocs/activeLink';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import TabLoader from 'components/common/TabLoader/TabLoader';
import NavigationTabBar from 'components/common/NavigationTabBar';
import Discover from './discover';
import MyCommunities from './my';

const Wrapper = styled.div`
  flex: 1;
  padding: 20px;
  border-radius: 6px;
  background-color: #fff;
`;

const Header = styled.div``;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-right: -15px;
`;

const TitleText = styled.span`
  margin-right: 15px;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  white-space: nowrap;
`;

// const CreateButton = styled(Button)`
//   margin-right: 15px;
// `;

const Tabs = styled.div`
  display: inline-block;
  margin-top: 20px;
`;

const NavigationTabBarStyled = styled(NavigationTabBar)`
  padding: 0;
`;

const Content = styled.div`
  margin-top: 30px;
`;

const Container = styled.ul`
  display: grid;
  grid-gap: 40px;
  grid-template-columns: repeat(2, auto);
`;

const TabLink = activeLink(styled.a`
  display: inline-block;
  position: relative;
  height: 35px;
  line-height: 25px;
  white-space: nowrap;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  ${({ active, theme }) =>
    active
      ? `
        color: #000;

        &::after {
          content: '';
          position: absolute;
          display: block;
          height: 2px;
          width: 10px;
          bottom: 1px;
          left: 50%;
          margin-left: -5px;
          background: ${theme.colors.blue};
          border-radius: 4px;
        }
        `
      : `
        &:hover,
        &:focus {
          color: #000;
        }
  `};
`);

const TABS = [
  {
    id: CommunitiesTab.DISCOVER,
    tabName: 'Discover',
    route: 'communities',
    index: true,
    isOwnerRequired: false,
    Component: Discover,
  },
  {
    id: CommunitiesTab.MY,
    tabName: 'My communities',
    route: 'communities',
    isOwnerRequired: true,
    Component: MyCommunities,
  },
];

@withRouter
@withTabs(TABS, CommunitiesTab.DISCOVER)
export default class Communities extends PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    isOwner: PropTypes.bool.isRequired,
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    userId: null,
    tab: null,
  };

  static async getInitialProps({ store }) {
    return {
      userId: currentUnsafeUserIdSelector(store.getState()) || null,
      namespacesRequired: [],
    };
  }

  renderContent() {
    const { tab, tabProps } = this.props;

    if (!tab) {
      return (
        <>
          <TabLoader />
        </>
      );
    }

    return <tab.Component {...tabProps} />;
  }

  render() {
    const { isOwner, tabs } = this.props;

    return (
      <Wrapper>
        <Header>
          <Title>
            <TitleText>Communities</TitleText>
            {/* <CreateButton primary>Create community</CreateButton> */}
          </Title>
          <Tabs>
            <NavigationTabBarStyled
              tabs={tabs}
              isOwner={isOwner}
              renderContainer={props => <Container {...props} />}
              renderTabLink={props => <TabLink {...props} />}
            />
          </Tabs>
        </Header>
        <Content>{this.renderContent()}</Content>
      </Wrapper>
    );
  }
}
