import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { ToggleFeature } from '@flopflip/react-redux';

import { animations, MainContainer, Search, up } from '@commun/ui';
import { Icon } from '@commun/icons';

import { communityType } from 'types/common';
import ScrollFix from 'components/common/ScrollFix';
import ActionButton from 'components/common/ActionButton';
import { Link } from 'components/links';

import { FEATURE_SEARCH } from 'shared/featureFlags';

import { HEADER_HEIGHT, HEADER_DESKTOP_HEIGHT } from './constants';

import Dropdown from './Dropdown';
import AuthBlock from '../AuthBlock';

const Wrapper = styled.header`
  position: relative;
  height: ${HEADER_HEIGHT}px;

  ${up.desktop} {
    height: ${HEADER_DESKTOP_HEIGHT}px;
  }
`;

const FixedContainer = styled.div`
  position: fixed;
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  background-color: #fff;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
  z-index: 15;

  ${up.tablet} {
    border-bottom: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }

  ${up.desktop} {
    height: ${HEADER_DESKTOP_HEIGHT}px;
  }
`;

const ScrollFixStyled = styled(ScrollFix)`
  height: 100%;
`;

const MainContainerStyled = styled(MainContainer)`
  height: 100%;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 16px;

  ${is('isSearchOpen')`
    justify-content: flex-start;
  `};

  ${up.mobileLandscape} {
    padding: 0;
  }

  ${up.desktop} {
    justify-content: flex-start;
  }
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  min-height: 100%;
  height: 100%;
  margin-left: 14px;
  font-weight: bold;
`;

const LogoText = styled.span`
  display: flex;
  align-items: center;
  margin-top: -4px;
  margin-right: 2px;
`;

const Title = styled.a`
  margin-right: 5px;
  font-size: 19px;
  line-height: 1;
  cursor: pointer;
  color: #000;

  ${is('community')`
    color: ${({ theme }) => theme.colors.gray};
  `};

  ${up.desktop} {
    margin-right: 8px;
    font-size: 24px;
  }
`;

const Slash = styled.span`
  font-size: 24px;
  line-height: 1;
  color: ${({ color, theme }) => color || theme.colors.blue};
  transform: translateY(2px);

  ${up.desktop} {
    font-size: 30px;
  }
`;

const Community = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
`;

const CommunityText = styled.p`
  color: #000;
`;

const DropdownIcon = styled(Icon)`
  width: 12px;
  height: 6px;
  margin-left: 8px;
`;

const RightWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  min-height: 100%;
  padding-left: 10px;
  overflow: hidden;

  ${is('isSearchOpen')`
    margin-left: auto;
  `};

  ${up.desktop} {
    margin-left: auto;
  }
`;

const CustomSearch = styled(Search)`
  width: 40%;
  height: 100%;
  min-height: 100%;
  margin: 0 16px;

  ${up.desktop} {
    flex-grow: 1;
    width: auto;
    margin: 0 32px 0 34px;
  }

  input {
    padding: 22px 0 21px;
    caret-color: ${({ theme }) => theme.colors.blue};
  }
`;

const SearchIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const HamburgerButton = styled(ActionButton)`
  margin-left: -10px;
  color: #000;

  ${up.tablet} {
    display: none;
  }
`;

const HamburgerIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`;

export default class Header extends PureComponent {
  static propTypes = {
    community: communityType,
    communityColor: PropTypes.string,
    isDesktop: PropTypes.bool.isRequired,
    changeMenuStateHandler: PropTypes.func.isRequired,
  };

  static defaultProps = {
    community: null,
    communityColor: null,
  };

  state = {
    searchValue: '',
    isDropdownOpen: false,
    isHideDropdownAnim: false,
    isSearchFieldOpen: false,
  };

  searchInputChangeHandler = e => {
    this.setState({
      searchValue: e.target.value,
    });
  };

  toggleDropdownChooser = () => {
    const { isDropdownOpen } = this.state;
    this.toggleWithAnimation(isDropdownOpen, 'isDropdownOpen', 'isHideDropdownAnim');
  };

  toggleSearchInput = () => {
    const { isSearchFieldOpen } = this.state;
    this.toggleWithAnimation(isSearchFieldOpen, 'isSearchFieldOpen', 'isHideSearchAnim');
  };

  toggleWithAnimation(isElemOpen, elemName, hideAnimName) {
    if (!isElemOpen) {
      this.setState({ [elemName]: true });
    } else {
      this.setState({ [hideAnimName]: true }, () => {
        setTimeout(
          () =>
            this.setState({
              [elemName]: false,
              [hideAnimName]: false,
            }),
          animations.ANIMATION_DURATION_HEADER
        );
      });
    }
  }

  renderRight() {
    const { isDesktop } = this.props;
    const { isSearchFieldOpen } = this.state;

    return (
      <RightWrapper isSearchOpen={isSearchFieldOpen}>
        {isDesktop ? null : (
          <ActionButton
            type="button"
            aria-label="Search"
            name="header__search"
            onClick={this.toggleSearchInput}
          >
            <SearchIcon name="search" />
          </ActionButton>
        )}
        {isDesktop ? <AuthBlock /> : null}
      </RightWrapper>
    );
  }

  render() {
    const { community, communityColor, changeMenuStateHandler, isDesktop } = this.props;
    const { isDropdownOpen, isHideDropdownAnim, isSearchFieldOpen, searchValue } = this.state;

    return (
      <Wrapper>
        <FixedContainer>
          <ScrollFixStyled>
            <MainContainerStyled>
              <Content isSearchOpen={isSearchFieldOpen}>
                <HamburgerButton
                  aria-label="Menu"
                  name="header__menu"
                  onClick={changeMenuStateHandler}
                >
                  <HamburgerIcon name="menu" />
                </HamburgerButton>
                <LeftContent>
                  <LogoText>
                    <Link route="home" passHref>
                      <Title community={community ? 1 : 0}>
                        {!isDesktop && (community || isSearchFieldOpen) ? 'c' : 'commun'}
                      </Title>
                    </Link>
                    <Slash color={community ? communityColor : null}>/</Slash>
                  </LogoText>
                  {community && (
                    <Community onClick={this.toggleDropdownChooser}>
                      {isSearchFieldOpen && !isDesktop ? null : (
                        <CommunityText>{community.name}</CommunityText>
                      )}
                      <DropdownIcon name="dropdown" />
                    </Community>
                  )}
                </LeftContent>
                <ToggleFeature flag={FEATURE_SEARCH}>
                  {isDesktop || (!isDesktop && isSearchFieldOpen) ? (
                    <CustomSearch
                      label="Search"
                      type="search"
                      placeholder="Search..."
                      name="header__search-input"
                      value={searchValue}
                      autofocus={!isDesktop}
                      noBorder
                      onChange={this.searchInputChangeHandler}
                    />
                  ) : null}
                </ToggleFeature>
                {this.renderRight()}
              </Content>
              {isDropdownOpen && (
                <Dropdown
                  toggleDropdownChooser={this.toggleDropdownChooser}
                  isOpenDropdownAnim={isDropdownOpen}
                  isHideDropdownAnim={isHideDropdownAnim}
                />
              )}
            </MainContainerStyled>
          </ScrollFixStyled>
        </FixedContainer>
      </Wrapper>
    );
  }
}
