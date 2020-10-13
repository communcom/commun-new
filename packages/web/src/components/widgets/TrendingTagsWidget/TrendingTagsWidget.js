import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import useUpdateEffect from 'utils/hooks/useUpdateEffect';

import { WidgetCard, WidgetHeader, WidgetList } from 'components/widgets/common';

const WidgetCardStyled = styled(WidgetCard)`
  margin-bottom: 10px;
  padding: 0;

  & > :last-child {
    padding: 0;
  }
`;

const WidgetHeaderStyled = styled(WidgetHeader)`
  padding: 0 15px;
`;

const RockerIcon = styled.div`
  width: 14px;
  height: 15px;
  margin-right: 5px;
  background: url('/images/rocket.png') 50% 50% no-repeat;
  background-size: 14px 15px;
`;

const WidgetListStyled = styled(WidgetList)`
  padding: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const TagWrapper = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  padding: 15px;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const TagInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TagName = styled.div`
  margin: 0 5px 5px 0;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.black};
`;
const TagCount = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
  text-transform: lowercase;
`;

const OpenCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  color: ${({ theme }) => theme.colors.gray};
`;

const ChevronIcon = styled(Icon).attrs({ name: 'chevron' })`
  transform: rotate(-90deg);
`;

const ShowMore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.blue};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGrayBlue};
  cursor: pointer;
`;

const TAGS_LIMIT = 5;

function TrendingTagsWidget({ initialTags, fetchTrendingTags }) {
  const { t } = useTranslation();
  const [tags, setTags] = useState(initialTags);
  const [offset, setOffset] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  const getTrendingTags = useCallback(async () => {
    const { items } = await fetchTrendingTags({ offset, limit: TAGS_LIMIT });

    const newTags = tags.concat(items);
    setTags(newTags);

    if (items.length < TAGS_LIMIT) {
      setIsEnd(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, fetchTrendingTags]);

  useEffect(() => {
    if (!tags.length) {
      getTrendingTags();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUpdateEffect(() => {
    getTrendingTags();
  }, [offset]);

  if (!tags.length) {
    return null;
  }

  const handleLoadMoreClick = async () => {
    setOffset(offset + TAGS_LIMIT);
  };

  return (
    <WidgetCardStyled>
      <WidgetHeaderStyled
        title={
          <>
            <RockerIcon /> {t('widgets.trending_tags.title')}
          </>
        }
      />
      <WidgetListStyled>
        {tags.map(tag => (
          <Link route="search" params={{ q: `${encodeURI('#')}${tag.name}` }} passHref>
            <TagWrapper key={tag.name}>
              <TagInfo>
                <TagName title={`#${tag.name}`}>#{tag.name}</TagName>
                <TagCount>
                  {tag.count} {t('common.counters.post', { count: parseFloat(tag.count) })}
                </TagCount>
              </TagInfo>
              <OpenCircle>
                <ChevronIcon />
              </OpenCircle>
            </TagWrapper>
          </Link>
        ))}
      </WidgetListStyled>
      {!isEnd ? <ShowMore onClick={handleLoadMoreClick}>{t('common.show_more')}</ShowMore> : null}
    </WidgetCardStyled>
  );
}

TrendingTagsWidget.propTypes = {
  initialTags: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      tag: PropTypes.string,
    })
  ),
  fetchTrendingTags: PropTypes.func.isRequired,
};

TrendingTagsWidget.defaultProps = {
  initialTags: [],
};

export default TrendingTagsWidget;
