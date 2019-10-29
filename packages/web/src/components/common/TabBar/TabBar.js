import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { isNil } from 'ramda';

import { up } from '@commun/ui';
import activeLink from 'utils/hocs/activeLink';

const Wrapper = styled.nav`
  height: 45px;
  background-color: #fff;
  overflow: hidden;

  ${is('addDefaultStyles')`
    ${up.mobileLandscape} {
      border-radius: 0 0 6px 6px;
    }
  `};

  ${up.tablet} {
    padding: 0 12px;
  }
`;

const Container = styled.ul`
  display: flex;
  overflow-x: scroll;
`;

const Tab = styled.li``;

const TabLink = activeLink(styled.a`
  position: relative;
  display: block;
  height: 45px;
  padding: 0 16px;
  line-height: 45px;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  ${({ active, theme }) =>
    active
      ? `
        color: #000;

        &::after {
          content: '';
          position: absolute;
          display: block;
          height: 2px;
          width: 10px;
          bottom: 1px;
          left: 50%;
          margin-left: -5px;
          background: ${theme.colors.blue};
          border-radius: 4px;
        }
        `
      : `
        &:hover,
        &:focus {
          color: #000;
        }
  `};
`);

export default class TabBar extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        route: PropTypes.string.isRequired,
        params: PropTypes.any,
      })
    ).isRequired,
    defaultParams: PropTypes.shape({}),
    stats: PropTypes.shape({}),
    isCommunity: PropTypes.bool,
    isOwner: PropTypes.bool,
    noBorder: PropTypes.bool,
    renderContainer: PropTypes.func,
    renderTabLink: PropTypes.func,
  };

  static defaultProps = {
    defaultParams: undefined,
    stats: null,
    isCommunity: false,
    isOwner: false,
    noBorder: false,
    renderContainer: null,
    renderTabLink: null,
  };

  filterTabs = () => {
    const { items, isOwner } = this.props;
    return isOwner ? items : items.filter(item => !item.isOwnerRequired);
  };

  render() {
    const {
      isCommunity,
      defaultParams,
      noBorder,
      stats,
      className,
      renderContainer,
      renderTabLink,
    } = this.props;

    const content = this.filterTabs().map(({ id, text, params, ...props }) => {
      let finalParams = params;
      const stat = stats && !isNil(stats[id]) ? `: ${stats[id]}` : '';

      if (defaultParams) {
        finalParams = {
          ...defaultParams,
          ...finalParams,
        };
      }

      const tabProps = {
        ...props,
        params: finalParams,
        isCommunity,
        children: `${text}${stat}`,
      };

      return (
        <Tab key={id}>{renderTabLink ? renderTabLink(tabProps) : <TabLink {...tabProps} />}</Tab>
      );
    });

    if (renderContainer) {
      return renderContainer({ children: content });
    }

    return (
      <Wrapper className={className} addDefaultStyles={!noBorder}>
        <Container>{content}</Container>
      </Wrapper>
    );
  }
}
