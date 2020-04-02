import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Button } from '@commun/ui';
import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import PostCard from 'components/common/PostCard';

import { UserRowStyled, CommunityRowStyled, EmptyList } from '../common';

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

export default function SpecificResults({ type, items, isEmptyQuery, isMobile, onNeedLoadMore }) {
  const { t } = useTranslation();
  let renderItem;
  let emptyText = t('components.search.specific_results.hint');

  switch (type) {
    case 'profiles':
      renderItem = id => <UserRowStyled key={id} userId={id} />;
      break;
    case 'communities':
      renderItem = id => <CommunityRowStyled key={id} communityId={id} />;
      break;
    case 'posts':
      renderItem = id => <PostCard key={id} postId={id} />;

      break;
    default:
  }

  if (isEmptyQuery) {
    emptyText = t('components.search.specific_results.enter');
  }

  if (!items.length || (!isMobile && isEmptyQuery)) {
    return (
      <EmptyList headerText={t('components.search.specific_results.no_found')} subText={emptyText}>
        {!isEmptyQuery ? (
          <Link route="home" passHref>
            <Button primary>{t('components.search.specific_results.go_feed')}</Button>
          </Link>
        ) : null}
      </EmptyList>
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
  isMobile: PropTypes.bool.isRequired,

  onNeedLoadMore: PropTypes.func.isRequired,
};
