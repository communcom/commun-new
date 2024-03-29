import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';

const Wrapper = styled.nav`
  ${is('isPanel')`
    padding: 5px 0;
    border-radius: 6px;
    background-color: ${({ theme }) => theme.colors.white};
  `};

  ${isNot('isPanel')`
    overflow: hidden;
  `};
`;

const List = styled.ul`
  ${is('isRow')`
    display: flex;
    overflow-x: scroll;
  `};
`;

const SubList = styled(List)`
  margin-top: 8px;
`;

const Item = styled.li`
  ${is('isRow')`
    &:not(:last-child) {
      margin-right: 5px;
    }
  `};
`;

const LineLink = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 15px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  cursor: pointer;

  ${is('isSubLink')`
    padding-left: 35px;
    color: ${({ theme }) => theme.colors.gray};
  `};

  ${is('active')`
    ${is('isSubLink')`
      color: ${({ theme }) => theme.colors.blue};
    `}

    ${isNot('isSubLink')`
      background-color: ${({ theme }) => theme.colors.lighterGray};

      &::after {
        position: absolute;
        content: '';
        left: 0;
        top: 50%;
        width: 2px;
        height: 15px;
        margin-top: -7px;
        border-radius: 1px;
        background-color: ${({ theme }) => theme.colors.blue};
      }
    `};
  `};
`;

const TagLink = styled.a`
  display: block;
  height: 34px;
  line-height: 32px;
  padding: 0 15px;
  border-radius: 17px;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  ${is('isSubLink')`
    ${isNot('isRow')`
      padding-left: 35px;
    `}

    color: ${({ theme }) => theme.colors.gray};
  `};

  ${is('active')`
    color: #fff;
    background-color: ${({ theme }) => theme.colors.blue};
  `};
`;

export default function SideBarNavigation({
  className,
  sectionKey,
  subSectionKey,
  items,
  additionalParams,
  tabsLocalePath,
  isRow,
  localeFiles,
  featureFlags,
  isMobile,
}) {
  const { t } = useTranslation(localeFiles);
  const ItemComponent = isRow ? TagLink : LineLink;
  const router = useRouter();
  const { query } = router;

  function checkIsLinkActive(params, isSubLink, isIndex, id, defaultTab) {
    if (isSubLink) {
      if (
        sectionKey &&
        subSectionKey &&
        params[sectionKey] === query[sectionKey] &&
        params[subSectionKey] === query[subSectionKey]
      ) {
        return true;
      }

      if (subSectionKey && !query[subSectionKey] && id === defaultTab) {
        return true;
      }

      return false;
    }

    if (isIndex && sectionKey && params[sectionKey] === query[sectionKey]) {
      return true;
    }

    if (isIndex && !query[sectionKey] && !query[subSectionKey]) {
      return true;
    }

    return sectionKey && params[sectionKey] === query[sectionKey] && !query[subSectionKey];
  }

  function renderLink(link, isSubLink, defaultTab) {
    const { id, featureName, tabLocaleKey, route, params, index } = link;

    if (featureFlags && featureFlags[featureName] === false) {
      return null;
    }

    return (
      <Item key={tabLocaleKey} isRow={isRow}>
        <Link route={route} params={{ ...additionalParams, ...params }} passHref>
          <ItemComponent
            active={checkIsLinkActive(params, isSubLink, index, id, defaultTab)}
            isSubLink={isSubLink}
            isRow={isMobile}
          >
            {t(`${tabsLocalePath}.${tabLocaleKey}`)}
          </ItemComponent>
        </Link>
      </Item>
    );
  }

  function renderWithSubLinks(subLink, defaultTab, index) {
    const { featureName, tabLocaleKey, route, params, subRoutes } = subLink;

    if (featureFlags && featureFlags[featureName] === false) {
      return null;
    }

    return (
      <Item key={tabLocaleKey}>
        <Link route={route} params={{ ...additionalParams, ...params }} passHref>
          <ItemComponent active={checkIsLinkActive(params, false, index)} isIndex>
            {t(`${tabsLocalePath}.${tabLocaleKey}`)}
          </ItemComponent>
        </Link>
        {params[sectionKey] === query[sectionKey || index] ? (
          <List>
            {subRoutes.map(subRoute => renderLink({ ...subRoute, route }, true, defaultTab))}
          </List>
        ) : null}
      </Item>
    );
  }

  function renderWithSubLinksMobile(subLink, defaultTab, index) {
    const { featureName, tabLocaleKey, route, params, subRoutes } = subLink;

    if (featureFlags && featureFlags[featureName] === false) {
      return null;
    }

    return (
      <Item key={tabLocaleKey}>
        {params[sectionKey] === query[sectionKey || index] ? (
          <SubList isRow>
            {subRoutes.map(subRoute => renderLink({ ...subRoute, route }, true, defaultTab))}
          </SubList>
        ) : null}
      </Item>
    );
  }

  return (
    <Wrapper className={className} isPanel={!isRow}>
      <List isRow={isRow}>
        {items.map(({ subRoutes, defaultTab, ...otherParams }) =>
          subRoutes && !isMobile
            ? renderWithSubLinks({ subRoutes, ...otherParams }, defaultTab, otherParams.index)
            : renderLink({ ...otherParams })
        )}
      </List>
      {isMobile ? (
        <List isRow>
          {items
            .filter(item => item.subRoutes)
            .map(({ subRoutes, defaultTab, ...otherParams }) =>
              renderWithSubLinksMobile({ subRoutes, ...otherParams }, defaultTab, otherParams.index)
            )}
        </List>
      ) : null}
    </Wrapper>
  );
}

SideBarNavigation.propTypes = {
  tabsLocalePath: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      tabLocaleKey: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      params: PropTypes.object,
    })
  ).isRequired,
  additionalParams: PropTypes.object,
  sectionKey: PropTypes.string,
  subSectionKey: PropTypes.string,
  isRow: PropTypes.bool,
  localeFiles: PropTypes.arrayOf(PropTypes.string),
  featureFlags: PropTypes.object.isRequired,
  isMobile: PropTypes.bool,
};

SideBarNavigation.defaultProps = {
  additionalParams: undefined,
  isRow: false,
  sectionKey: undefined,
  subSectionKey: undefined,
  localeFiles: [],
  isMobile: false,
};
