import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import Avatar from 'components/common/Avatar';

const Wrapper = styled.div`
  ${is('isCompact')`
    margin-bottom: 27px;
  `};
`;

const ListContainer = styled.ul`
  ${is('isCompact')`
    display: flex;
    flex-direction: row;
  `};
`;

const ListItem = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 24px;
`;

const AvatarWrapper = styled.div`
  width: 40px;
  height: 40px;

  ${is('isCompact')`
    margin-right: 12px;
    margin-top: 29px;
  `};
`;

const ListItemInfo = styled.div`
  margin-left: 10px;
  height: 39px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #000;
`;

const UserPost = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

export default class UsersList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string,
      })
    ).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    isEnd: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    isLoading: PropTypes.bool.isRequired,
    isCompact: PropTypes.bool,
  };

  static defaultProps = {
    isCompact: false,
  };

  render() {
    const { isCompact, items } = this.props;

    return (
      <Wrapper isCompact={isCompact}>
        <ListContainer isCompact={isCompact}>
          {items.map(item => {
            if (isCompact) {
              return (
                <AvatarWrapper key={item.username} isCompact={isCompact}>
                  <Avatar />
                </AvatarWrapper>
              );
            }

            return (
              <ListItem key={item.username}>
                <AvatarWrapper>
                  <Avatar />
                </AvatarWrapper>
                <ListItemInfo>
                  <UserName>{item.username}</UserName>
                  <UserPost>{item.user_post}</UserPost>
                </ListItemInfo>
              </ListItem>
            );
          })}
        </ListContainer>
      </Wrapper>
    );
  }
}
