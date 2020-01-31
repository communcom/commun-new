import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import PostCard from 'components/common/PostCard';

import { UserRowStyled, CommunityRowStyled, NoResults } from '../common';

const Wrapper = styled.div``;

const ContentWrapper = styled.div`
  padding: 10px 0;

  ${is('addTopBorder')`
    padding: 0;

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 5px;
      margin-bottom: -5px;
      background-color: #fff;
    }
  `};
`;

export default function SpecificResults({ type, items, isEmptyQuery, onNeedLoadMore }) {
  let renderItem;
  let emptyText;

  switch (type) {
    case 'profiles':
      renderItem = id => <UserRowStyled key={id} userId={id} />;
      emptyText = 'User is not found';
      break;
    case 'communities':
      renderItem = id => <CommunityRowStyled key={id} communityId={id} />;
      emptyText = 'Community is not found';
      break;
    case 'posts':
      renderItem = id => <PostCard key={id} postId={id} />;
      emptyText = 'No one post is found';
      break;
    default:
  }

  if (isEmptyQuery) {
    emptyText = 'Please enter search query';
  }

  if (!items.length) {
    return (
      <Wrapper>
        <NoResults>{emptyText}</NoResults>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ContentWrapper addTopBorder={type === 'posts'}>
        <InfinityScrollHelper onNeedLoadMore={onNeedLoadMore}>
          {items.map(renderItem)}
        </InfinityScrollHelper>
      </ContentWrapper>
    </Wrapper>
  );
}

SpecificResults.propTypes = {
  type: PropTypes.oneOf(['profiles', 'communities', 'posts']).isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  isEmptyQuery: PropTypes.bool.isRequired,
  onNeedLoadMore: PropTypes.func.isRequired,
};
