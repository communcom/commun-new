import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Avatar from 'components/common/Avatar';

const AvatarStyled = styled(Avatar)`
  margin-right: ${({ inPost }) => (inPost ? 16 : 10)}px;
`;

export default function CommentAvatar({ userId, inPost, isShow }) {
  if (!isShow) {
    return null;
  }

  return <AvatarStyled userId={userId} useLink inPost={inPost} />;
}

CommentAvatar.propTypes = {
  userId: PropTypes.string.isRequired,
  inPost: PropTypes.bool,
  isShow: PropTypes.bool.isRequired,
};

CommentAvatar.defaultProps = {
  inPost: false,
};
