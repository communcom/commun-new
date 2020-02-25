import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';

import { Link } from 'shared/routes';
import activeLink from 'utils/hocs/activeLink';
import Avatar from 'components/common/Avatar';
import SeeAll from 'components/common/SeeAll';

const DEFAULT_ICON_SIZE = 24;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

export const List = styled.ul`
  margin: 0 0 15px;
`;

export const ListItem = styled.li`
  margin-bottom: 5px;
  overflow: hidden;
`;

export const StyledAnchor = styled.a`
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 0 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  color: #000;
  cursor: pointer;

  ${is('active')`
    background-color: #fff;
  `};

  ${isNot('active')`
    color: #000;

    &:hover,
    &:focus,
    &:hover > *,
    &:focus > * {
      color: ${({ theme }) => theme.colors.blue};
    }
  `};

  ${up.desktop} {
    min-height: 40px;
    font-size: 14px;
  }
`;

const StyledLink = activeLink(StyledAnchor);

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const AvatarStyled = styled(Avatar)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

export const ItemText = styled.span`
  white-space: nowrap;
  margin-top: -2px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function defaultRenderItems(items) {
  return items.map(({ desc, route, href, params, icon, index, includeRoute, avatar, onClick }) => {
    let pic;

    if (avatar) {
      pic = <AvatarStyled {...avatar} />;
    } else if (icon) {
      const width = icon.width || DEFAULT_ICON_SIZE;
      const height = icon.height || DEFAULT_ICON_SIZE;

      pic = (
        <IconWrapper>
          <Icon {...icon} width={width} height={height} />
        </IconWrapper>
      );
    } else {
      pic = null;
    }

    const inner = (
      <>
        {pic}
        <ItemText>{desc}</ItemText>
      </>
    );

    return (
      <ListItem key={desc}>
        {route ? (
          <StyledLink
            route={route}
            params={params}
            includeSubRoutes={!index}
            includeRoute={includeRoute}
            onClick={onClick}
          >
            {inner}
          </StyledLink>
        ) : (
          <StyledAnchor href={href} target="_blank" rel="noopener noreferrer">
            {inner}
          </StyledAnchor>
        )}
      </ListItem>
    );
  });
}

const LinksList = props => {
  const { title, link, items, name, renderItems } = props;

  let renderedItems;

  if (renderItems) {
    renderedItems = renderItems(items);
  } else {
    renderedItems = defaultRenderItems(items);
  }

  return (
    <>
      {title ? (
        <TitleWrapper>
          <Title>{title}</Title>
          {link ? (
            <Link {...link} passHref>
              <SeeAll />
            </Link>
          ) : null}
        </TitleWrapper>
      ) : null}
      <List name={name}>{renderedItems}</List>
    </>
  );
};

LinksList.propTypes = {
  title: PropTypes.string,
  link: PropTypes.shape({
    route: PropTypes.string.isRequired,
    params: PropTypes.shape({}),
  }),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      route: PropTypes.string.isRequired,
      params: PropTypes.object,
      desc: PropTypes.string.isRequired,
      index: PropTypes.bool,
      icon: PropTypes.shape({
        name: PropTypes.string.isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
      }),
      avatar: PropTypes.object,
    })
  ),
  name: PropTypes.string,
  renderItems: PropTypes.func,
  onClick: PropTypes.func,
};

LinksList.defaultProps = {
  title: null,
  link: null,
  items: null,
  name: undefined,
  renderItems: undefined,
  onClick: undefined,
};

export default memo(LinksList);
