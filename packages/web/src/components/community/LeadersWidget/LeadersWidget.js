import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'shared/routes';

import { communityType } from 'types';
import Avatar from 'components/Avatar';
import { CommunityLink } from 'components/links';
import SeeAll from 'components/SeeAll';
import Widget, { Header, Title } from 'components/Widget';

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

  render() {
    const { leaders, community } = this.props;

    return (
      <Widget>
        <Header>
          <Title>Leaders</Title>
          <CommunityLink community={community} section="leaders">
            <SeeAll />
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
      </Widget>
    );
  }
}
