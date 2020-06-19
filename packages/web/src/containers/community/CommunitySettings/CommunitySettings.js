// TODO: commented code could be used in future
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

// import { withRouter } from 'next/router';
import { Card, up } from '@commun/ui';

// import { tabInfoType } from 'types';
// import withTabs from 'utils/hocs/withTabs';
import { withTranslation } from 'shared/i18n';

// import NavigationTabBar from 'components/common/NavigationTabBar';
// import Redirect from 'components/common/Redirect';
// import { Header, Title } from 'containers/community/common';
// import CurrentSettings from './CurrentSettings';
// import ProposalsList from './ProposalsList';
// import NewProposal from './NewProposal';

// const NavigationTabBarStyled = styled(NavigationTabBar)`
//   border: 1px solid ${({ theme }) => theme.colors.lightGray};
//   border-bottom: none;
//   border-radius: 4px 4px 0 0;
// `;

const Wrapper = styled(Card)`
  padding: 15px 15px;

  ${up.desktop} {
    padding-top: 20px;
  }
`;

const Content = styled.div`
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 5px;
  white-space: pre-wrap;
`;

// const TABS = [
//   {
//     id: 'current',
//     tabName: 'Current',
//     route: 'community',
//     index: true,
//     Component: CurrentSettings,
//   },
//   {
//     id: 'proposals',
//     tabName: 'Proposals',
//     route: 'community',
//     Component: ProposalsList,
//   },
//   {
//     id: 'new',
//     tabName: 'New proposal',
//     route: 'community',
//     Component: NewProposal,
//   },
// ];

// @withRouter
@withTranslation()
// @withTabs(TABS, 'current', 'subSection')
export default class CommunitySettings extends PureComponent {
  // static propTypes = {
  //   // eslint-disable-next-line react/no-unused-prop-types
  //   communityId: PropTypes.string.isRequired,
  //   communityAlias: PropTypes.string.isRequired,
  //   tabs: PropTypes.arrayOf(tabInfoType).isRequired,
  //   tab: tabInfoType,
  //   tabProps: PropTypes.shape({}).isRequired,
  // };

  // static defaultProps = {
  //   tab: null,
  // };

  // renderBody() {
  //   const { tab, tabProps, communityId, communityAlias } = this.props;

  //   if (!tab) {
  //     return (
  //       <Wrapper>
  //         <RedirectStyled route="community" params={{ communityAlias, section: 'settings' }} />
  //       </Wrapper>
  //     );
  //   }

  //   return (
  //     <Wrapper>
  //       <Header>
  //         <Title>{tab.tabName}</Title>
  //       </Header>
  //       <tab.Component {...tabProps} communityId={communityId} communityAlias={communityAlias} />
  //     </Wrapper>
  //   );
  // }

  render() {
    const { /* communityAlias, tabs, */ t } = this.props;

    return (
      <Wrapper>
        <Content>{t('components.createCommunity.default_settings')}</Content>
      </Wrapper>
    );

    // return (
    //   <>
    //     <NavigationTabBarStyled
    //       sectionField="subSection"
    //       tabs={tabs}
    //       params={{ communityAlias, section: 'settings' }}
    //       isCommunity
    //       noBorder
    //     />
    //     {this.renderBody()}
    //   </>
    // );
  }
}
