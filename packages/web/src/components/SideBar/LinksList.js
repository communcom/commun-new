import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';

import { Icon } from '@commun/icons';

import activeLink from 'utils/hocs/activeLink';
import Avatar from 'components/Avatar';

const Title = styled.h2`
  display: flex;
  align-items: center;
  min-height: 40px;
  margin: 0 0 0 12px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.contextGrey};

  ${up('desktop')} {
    font-size: 11px;
  }
`;

const List = styled.ul`
  padding: 0 0 24px;
  margin: 0;
`;

const ListItem = styled.li``;

const StyledAnchor = styled.a`
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 0 12px;
  border-radius: 4px;
  transition: color 0.15s;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.31px;
  color: #000;
  cursor: pointer;

  &:hover,
  &:focus,
  &:hover > *,
  &:focus > * {
    color: ${({ theme }) => theme.colors.contextBlue};
  }

  ${is('active')`
    color: #000 !important;
    background-color: rgba(255, 255, 255, 0.8);

    & > * {
      color: ${({ theme }) => theme.colors.contextGrey} !important;
    }
  `};

  ${up('desktop')} {
    min-height: 40px;
    font-size: 13px;
  }
`;

const StyledLink = activeLink(StyledAnchor);

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
  margin-right: 12px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const AvatarStyled = styled(({ params, ...props }) =>
  params.communityId || params.community ? (
    <Avatar communityId={params.communityId || params.community} {...props} />
  ) : (
    <Avatar userId={params.userId || params.username} {...props} />
  )
)`
  width: 24px;
  height: 24px;
  margin-right: 12px;
`;

const LinksList = props => {
  const { title, section, changeMenuStateHandler } = props;
  return (
    <>
      {title ? <Title>{title}</Title> : null}
      <List onClick={changeMenuStateHandler}>
        {section.map(({ desc, route, href, params, icon, avatar }) => (
          <ListItem key={desc}>
            {route ? (
              <StyledLink route={route} params={params}>
                {icon ? <IconStyled name={icon} /> : null}
                {avatar ? <AvatarStyled params={params} /> : null}
                {desc}
              </StyledLink>
            ) : (
              <StyledAnchor href={href} target="_blank" rel="noopener noreferrer">
                {icon ? <IconStyled name={icon} /> : null}
                {avatar ? <AvatarStyled params={params} /> : null}
                {desc}
              </StyledAnchor>
            )}
          </ListItem>
        ))}
      </List>
    </>
  );
};

LinksList.propTypes = {
  section: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,

  changeMenuStateHandler: PropTypes.func,
};

LinksList.defaultProps = {
  title: null,
  changeMenuStateHandler: null,
};

export default memo(LinksList);
