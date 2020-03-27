import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types';
import { withTranslation } from 'shared/i18n';
import { displayError } from 'utils/toastsMessages';
import LinksList, {
  ListItem,
  AvatarStyled,
  ItemText,
  StyledAnchor,
} from 'components/common/SideBar/LinksList';
import { CommunityLink } from 'components/links';

@withTranslation()
export default class LeaderManagementWidget extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isLoaded: PropTypes.bool.isRequired,
    fetchManagementCommunities: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const { isLoaded, fetchManagementCommunities } = this.props;

    if (isLoaded) {
      return;
    }

    try {
      await fetchManagementCommunities();
    } catch (err) {
      displayError(err);
    }
  }

  render() {
    const { items, t } = this.props;

    if (!items.length) {
      return null;
    }

    return (
      <LinksList
        title={t('widgets.leader_management.title')}
        link={{
          route: 'leaderboard',
        }}
        items={items.map(community => ({
          route: 'leaderboard',
          desc: community.name,
          avatar: {
            communityId: community.communityId,
          },
        }))}
        renderItems={() =>
          items.map(community => (
            <ListItem key={community.communityId}>
              <CommunityLink community={community}>
                <StyledAnchor>
                  <AvatarStyled communityId={community.communityId} />
                  <ItemText>{community.name}</ItemText>
                </StyledAnchor>
              </CommunityLink>
            </ListItem>
          ))
        }
      />
    );
  }
}
