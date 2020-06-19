import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { animations, KEY_CODES, up } from '@commun/ui';

import { communityType } from 'types';
import { IS_CHOOSE_COMMUNITY_TOOLTIP_SHOWED } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { KeyBusContext } from 'utils/keyBus';
import { displayError } from 'utils/toastsMessages';

import Avatar from 'components/common/Avatar';
import {
  CloseButton,
  Control,
  DropDownIcon,
  DropDownItem,
  DropDownList,
  EmptyBlock,
  ListContainer,
  Name,
  OpenButton,
  SearchBlock,
  SearchIcon,
  SearchInput,
  Stub,
} from 'components/common/ChooserStyles';
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

const AvatarStyled = styled(Avatar)`
  flex-shrink: 0;
  width: 30px;
  height: 30px;
`;

const AvatarSmall = styled(Avatar)`
  width: 30px;
  height: 30px;
  margin-left: 15px;
`;

const DropDownWrapper = styled.div`
  position: fixed;
  top: ${({ mobileTopOffset }) => mobileTopOffset}px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.white};
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

const DropDownItemButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  color: ${({ theme }) => theme.colors.black};
  text-align: left;

  ${is('isActive')`
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  `};

  &:hover {
    background-color: ${({ theme }) => theme.colors.chooseColor};
  }
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

    let avatar = null;
    let communityName = null;

    if (!community) {
      avatar = <Stub />;
      communityName = t('components.choose_community.select');
    } else if (community.communityId === 'FEED') {
      avatar = <AvatarStyled userId={authUserId} />;
      communityName = t('common.my_feed');
    } else {
      avatar = <AvatarStyled communityId={community.communityId} />;
      communityName = community.name;
    }

    return (
      <Wrapper ref={this.wrapperRef} className={className}>
        <Control disabled={disabled} onClick={disabled ? null : this.onControlClick}>
          {avatar}
          <Name>{communityName}</Name>
          {disabled ? null : (
            <>
              <OpenButton title={t('common.open')}>
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
                placeholder={t('components.choose_community.select')}
                value={searchText}
                autoFocus
                onChange={this.onSearchTextChange}
              />
              <CloseButton title={t('common.close')} onClick={this.close}>
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
                            <Name>
                              {itemCommunity.communityId === 'FEED'
                                ? t('common.my_feed')
                                : itemCommunity.name}
                            </Name>
                          </DropDownItemButton>
                        </DropDownItem>
                      ))}
                    </DropDownList>
                    {finalCommunities.length === 0 && !isLoading && isSearching ? (
                      <EmptyBlock>{t('components.choose_community.no_found')}</EmptyBlock>
                    ) : null}
                    {finalCommunities.length === 0 && !isLoading && !isSearching ? (
                      <EmptyBlock>{t('components.choose_community.empty')}</EmptyBlock>
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
