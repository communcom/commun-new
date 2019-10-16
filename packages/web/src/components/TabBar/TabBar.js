import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';

import activeLink from 'utils/hocs/activeLink';

const Wrapper = styled.nav`
  height: 50px;
  background: #fff;
  overflow: hidden;

  ${is('addDefaultStyles')`
    border-top: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
    
    ${up('mobileLandscape')} {
      border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
      border-radius: 0 0 4px 4px;
    }
  `};

  ${up('tablet')} {
    padding: 0 12px;
  }
`;

const Container = styled.ul`
  display: flex;
  height: 70px;
  overflow-x: scroll;
`;

const Tab = styled.li``;

const TabLink = activeLink(styled.a`
  display: block;
  height: 48px;
  padding: 0 16px;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
  line-height: 44px;
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.contextGrey};
  transition: color 0.15s;

  ${({ active, theme, isCommunity }) =>
    active
      ? `border-bottom-color: ${
          isCommunity ? theme.colors.communityColor : theme.colors.contextBlue
        };`
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
    className: PropTypes.string,
    isCommunity: PropTypes.bool,
    isOwner: PropTypes.bool,
    noBorder: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    defaultParams: undefined,
    isCommunity: false,
    isOwner: false,
    noBorder: false,
  };

  filterTabs = () => {
    const { items, isOwner } = this.props;
    return isOwner ? items : items.filter(item => !item.isOwnerRequired);
  };

  render() {
    const { className, isCommunity, defaultParams, noBorder } = this.props;

    return (
      <Wrapper className={className} addDefaultStyles={!noBorder}>
        <Container>
          {this.filterTabs().map(({ text, params, ...props }) => {
            let finalParams = params;

            if (defaultParams) {
              finalParams = {
                ...defaultParams,
                ...finalParams,
              };
            }
            return (
              <Tab key={text}>
                <TabLink {...props} params={finalParams} isCommunity={isCommunity}>
                  {text}
                </TabLink>
              </Tab>
            );
          })}
        </Container>
      </Wrapper>
    );
  }
}
