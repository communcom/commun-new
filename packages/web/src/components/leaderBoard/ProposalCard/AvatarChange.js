import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;

  & > :not(:last-child) {
    margin-right: 14px;
  }
`;

const AvatarCard = styled.div`
  display: flex;
  padding: 15px;
  flex: 1 0;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const AvatarImage = styled.img`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const NoAvatar = styled(AvatarImage).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarTitle = styled.span`
  margin-top: 10px;
  font-size: 15px;
  font-weight: 600;
`;

export default function AvatarChange({ change }) {
  return (
    <Wrapper>
      <AvatarCard>
        {change.old ? <AvatarImage src={change.old} /> : <NoAvatar>No image</NoAvatar>}
        <AvatarTitle>Old avatar</AvatarTitle>
      </AvatarCard>
      <AvatarCard>
        <AvatarImage src={change.new} />
        <AvatarTitle>New avatar</AvatarTitle>
      </AvatarCard>
    </Wrapper>
  );
}

AvatarChange.propTypes = {
  change: PropTypes.shape({
    old: PropTypes.string.isRequired,
    new: PropTypes.string.isRequired,
  }).isRequired,
};
