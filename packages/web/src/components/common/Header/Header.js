import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';
import { ToggleFeature } from '@flopflip/react-redux';

import { MainContainer, up } from '@commun/ui';

import { FEATURE_SEARCH } from 'shared/featureFlags';
import ScrollFix from 'components/common/ScrollFix';
import SearchPanel from 'components/common/SearchPanel';
import { Link } from 'components/links';
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
  transition: box-shadow 0.3s;

  ${up.tablet} {
    border-bottom: none;

    ${isNot('noShadow')`
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    `}
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
  width: 220px;
  margin-right: 20px;
  min-height: 100%;
  height: 100%;
  font-weight: bold;
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  padding: 6px 0;
  margin: -4px 2px 0 0;
  cursor: pointer;
`;

const Beta = styled.span`
  margin: -6px 0 0 5px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.blue};
`;

const Title = styled.span`
  margin-right: 4px;
  font-size: 19px;
  line-height: 1;
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

export default class Header extends PureComponent {
  static propTypes = {
    isHideHeader: PropTypes.bool.isRequired,
    isNeedToHideSignUp: PropTypes.bool,
    noShadow: PropTypes.bool,
  };

  static defaultProps = {
    noShadow: false,
    isNeedToHideSignUp: false,
  };

  // eslint-disable-next-line class-methods-use-this
  renderRight() {
    const { isNeedToHideSignUp } = this.props;

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
        <AuthBlock isNeedToHideSignUp={isNeedToHideSignUp} />
      </RightWrapper>
    );
  }

  render() {
    const { isHideHeader, noShadow } = this.props;

    if (isHideHeader) {
      return null;
    }

    return (
      <Wrapper>
        <FixedContainer noShadow={noShadow}>
          <ScrollFixStyled>
            <MainContainerStyled>
              <Content>
                <LeftContent>
                  <Link route="home" passHref>
                    <LogoLink>
                      <Title>commun</Title>
                      <Slash>/</Slash>
                      <Beta>beta</Beta>
                    </LogoLink>
                  </Link>
                </LeftContent>
                <ToggleFeature flag={FEATURE_SEARCH}>
                  <SearchPanel />
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
