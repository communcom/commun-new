import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { KEY_CODES, animations, up } from '@commun/ui';
import { communityType } from 'types';
import { displayError } from 'utils/toastsMessages';
import { KeyBusContext } from 'utils/keyBus';
import { withTranslation } from 'shared/i18n';
import { IS_CHOOSE_COMMUNITY_TOOLTIP_SHOWED } from 'shared/constants';

import Avatar from 'components/common/Avatar';
import InfinityScrollWrapper from 'components/common/InfinityScrollWrapper';
import ChooseCommunityTooltip from 'components/tooltips/ChooseCommunityTooltip';

const Wrapper = styled.div`
  position: relative;
  flex-basis: 255px;
  height: 44px;
  max-height: 44px;
  z-index: 5;

  ${up.mobileLandscape} {
    max-width: 255px;
  }
`;

const Control = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  cursor: pointer;
  user-select: none;

  ${is('disabled')`
    cursor: default;
  `};
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
  margin: 0 15px;

  ${up.mobileLandscape} {
    margin: 0 10px;
  }
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
  position: fixed;
  top: ${({ mobileTopOffset }) => mobileTopOffset}px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  animation: ${animations.fadeIn} 0.1s forwards;
  overflow: hidden;

  ${up.mobileLandscape} {
    position: absolute;
    top: 0;
    left: -15px;
    right: -10px;
    bottom: unset;
    border-radius: 10px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  }
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
  max-height: calc(100vh - 100px); /* 44px header, 44px chooser, 12px padding-bottom */
  overflow: auto;
  overflow-x: hidden;

  ${up.mobileLandscape} {
    max-height: 172px;
  }
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

@withTranslation()
export default class ChooseCommunity extends PureComponent {
  static propTypes = {
    isAuthorized: PropTypes.bool,
    communityId: PropTypes.string,
    community: PropTypes.shape({
      id: PropTypes.string.isRequired,
      communityId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    disabled: PropTypes.bool,
    isChooseCommunityTooltipOpen: PropTypes.bool,
    communities: PropTypes.arrayOf(communityType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    mobileTopOffset: PropTypes.number,
    authUserId: PropTypes.string,

    onSelect: PropTypes.func,
    onCloseEditor: PropTypes.func.isRequired,
    onCloseChooseCommunityTooltip: PropTypes.func.isRequired,
    fetchMyCommunities: PropTypes.func.isRequired,
    getCommunities: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isAuthorized: false,
    isChooseCommunityTooltipOpen: false,
    communityId: null,
    community: null,
    disabled: false,
    authUserId: null,
    mobileTopOffset: 0,
    onSelect: undefined,
  };

  static contextType = KeyBusContext;

  state = {
    searchText: '',
    // eslint-disable-next-line react/destructuring-assignment
    isOpen: !this.props.communityId,
  };

  wrapperRef = createRef();

  componentDidUpdate(prevProps, prevState) {
    const keyBus = this.context;
    const { isOpen } = this.state;

    if (isOpen !== prevState.isOpen) {
      if (isOpen) {
        window.addEventListener('mousedown', this.onMouseDown);
        keyBus.on(this.onKeyDown);
      } else {
        window.removeEventListener('mousedown', this.onMouseDown);
        keyBus.off(this.onKeyDown);
      }
    }
  }

  componentWillUnmount() {
    const keyBus = this.context;

    this.unmount = true;
    window.removeEventListener('mousedown', this.onMouseDown);
    keyBus.off(this.onKeyDown);
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
        onSelect(community.communityId, community);
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

  onCommunityClick = (clickCommunityId, community) => {
    const { communityId, onSelect } = this.props;

    this.close();

    if (onSelect && communityId !== clickCommunityId) {
      onSelect(clickCommunityId, community);
    }
  };

  onNeedLoadMore = async () => {
    const { isAuthorized, communities, fetchMyCommunities, getCommunities } = this.props;

    try {
      const offset = communities.length;

      if (isAuthorized) {
        await fetchMyCommunities({ offset });
      } else {
        await getCommunities({ offset });
      }
    } catch (err) {
      displayError(err);
    }
  };

  render() {
    const {
      className,
      communityId,
      community,
      communities,
      authUserId,
      disabled,
      isChooseCommunityTooltipOpen,
      isEnd,
      isLoading,
      mobileTopOffset,
      t,
      onCloseEditor,
      onCloseChooseCommunityTooltip,
    } = this.props;
    const { searchText, selectedId, isOpen } = this.state;

    let finalCommunities = [
      {
        id: 'FEED',
        communityId: 'FEED',
        name: 'Feed',
      },
    ].concat(communities.filter(c => c.communityId !== 'FEED'));
    let isSearching = false;

    if (searchText.trim()) {
      const term = searchText.trim().toLowerCase();
      isSearching = true;
      finalCommunities = communities.filter(({ name }) => name.toLowerCase().startsWith(term));
    }

    return (
      <Wrapper ref={this.wrapperRef} className={className}>
        <Control disabled={disabled} onClick={disabled ? null : this.onControlClick}>
          {community ? (
            <CommunityAvatar communityId={community.communityId} />
          ) : (
            <CommunityAvatarStub />
          )}
          <CommunityName>{community ? community.name : 'Choose community'}</CommunityName>
          {disabled ? null : (
            <>
              <OpenButton title="Open">
                <DropDownIcon />
              </OpenButton>
              {!community &&
              isChooseCommunityTooltipOpen &&
              !sessionStorage.getItem(IS_CHOOSE_COMMUNITY_TOOLTIP_SHOWED) ? (
                <ChooseCommunityTooltip
                  onClose={onCloseChooseCommunityTooltip}
                  onCloseEditor={onCloseEditor}
                />
              ) : null}
            </>
          )}
        </Control>
        {isOpen && !disabled ? (
          <DropDownWrapper mobileTopOffset={mobileTopOffset}>
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
                            onClick={() =>
                              this.onCommunityClick(itemCommunity.communityId, itemCommunity)
                            }
                          >
                            {itemCommunity.communityId === 'FEED' ? (
                              <AvatarSmall userId={authUserId} />
                            ) : (
                              <AvatarSmall communityId={itemCommunity.communityId} />
                            )}
                            <CommunityName>
                              {itemCommunity.communityId === 'FEED'
                                ? t('common.feed')
                                : itemCommunity.name}
                            </CommunityName>
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
