import React from 'react';
import { injectFeatureToggles } from '@flopflip/react-redux';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { FEATURE_TAGS } from 'shared/featureFlags';
import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

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
  margin-right: 5px;
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
`;

const TagName = styled.div`
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.black};
`;
const TagCount = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
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

const tags = [
  {
    name: '#Politics',
    count: '12 324 posts',
  },
  {
    name: '#Coronavirus',
    count: '9 846 posts',
  },
  {
    name: '#Photography',
    count: '7 445 posts',
  },
  {
    name: '#Blockchain',
    count: '1 324 posts',
  },
];

function TagsWidget({ featureToggles }) {
  const { t } = useTranslation();

  if (!featureToggles[FEATURE_TAGS]) {
    return null;
  }

  return (
    <WidgetCardStyled>
      <WidgetHeaderStyled
        title={
          <>
            <RockerIcon>🚀</RockerIcon> Trending tags
          </>
        }
      />
      <WidgetListStyled>
        {tags.map(tag => (
          <Link route="search" params={{ q: encodeURI(`#${tag.name}`) }} passHref>
            <TagWrapper>
              <TagInfo>
                <TagName>{tag.name}</TagName>
                <TagCount>{tag.count}</TagCount>
              </TagInfo>
              <OpenCircle>
                <ChevronIcon />
              </OpenCircle>
            </TagWrapper>
          </Link>
        ))}
      </WidgetListStyled>
      <ShowMore>Show more</ShowMore>
    </WidgetCardStyled>
  );
}

export default injectFeatureToggles([FEATURE_TAGS])(withRouter(TagsWidget));
