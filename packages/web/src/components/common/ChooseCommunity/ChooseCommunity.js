import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { KEY_CODES, animations } from '@commun/ui';
import { communityType } from 'types';
import Avatar from 'components/common/Avatar';
import InfinityScrollWrapper from 'components/common/InfinityScrollWrapper';
import { displayError } from 'utils/toastsMessages';

const Wrapper = styled.div`
  position: relative;
  flex-basis: 255px;
  height: 44px;
  max-height: 44px;
  z-index: 5;
`;

const Control = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const CommunityAvatar = styled(Avatar)`
  flex-shrink: 0;
  width: 30px;
  height: 30px;
`;

const CommunityAvatarStub = styled(Icon).attrs({ name: 'outline-dashed' })`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin: -1px;
`;

const CommunityName = styled.span`
  flex-grow: 1;
  margin: -1px 0 1px 10px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OpenButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const CloseButton = styled(OpenButton)`
  margin: 0 10px;
`;

const DropDownIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.gray};
  pointer-events: none;

  ${is('isDown')`
    transform: rotate(0.5turn);
  `};
`;

const DropDownWrapper = styled.div`
  position: absolute;
  top: 0;
  left: -15px;
  right: -10px;
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  animation: ${animations.fadeIn} 0.1s forwards;
`;

const SearchBlock = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
`;

const SearchIcon = styled(Icon).attrs({ name: 'search' })`
  width: 20px;
  height: 20px;
  margin: 0 16px 0 19px;
  color: ${({ theme }) => theme.colors.gray};
