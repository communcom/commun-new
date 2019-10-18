import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';
import { up } from 'styled-breakpoints';

import { Icon } from '@commun/icons';

import { Link } from 'shared/routes';
import activeLink from 'utils/hocs/activeLink';
import Avatar from 'components/Avatar';

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
  color: ${({ theme }) => theme.colors.contextGreySecond};
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

  ${up('desktop')} {
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
  color: ${({ theme }) => theme.colors.contextGreySecond};
`;

const AvatarStyled = styled(Avatar)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const ItemText = styled.span`
  margin-top: -2px;
`;

const SeeAll = styled.a`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

const LinksList = props => {
  const { title, link, section, changeMenuStateHandler } = props;

  return (
    <>
      {title ? (
        <TitleWrapper>
          <Title>{title}</Title>
          {link ? (
            <Link {...link} passHref>
              <SeeAll>see all</SeeAll>
            </Link>
          ) : null}
        </TitleWrapper>
      ) : null}
      <List onClick={changeMenuStateHandler}>
        {section.map(({ desc, route, href, params, icon, avatar }) => {
          let pic;

          if (avatar) {
            pic = <AvatarStyled {...avatar} />;
          } else if (icon) {
            pic = (
              <IconWrapper>
                <Icon {...icon} />
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
                <StyledLink route={route} params={params}>
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
  section: PropTypes.arrayOf(
    PropTypes.shape({
      route: PropTypes.string.isRequired,
      params: PropTypes.object,
      desc: PropTypes.string.isRequired,
      icon: PropTypes.shape({
        name: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }),
      avatar: PropTypes.object,
    })
  ).isRequired,
  title: PropTypes.string,
  link: PropTypes.shape({
    route: PropTypes.string.isRequired,
    params: PropTypes.shape({}),
  }),
  changeMenuStateHandler: PropTypes.func,
};

LinksList.defaultProps = {
  title: null,
  link: null,
  changeMenuStateHandler: null,
};

export default memo(LinksList);
