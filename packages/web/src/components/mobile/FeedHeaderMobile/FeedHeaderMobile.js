import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { up, CONTAINER_MAX_WIDTH, CONTAINER_OUTER_WIDTH } from '@commun/ui';
import { Icon } from '@commun/icons';
import activeLink from 'utils/hocs/activeLink';
import { FEED_TYPE_GROUP_TRENDING } from 'shared/constants';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 74px;
  padding: 0 15px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.blue};

  ${up.mobileLandscape} {
    margin: -20px -20px 10px;
  }

  ${up.desktop} {
    padding: 0 20px;
  }

  @media (min-width: ${CONTAINER_OUTER_WIDTH}px) {
    max-width: ${CONTAINER_MAX_WIDTH}px;
    padding: 24px 0;
  }
`;

const LinksWrapper = styled.div`
  flex: 1;

  & > :not(:last-child) {
    margin-right: 15px;
  }
`;

const Link = activeLink(styled.a`
  font-weight: bold;
  font-size: 21px;
  color: #b4bffa;

  ${is('active')`
    font-size: 30px;
    letter-spacing: 0.41px;
    color: #ffffff;
  `};
`);

// const IconWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-shrink: 0;
//   width: 34px;
//   height: 34px;
//   border-radius: 50%;
//   background-color: #778bf6;
// `;

export const IconStyled = styled(Icon).attrs({ name: 'filter' })`
  width: 34px;
  height: 34px;
  color: ${({ theme }) => theme.colors.white};
`;

const FeedHeaderMobile = ({ isAuthorized, isShowHeader }) => {
  if (!isShowHeader) {
    return null;
  }

  return (
    <Wrapper>
      <LinksWrapper>
        {isAuthorized ? (
          <Link route="home" includeRoute="/feed/my" index>
            My feed
          </Link>
        ) : null}
        <Link
          route="feed"
          includeRoute="/feed/trending"
          params={{
            feedType: FEED_TYPE_GROUP_TRENDING,
          }}
        >
          Trending
        </Link>
      </LinksWrapper>
      {/* <IconWrapper> */}
      {/*  <IconStyled /> */}
      {/* </IconWrapper> */}
    </Wrapper>
  );
};

FeedHeaderMobile.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  isShowHeader: PropTypes.bool.isRequired,
};

export default FeedHeaderMobile;
