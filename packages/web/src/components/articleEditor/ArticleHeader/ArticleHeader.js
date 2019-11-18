import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { userType } from 'types';
import { Button } from '@commun/ui';
import Avatar from 'components/common/Avatar';
import ChooseCommunity from 'components/common/ChooseCommunity';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 90px;
`;

const AuthorBlock = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const AvatarStyled = styled(Avatar)`
  width: 50px;
  height: 50px;
  flex-shrink: 0;
`;

const UserName = styled.span`
  margin: -1px 0 1px 10px;
`;

const PostButton = styled(Button)`
  margin-left: 25px;
`;

export default function ArticleHeader({ user, communityId: initialCommunityId, className }) {
  const [communityId, setCommunityId] = useState(initialCommunityId);

  return (
    <Wrapper className={className}>
      <AuthorBlock>
        <AvatarStyled userId={user.userId} />
        <UserName>{user.username}</UserName>
      </AuthorBlock>
      <ChooseCommunity communityId={communityId} onSelect={setCommunityId} />
      <PostButton primary small>
        Post
      </PostButton>
    </Wrapper>
  );
}

ArticleHeader.propTypes = {
  user: userType.isRequired,
  communityId: PropTypes.string,
};

ArticleHeader.defaultProps = {
  communityId: null,
};
