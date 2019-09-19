import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Icon } from '@commun/icons';

import { postType, communityType, userType } from 'types/common';
import { Link } from 'shared/routes';
import Avatar from 'components/Avatar';
import ContextMenu, { ContextMenuItem } from 'components/ContextMenu';
import { SHOW_MODAL_POST_EDIT } from 'store/constants';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px 0;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
`;

const AvatarWrapper = styled.div`
  display: flex;
`;

const Info = styled.div`
  margin-left: 16px;
`;

const CommunityName = styled.a`
  font-size: 15px;
  font-weight: bold;
  letter-spacing: -0.3px;
  color: #000000;
`;

const SubInfo = styled.div`
  margin-top: 4px;
  font-size: 13px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const Timestamp = styled.span``;

const Author = styled.a`
  color: ${({ theme }) => theme.colors.contextBlue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  margin-right: -8px;
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: ${({ theme }) => theme.colors.contextGrey};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlue};
  }
`;

const MoreIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`;

export default class PostCardHeader extends Component {
  static propTypes = {
    post: postType.isRequired,
    community: communityType.isRequired,
    user: userType,
    isOwner: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: null,
  };

  showEditPostModal = () => {
    const { openModal, post } = this.props;
    openModal(SHOW_MODAL_POST_EDIT, { contentId: post.contentId });
  };

  render() {
    const { post, community, user, isOwner } = this.props;

    return (
      <Wrapper>
        <Left>
          <AvatarWrapper>
            <Avatar communityId={community.id} />
          </AvatarWrapper>
          <Info>
            <Link route="community" params={{ communityId: community.id }} passHref>
              <CommunityName>{community.name}</CommunityName>
            </Link>
            <SubInfo>
              <Timestamp>{dayjs(post.meta.time).fromNow()}</Timestamp>
              {user ? (
                <>
                  {' by '}
                  <Link route="profile" params={{ userId: user.id }} passHref>
                    <Author>{user.username}</Author>
                  </Link>
                </>
              ) : null}
            </SubInfo>
          </Info>
        </Left>
        <Right>
          {isOwner ? (
            <ContextMenu
              align="right"
              handler={props => (
                <Action name="post-card__more-actions" aria-label="More actions" {...props}>
                  <MoreIcon name="more" />
                </Action>
              )}
              items={() => (
                <>
                  {isOwner ? (
                    <ContextMenuItem name="post-card__edit-post" onClick={this.showEditPostModal}>
                      Edit
                    </ContextMenuItem>
                  ) : null}
                </>
              )}
            />
          ) : null}
        </Right>
      </Wrapper>
    );
  }
}
