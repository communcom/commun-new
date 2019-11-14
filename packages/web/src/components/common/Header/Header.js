import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { ToggleFeature } from '@flopflip/react-redux';

import { MainContainer, Search, up } from '@commun/ui';

import ScrollFix from 'components/common/ScrollFix';
// TODO: пока закомментил функционал мобильного меню на случай возврата к нему в будущем
// import ActionButton from 'components/common/ActionButton';

import { Link } from 'components/links';

import { FEATURE_SEARCH } from 'shared/featureFlags';

import { HEADER_HEIGHT, HEADER_DESKTOP_HEIGHT } from './constants';

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
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};
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
  padding: 0 15px;

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

  ${up.desktop} {
    margin-right: 8px;
    font-size: 24px;
  }
`;

const Slash = styled.span`
  font-size: 24px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.blue};
  transform: translateY(2px);

  ${up.desktop} {
    font-size: 30px;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  min-height: 100%;
  padding-left: 10px;

  ${is('isSearchOpen')`
    margin-left: auto;
  `};

  ${up.desktop} {
    margin-left: auto;
  }
`;

const CustomSearch = styled(Search)`
  ${up.desktop} {
    width: 345px;
    height: 34px;
    margin-left: 112px;
    transition: width 0.15s;
  }

  svg {
    margin-top: 2px;
    width: 14px;
    height: 14px;
  }

  input {
    caret-color: ${({ theme }) => theme.colors.blue};

    &::placeholder {
      font-size: 12px;
      line-height: 16px;
    }
  }

  &:focus-within {
    ${up.desktop} {
      width: 502px;
    }
  }
`;

// const SearchIcon = styled(Icon)`
//   width: 24px;
//   height: 24px;
// `;

// const HamburgerButton = styled(ActionButton)`
//   margin-left: -10px;
//   color: #000;

//   ${up.tablet} {
//     display: none;
//   }
// `;

// const HamburgerIcon = styled(Icon)`
//   width: 24px;
//   height: 24px;
// `;

export default class Header extends PureComponent {
  static propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    // changeMenuStateHandler: PropTypes.func.isRequired,
  };

  state = {
    searchValue: '',
  };

  searchInputChangeHandler = e => {
    this.setState({
      searchValue: e.target.value,
    });
  };

  // eslint-disable-next-line class-methods-use-this
  renderRight() {
    // const { isDesktop } = this.props;

    return (
      <RightWrapper>
        {/* {isDesktop ? null : (
        <ActionButton
          type="button"
          aria-label="Search"
          name="header__search"
          onClick={this.toggleSearchInput}
        >
          <SearchIcon name="search" />
        </ActionButton>
        )}
        {isDesktop ? <AuthBlock /> : null} */}
        <AuthBlock />
      </RightWrapper>
    );
  }

  render() {
    const { isDesktop /* , changeMenuStateHandler */ } = this.props;
    const { searchValue } = this.state;

    return (
      <Wrapper>
        <FixedContainer>
          <ScrollFixStyled>
            <MainContainerStyled>
              <Content>
                {/* <HamburgerButton
                  aria-label="Menu"
                  name="header__menu"
                  onClick={changeMenuStateHandler}
                >
                  <HamburgerIcon name="menu" />
                </HamburgerButton> */}
                <LeftContent>
                  <LogoText>
                    <Link route="home" passHref>
                      <Title>commun</Title>
                    </Link>
                    <Slash>/</Slash>
                  </LogoText>
                </LeftContent>
                <ToggleFeature flag={FEATURE_SEARCH}>
                  {isDesktop ? (
                    <CustomSearch
                      label="Search"
                      type="search"
                      placeholder="Search..."
                      name="header__search-input"
                      value={searchValue}
                      autofocus={!isDesktop}
                      noBorder
                      inverted
                      onChange={this.searchInputChangeHandler}
                    />
                  ) : null}
                </ToggleFeature>
                {this.renderRight()}
              </Content>
            </MainContainerStyled>
          </ScrollFixStyled>
        </FixedContainer>
      </Wrapper>
    );
  }
}