`;

const SearchInput = styled.input`
  flex-grow: 1;
  margin: -1px 0 1px;
  line-height: 1;
  font-size: 14px;
  background: transparent;
  caret-color: ${({ theme }) => theme.colors.blue};

  &::placeholder {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const ListContainer = styled.div`
  padding-bottom: 10px;
`;

const DropDownList = styled.ul`
  display: block;
  max-height: 172px;
  overflow: auto;
  overflow-x: hidden;
`;

const DropDownItem = styled.li`
  &:first-child {
    margin-top: 8px;
  }
`;

const DropDownItemButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  text-align: left;

  ${is('isActive')`
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  `};

  &:hover {
    background-color: #e6eefa;
  }
`;

const AvatarSmall = styled(Avatar)`
  width: 30px;
  height: 30px;
  margin-left: 15px;
`;

const EmptyBlock = styled.div`
  margin: 8px 15px;
  font-size: 14px;
  font-weight: 600;
  color: #888;
  text-align: center;
`;

export default class ChooseCommunity extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string,
    community: communityType,
    disabled: PropTypes.bool,
    communities: PropTypes.arrayOf(communityType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onSelect: PropTypes.func,
    fetchMyCommunities: PropTypes.func.isRequired,
  };

  static defaultProps = {
    communityId: null,
    community: null,
    disabled: false,
    onSelect: undefined,
  };

  state = {
    searchText: '',
    isOpen: false,
  };

  wrapperRef = createRef();

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;

    if (isOpen !== prevState.isOpen) {
      if (isOpen) {
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('keydown', this.onKeyDown);
      } else {
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('keydown', this.onKeyDown);
      }
    }
  }

  componentWillUnmount() {
    this.unmount = true;
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onMouseDown = e => {
    if (this.wrapperRef && this.wrapperRef.current.contains(e.target)) {
      return;
    }

    this.close();
  };

  onKeyDown = e => {
    if (e.altKey || e.ctrlKey || e.metaKey) {
      return;
    }

    switch (e.which) {
      case KEY_CODES.UP:
      case KEY_CODES.DOWN:
        e.preventDefault();
        this.processArrows(e.which);
        break;
      case KEY_CODES.ENTER:
        e.preventDefault();
        this.onEnterPressed();
        break;
      default:
      // Do nothing
    }
  };

  processArrows = keyCode => {
    const { communities } = this.props;
    const { selectedId } = this.state;

    const index = selectedId
      ? communities.findIndex(community => community.communityId === selectedId)
      : -1;

    let newIndex = index;

    switch (keyCode) {
      case KEY_CODES.UP:
        if (index === -1 || index === 0) {
          break;
        }

        newIndex = index - 1;
        break;

      case KEY_CODES.DOWN:
        if (index === -1) {
          newIndex = 0;
          break;
        }

        if (index >= communities.length - 1) {
          break;
        }

        newIndex = index + 1;
        break;

      default:
      // Do nothing
    }

    if (newIndex !== index) {
      const community = communities[newIndex];

      this.setState({
        selectedId: community.communityId,
      });
    }
  };

  onEnterPressed = () => {
    const { communities, onSelect } = this.props;
    const { selectedId } = this.state;

    if (!selectedId) {
      return;
    }

    const community = communities.find(c => c.communityId === selectedId);

    if (community) {
      this.close();

      if (onSelect) {
        onSelect(community.communityId);
      }
    }
  };

  close = () => {
    this.setState({
      isOpen: false,
    });
  };

  onOpenClick = () => {
    this.setState({
      isOpen: true,
    });
  };

  onSearchTextChange = e => {
    this.setState({
      searchText: e.target.value,
    });
  };

  onControlClick = () => {
    this.setState({
      isOpen: true,
    });
  };

  onCommunityClick = clickCommunityId => {
    const { communityId, onSelect } = this.props;

    this.close();

    if (onSelect && communityId !== clickCommunityId) {
      onSelect(clickCommunityId);
    }
  };

  onNeedLoadMore = async () => {
    const { fetchMyCommunities, communities } = this.props;

    try {
      await fetchMyCommunities({
        offset: communities.length,
      });
    } catch (err) {
      displayError(err);
    }
  };

  render() {
    const { communityId, community, communities, disabled, isEnd, isLoading } = this.props;
    const { searchText, selectedId, isOpen } = this.state;

    let finalCommunities = communities;
    let isSearching = false;

    if (searchText.trim()) {
      const term = searchText.trim().toLowerCase();
      isSearching = true;
      finalCommunities = communities.filter(({ name }) => name.toLowerCase().startsWith(term));
    }

    return (
      <Wrapper ref={this.wrapperRef}>
        <Control onClick={disabled ? null : this.onControlClick}>
          {community ? (
            <CommunityAvatar communityId={community.communityId} />
          ) : (
            <CommunityAvatarStub />
          )}
          <CommunityName>{community ? community.name : 'Choose community'}</CommunityName>
          <OpenButton title="Open">
            <DropDownIcon />
          </OpenButton>
        </Control>
        {isOpen && !disabled ? (
          <DropDownWrapper>
            <SearchBlock>
              <SearchIcon />
              <SearchInput
                placeholder="Choose community"
                value={searchText}
                autoFocus
                onChange={this.onSearchTextChange}
              />
              <CloseButton title="Close" onClick={this.close}>
                <DropDownIcon isDown />
              </CloseButton>
            </SearchBlock>
            <ListContainer>
              <InfinityScrollWrapper
                disabled={isEnd || isLoading}
                onNeedLoadMore={this.onNeedLoadMore}
              >
                {props => (
                  <>
                    <DropDownList {...props}>
                      {finalCommunities.map(itemCommunity => (
                        <DropDownItem key={itemCommunity.communityId}>
                          <DropDownItemButton
                            isActive={
                              (communityId && communityId === itemCommunity.communityId) ||
                              (selectedId && selectedId === itemCommunity.communityId)
                            }
                            onClick={() => this.onCommunityClick(itemCommunity.communityId)}
                          >
                            <AvatarSmall communityId={itemCommunity.communityId} />
                            <CommunityName>{itemCommunity.name}</CommunityName>
                          </DropDownItemButton>
                        </DropDownItem>
                      ))}
                    </DropDownList>
                    {finalCommunities.length === 0 && !isLoading && isSearching ? (
                      <EmptyBlock>Nothing is found</EmptyBlock>
                    ) : null}
                    {finalCommunities.length === 0 && !isLoading && !isSearching ? (
                      <EmptyBlock>No communities</EmptyBlock>
                    ) : null}
                  </>
                )}
              </InfinityScrollWrapper>
            </ListContainer>
          </DropDownWrapper>
        ) : null}
      </Wrapper>
    );
  }
}