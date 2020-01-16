import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { Link } from 'shared/routes';

import { up } from '@commun/ui';
import { Icon } from '@commun/icons';

import Content from 'components/common/Content';
import AuthGuard from 'components/common/AuthGuard';
import UsersBlacklist from 'components/blacklist/UsersBlacklist';
import CommunitiesBlacklist from 'components/blacklist/CommunitiesBlacklist';

const Wrapper = styled.div`
  flex-basis: 100%;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  ${up.tablet} {
    border-radius: 6px;
    overflow: hidden;
  }
`;

const Header = styled.header`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px 15px 10px;
  background-color: #fff;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;

  ${up.tablet} {
    justify-content: flex-start;
    padding: 15px;
    font-size: 17px;
    line-height: 23px;
  }
`;

const BackLink = styled.a`
  position: absolute;
  top: 10px;
  left: 0;
  display: flex;
  padding: 10px 20px;
  color: #000;
`;

const BackIcon = styled(Icon).attrs({ name: 'back' })`
  width: 12px;
  height: 20px;
`;

const MobileFilterWrapper = styled.div`
  display: flex;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: #fff;

  & > :not(:last-child) {
    margin-right: 5px;
  }

  ${up.tablet} {
    padding: 0 15px 15px;
    margin-bottom: 0;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 230px;
  padding: 5px 0;
  background-color: #fff;
  border-radius: 6px;
`;

const FilterButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 15px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 15px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  color: #000;
  transition: background-color 0.15s, color 0.15s;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.blue};
    color: #fff;
  }

  ${is('isActive')`
    background-color: ${({ theme }) => theme.colors.blue};
    color: #fff;
  `};

  ${up.desktop} {
    position: relative;
    justify-content: flex-start;
    width: 100%;
    font-size: 13px;
    line-height: 18px;
    border-radius: 0;
    background-color: #fff;
    color: #000;

    &:hover,
    &:focus {
      background-color: #fff;
      color: ${({ theme }) => theme.colors.blue};
    }

    ${is('isActive')`
      background-color: #fff;
      color: ${({ theme }) => theme.colors.blue};

      &::before {
        position: absolute;
        top: 50%;
        left: 0;
        content: '';
        display: block;
        width: 2px;
        height: 15px;
        background-color: ${({ theme }) => theme.colors.blue};
        border-radius: 2px;
        transform: translateY(-50%);
      }
    `};
  }
`;

const buttons = [
  {
    name: 'users',
    desc: 'Users',
  },
  {
    name: 'communities',
    desc: 'Communities',
  },
];

function Blacklist({ userId, isMobile, isDesktop }) {
  const [activeTab, setActiveTab] = useState('users');

  function onFilterChange(e) {
    setActiveTab(e.target.name);
  }

  function renderContent() {
    if (!userId) {
      return <AuthGuard />;
    }

    switch (activeTab) {
      case 'users':
        return <UsersBlacklist userId={userId} />;

      case 'communities':
        return <CommunitiesBlacklist userId={userId} />;

      default:
        return null;
    }
  }

  function renderFilters() {
    return buttons.map(({ name, desc }) => (
      <FilterButton key={name} name={name} isActive={activeTab === name} onClick={onFilterChange}>
        {desc}
      </FilterButton>
    ));
  }

  return (
    <Wrapper>
      <Content aside={() => <FilterWrapper>{renderFilters()}</FilterWrapper>}>
        <ContentWrapper>
          <Header>
            {isMobile ? (
              <Link route="home" passHref>
                <BackLink>
                  <BackIcon />
                </BackLink>
              </Link>
            ) : null}
            Blacklist
          </Header>
          {!isDesktop ? <MobileFilterWrapper>{renderFilters()}</MobileFilterWrapper> : null}
          {renderContent()}
        </ContentWrapper>
      </Content>
    </Wrapper>
  );
}

Blacklist.propTypes = {
  userId: PropTypes.string,
  isMobile: PropTypes.bool.isRequired,
  isDesktop: PropTypes.bool.isRequired,
};

Blacklist.defaultProps = {
  userId: null,
};

export default Blacklist;
