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
  margin-bottom: 12px;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  margin: 0 0 0 12px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const List = styled.ul`
  margin: 0 0 15px;
`;

const ListItem = styled.li`
  margin-bottom: 5px;
`;

const StyledAnchor = styled.a`
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 0 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.31px;
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
      color: ${({ theme }) => theme.colors.contextBlue};
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
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const AvatarStyled = styled(Avatar)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const ItemText = styled.span`
  margin-top: -2px;
`;

const LinksList = props => {
  const { title, link, items, changeMenuStateHandler } = props;

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
      <List onClick={changeMenuStateHandler}>
        {items.map(({ desc, route, href, params, icon, index, avatar }) => {
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
                <StyledLink route={route} params={params} includeSubRoutes={!index}>
                  {inner}
                </StyledLink>
              ) : (
                <StyledAnchor href={href} target="_blank" rel="noopener noreferrer">
                  {inner}
                </StyledAnchor>
              )}
            </ListItem>
          );
        })}
      </List>
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
  ).isRequired,
  changeMenuStateHandler: PropTypes.func,
};

LinksList.defaultProps = {
  title: null,
  link: null,
  changeMenuStateHandler: null,
};

export default memo(LinksList);
