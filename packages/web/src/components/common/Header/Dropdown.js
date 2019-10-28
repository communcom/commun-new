import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Link } from 'shared/routes';
import { Search, animations, styles, up } from '@commun/ui';
import Avatar from 'components/common/Avatar';
import { HEADER_HEIGHT } from './constants';

// TODO replace with real info
const feeds = [{ name: 'home' }, { name: 'popular' }, { name: 'original content' }];
const communities = [
  { name: 'overwatch', color: '#eea041' },
  { name: 'photographers', color: '#3222d9' },
  { name: 'adme', color: '#f4d34e' },
];

const Wrapper = styled.div`
  position: absolute;
  top: ${HEADER_HEIGHT}px;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  width: 100%;
  background-color: #fff;
  overflow: auto;

  ${up.mobileLandscape} {
    width: calc(100% - 40px);
  }

  ${is('open')`
    animation: ${animations.fadeIn} ${animations.ANIMATION_DURATION_HEADER}ms linear both;
  `};

  ${is('hideAnim')`
    animation: ${animations.fadeOut} ${animations.ANIMATION_DURATION_HEADER}ms linear both;
  `};
`;

const CommunityChooser = styled.div`
  max-width: 767px;
  margin: 8px 16px 0 16px;

  ${up.mobileLandscape} {
    margin: 16px 20px 0;
  }

  @media (min-width: 850px) {
    margin: 16px auto 0;
  }

  ${up.desktop} {
    margin: 16px 0 0 120px;
  }
`;

const Title = styled.div`
  margin: 24px 0 16px;
  font-size: 12px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray};
`;

const FeedsList = styled.ul``;

const FeedItem = styled.li`
  padding: 15px 0;
  font-size: 24px;
  font-weight: bold;
`;

const FeedLink = styled.a`
  display: flex;
  justify-content: space-between;
  width: 100%;

  ${({ theme }) => `
    color: ${theme.colors.black};

    &:hover,
    &:focus {
      color: ${theme.colors.blue};
    }
  `};
`;

const FeedSlash = styled.span`
  margin-right: 8px;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.blue};
`;

const CommunitiesList = styled.ul``;

const CommunityItem = styled(FeedItem)``;

const CommunityLink = styled(FeedLink)`
  &:hover,
  &:focus {
    color: ${({ color }) => color};
  }
`;

const CommunitySlash = styled(FeedSlash)`
  color: ${({ color }) => color};
`;

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const CustomAvatar = styled(Avatar)`
  margin-left: 20px;
`;

const ItemName = styled.div`
  ${styles.overflowEllipsis}
`;

export default class Dropdown extends Component {
  static propTypes = {
    isOpenDropdownAnim: PropTypes.bool.isRequired,
    isHideDropdownAnim: PropTypes.bool.isRequired,
    toggleDropdownChooser: PropTypes.func.isRequired,
  };

  state = {
    searchValue: '',
  };

  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  searchInputChangeHandler = e => {
    this.setState({
      searchValue: e.target.value,
    });
  };

  renderFeeds() {
    const { toggleDropdownChooser } = this.props;

    return feeds.map(item => (
      <FeedItem key={item.name}>
        <Link route="home" passHref>
          <FeedLink onClick={toggleDropdownChooser}>
            <ItemLeft>
              <FeedSlash>/</FeedSlash>
              <ItemName>{item.name}</ItemName>
            </ItemLeft>
          </FeedLink>
        </Link>
      </FeedItem>
    ));
  }

  renderCommunities() {
    const { toggleDropdownChooser } = this.props;

    return communities.map(item => (
      <CommunityItem key={item.name}>
        <Link route="community" params={{ communityAlias: item.alias }} passHref>
          <CommunityLink color={item.color} onClick={toggleDropdownChooser}>
            <ItemLeft>
              <CommunitySlash color={item.color}>/</CommunitySlash>
              <ItemName>{item.name}</ItemName>
            </ItemLeft>
            <CustomAvatar communityId={item.name} />
          </CommunityLink>
        </Link>
      </CommunityItem>
    ));
  }

  render() {
    const { isOpenDropdownAnim, isHideDropdownAnim } = this.props;
    const { searchValue } = this.state;

    return (
      <Wrapper open={isOpenDropdownAnim ? 1 : 0} hideAnim={isHideDropdownAnim ? 1 : 0}>
        <CommunityChooser>
          <Search
            inverted
            label="Search"
            type="search"
            placeholder="Search..."
            value={searchValue}
            onChange={this.searchInputChangeHandler}
          />
          <Title>feeds</Title>
          <FeedsList>{this.renderFeeds()}</FeedsList>
          <Title>communities</Title>
          <CommunitiesList>{this.renderCommunities()}</CommunitiesList>
        </CommunityChooser>
      </Wrapper>
    );
  }
}
