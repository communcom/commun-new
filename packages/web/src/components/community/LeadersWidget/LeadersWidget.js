import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'shared/routes';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import { communityType } from 'types';
import Avatar from 'components/Avatar';
import { CommunityLink } from 'components/links';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
  padding: 8px 0;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  border-radius: 4px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  padding: 0 16px;
`;

const Title = styled.h4`
  font-size: 12px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const LeadersLink = styled.a`
  padding-left: 20px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.communityColor};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColorHover};
  }
`;

const LeadersList = styled.ul``;

const LeadersItem = styled.li`
  width: 100%;
  height: 64px;
`;

const LeaderName = styled.p`
  font-size: 15px;
  letter-spacing: -0.41px;
  padding: 0 0 4px;
  transition: color 0.15s;
`;

const LeaderLink = styled.a`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  color: #000;
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const LeaderNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
`;

const LeaderTitle = styled.p`
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

export default class LeadersWidget extends PureComponent {
  static propTypes = {
    leaders: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string,
      })
    ).isRequired,
    community: communityType.isRequired,
  };

  getLeadersCount = leaders => (leaders.length > 1 ? `${leaders.length} members` : `1 member`);

  render() {
    const { leaders, community } = this.props;

    return (
      <Wrapper>
        <Header>
          <Title>Leaders</Title>
          <CommunityLink community={community} section="leaders">
            <LeadersLink>{this.getLeadersCount(leaders)}</LeadersLink>
          </CommunityLink>
        </Header>
        <LeadersList>
          {leaders.slice(0, 3).map(({ username, name, title }) => (
            <LeadersItem key={username}>
              <Link route="profile" params={{ username }} passHref>
                <LeaderLink>
                  <Avatar userId={username} />
                  <LeaderNameWrapper>
                    <LeaderName>{name || username}</LeaderName>
                    <LeaderTitle>{title}</LeaderTitle>
                  </LeaderNameWrapper>
                </LeaderLink>
              </Link>
            </LeadersItem>
          ))}
        </LeadersList>
      </Wrapper>
    );
  }
}
