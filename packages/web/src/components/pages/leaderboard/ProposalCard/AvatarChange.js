import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useTranslation } from 'shared/i18n';

import ExpirationTime from 'components/pages/leaderboard/ProposalCard/common/ExpirationTime';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExpirationTimeStyled = styled(ExpirationTime)`
  margin: 0 0 10px;
`;

const AvatarsWrapper = styled.div`
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
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 15px;
  font-weight: 600;
`;

export default function AvatarChange({ change, expiration }) {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <ExpirationTimeStyled expiration={expiration} />
      <AvatarsWrapper>
        <AvatarCard>
          {change.old ? (
            <AvatarImage src={change.old} />
          ) : (
            <NoAvatar>{t('components.leaderboard.avatar_change.no_avatar')}</NoAvatar>
          )}
          <AvatarTitle>{t('components.leaderboard.avatar_change.old_avatar')}</AvatarTitle>
        </AvatarCard>
        <AvatarCard>
          <AvatarImage src={change.new} />
          <AvatarTitle>{t('components.leaderboard.avatar_change.new_avatar')}</AvatarTitle>
        </AvatarCard>
      </AvatarsWrapper>
    </Wrapper>
  );
}

AvatarChange.propTypes = {
  change: PropTypes.shape({
    old: PropTypes.string.isRequired,
    new: PropTypes.string.isRequired,
  }).isRequired,
  expiration: PropTypes.string.isRequired,
};
