import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { InvisibleText, up } from '@commun/ui';
import { Icon } from '@commun/icons';
import activeLink from 'utils/hocs/activeLink';
import { FEED_TYPE_GROUP_TRENDING } from 'shared/constants';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  height: 74px;
  padding: 0 15px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.blue};
  z-index: 25;

  ${up.mobileLandscape} {
    height: 94px;
    padding: 20px 35px 0;
    margin: -20px -20px 10px;
  }
`;

const Placeholder = styled.div`
  width: 100%;
  height: 74px;

  ${up.mobileLandscape} {
    height: 94px;
  }
`;

const LinksWrapper = styled.div`
  flex: 1;

  & > :not(:last-child) {
    margin-right: 15px;
  }
`;

const Anchor = styled.a`
  font-weight: 600;
  font-size: 21px;
  color: rgba(255, 255, 255, 0.5);

  ${is('active')`
    font-size: 30px;
    line-height: 41px;
    letter-spacing: 0.41px;
    color: #ffffff;
  `};
`;

const Link = activeLink(Anchor);

const FilterButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #778bf6;
  color: ${({ theme }) => theme.colors.white};
`;

export const IconStyled = styled(Icon).attrs({ name: 'filter' })`
  width: 24px;
  height: 24px;
`;

function FeedHeaderMobile({ params, isAuthorized, isShowHeader, openFiltersModal, className }) {
  function onOpenFiltersModal() {
    openFiltersModal(params);
  }

  function renderLinks() {
    if (isAuthorized) {
      return (
        <>
          <Link route="home" includeRoute="/feed" index>
            My feed
          </Link>
          <Link
            route="feed"
            includeRoute="/trending"
            params={{
              feedType: FEED_TYPE_GROUP_TRENDING,
            }}
          >
            Trending
          </Link>
        </>
      );
    }

    return (
      <Link route="home" includeRoute="/trending">
        Trending
      </Link>
    );
  }

  if (!isShowHeader) {
    return null;
  }

  return (
    <>
      <Wrapper className={className}>
        <LinksWrapper>{renderLinks(isAuthorized)}</LinksWrapper>
        <FilterButton onClick={onOpenFiltersModal}>
          <InvisibleText>Filters</InvisibleText>
          <IconStyled />
        </FilterButton>
      </Wrapper>
      <Placeholder />
    </>
  );
}

FeedHeaderMobile.propTypes = {
  params: PropTypes.shape({
    userId: PropTypes.string,
  }).isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  isShowHeader: PropTypes.bool.isRequired,

  openFiltersModal: PropTypes.func.isRequired,
};

export default FeedHeaderMobile;
