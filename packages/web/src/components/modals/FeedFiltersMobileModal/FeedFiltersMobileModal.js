import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { equals } from 'ramda';

import { Button, up } from '@commun/ui';
import { Icon } from '@commun/icons';
import { useTranslation } from 'shared/i18n';
import { TIMEFRAME_DAY, TIMEFRAME_MONTH, TIMEFRAME_WEEK, TIMEFRAME_ALL } from 'shared/constants';
import { Router } from 'shared/routes';

import AsyncAction from 'components/common/AsyncAction';
import { Wrapper, CloseButtonStyled } from '../common';

const WrapperStyled = styled(Wrapper)`
  flex-basis: 450px;
  height: auto;
  padding: 0;
  margin: auto 0 5px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 24px 24px 0 0;
  overflow: hidden;

  ${up.mobileLandscape} {
    margin: 0;
    padding: 0;
  }
`;

const Header = styled.header`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px 15px;
  background-color: #fff;
`;

const CloseButton = styled(CloseButtonStyled)`
  position: absolute;
  top: 14px;
  right: 15px;
  display: flex;
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ContentWrapper = styled.section`
  padding: 20px 15px 30px;
`;

const ModalName = styled.h3`
  font-size: 15px;
  line-height: 18px;
`;

const Menu = styled.ul`
  padding-bottom: 30px;
  border-radius: 10px;
  overflow: hidden;

  & > :not(:last-child) {
    margin-bottom: 2px;
  }
`;

const MenuItem = styled.li``;

const MenuAction = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 58px;
  padding: 17px 15px;
  background-color: #fff;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
`;

const ActiveIcon = styled(Icon).attrs({ name: 'checkbox-on' })`
  width: 24px;
  height: 24px;
`;

const SaveButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 70px;
  font-weight: bold;
  font-size: 15px;
  line-height: 18px;
`;

export default function FeedFiltersMobileModal({
  params,
  feedFilters,
  feedType,
  timeframe,
  fetchPosts,
  type,
  close,
}) {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState(type);
  const [activeTimeframe, setActiveTimeframe] = useState(timeframe);
  const [feedParams, setFeedParams] = useState({ feedType, feedSubType: type });
  const [isTouched, setTouched] = useState(false);
  const [isChanged, setChanged] = useState(false);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    const activeFilter = feedFilters.find(value => value.type === activeType);

    setFilter(activeFilter);
  }, [activeType, feedFilters]);

  function onFilterChange(e) {
    const { name } = e.target;
    const newFeedParams = { feedType, feedSubType: name };

    setActiveType(name);

    if (!equals(feedParams, newFeedParams)) {
      setChanged(true);
    }

    setTouched(true);
    setFeedParams(newFeedParams);
  }

  function onTimeframeChange(e) {
    const { name } = e.target;

    if (activeTimeframe !== name) {
      setChanged(true);
    }

    setActiveTimeframe(name);
    setFeedParams(prevState => ({ ...prevState, feedSubSubType: name }));
  }

  async function onSelectFilter() {
    if (filter?.intervals && isTouched) {
      await fetchPosts({
        ...params,
        activeType,
        activeTimeframe,
      });
    }

    Router.pushRoute('feed', { ...feedParams });
    close();
  }

  function renderFeedFilters() {
    return (
      <Menu>
        {feedFilters.map(({ type: desc }) => (
          <MenuItem key={desc}>
            <MenuAction name={desc} onClick={onFilterChange}>
              {t(`filters.type.${desc}`)}
              {activeType === desc ? <ActiveIcon /> : null}
            </MenuAction>
          </MenuItem>
        ))}
      </Menu>
    );
  }

  function renderTimeframeFilter() {
    return (
      <Menu>
        {filter?.intervals.map(value => (
          <MenuItem key={value}>
            <MenuAction name={value} onClick={onTimeframeChange}>
              {t(`filters.timeframe.${value}`)}
              {activeTimeframe === value ? <ActiveIcon /> : null}
            </MenuAction>
          </MenuItem>
        ))}
      </Menu>
    );
  }

  if (!feedFilters) {
    return null;
  }

  return (
    <WrapperStyled role="dialog">
      <Header>
        <ModalName>{t('modals.feed_filters_mobile.title')}</ModalName>
        <CloseButton onClick={close} />
      </Header>
      <ContentWrapper>
        {filter?.intervals && isTouched
          ? renderTimeframeFilter()
          : renderFeedFilters(feedFilters, activeType, t)}
        <AsyncAction onClickHandler={onSelectFilter}>
          <SaveButton primary disabled={!isTouched || !isChanged}>
            {t('common.save')}
          </SaveButton>
        </AsyncAction>
      </ContentWrapper>
    </WrapperStyled>
  );
}

FeedFiltersMobileModal.propTypes = {
  params: PropTypes.shape({
    userId: PropTypes.string,
  }).isRequired,
  feedFilters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  feedType: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  timeframe: PropTypes.oneOf([TIMEFRAME_DAY, TIMEFRAME_WEEK, TIMEFRAME_MONTH, TIMEFRAME_ALL]),

  fetchPosts: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

FeedFiltersMobileModal.defaultProps = {
  timeframe: TIMEFRAME_WEEK,
};
