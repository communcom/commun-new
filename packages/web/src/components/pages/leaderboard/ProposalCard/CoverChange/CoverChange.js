import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { up } from '@commun/ui';

import { useTranslation } from 'shared/i18n';
import { proxifyImageUrl } from 'utils/images/proxy';

import ExpirationTime from 'components/pages/leaderboard/ProposalCard/common/ExpirationTime';

const Wrapper = styled.div``;

const ExpirationTimeStyled = styled(ExpirationTime)`
  margin: 0 0 10px;
`;

const BigImageContainer = styled.div`
  margin-bottom: 15px;
`;

const CoverImages = styled.div`
  padding: 0 4px;
  margin-bottom: 5px;

  & > :not(:last-child) {
    margin-bottom: 15px;
  }

  ${up.tablet} {
    display: flex;

    & > :not(:last-child) {
      margin-bottom: 0;
      margin-right: 22px;
    }
  }
`;

const CoverCard = styled.div`
  display: flex;
  flex: 1 0;
  flex-direction: column;
  align-items: center;
  user-select: none;

  ${is('onClick')`
    ${up.tablet} {
      cursor: pointer;
    }
  `};
`;

const CoverImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 31.91489361%;

  ${is('isActive')`
    &::before {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 2px solid #b4bffa;
      border-radius: 10px;
      user-select: none;
      pointer-events: none;
    }

    &::after {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 1px solid ${({ theme }) => theme.colors.blue};
      border-radius: 10px;
      user-select: none;
      pointer-events: none;
    }
  `};
`;

const CoverImage = styled.img`
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
`;

const CoverImageBig = styled(CoverImage)`
  border-radius: 10px;
`;

const NoImage = styled(CoverImage).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CoverTitle = styled.span`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
`;

export default function AvatarChange({ change, screenType, expiration }) {
  const { t } = useTranslation();
  const [newImage, setImage] = useState(true);

  return (
    <Wrapper>
      <ExpirationTimeStyled expiration={expiration} />
      {screenType === 'tablet' || screenType === 'desktop' ? (
        <BigImageContainer>
          <CoverImageWrapper>
            <CoverImageBig src={proxifyImageUrl(newImage ? change.new : change.old)} />
          </CoverImageWrapper>
        </BigImageContainer>
      ) : null}
      <CoverImages>
        <CoverCard onClick={change.old ? () => setImage(false) : null}>
          <CoverTitle>{t('components.leaderboard.cover_change.old_cover')}</CoverTitle>
          <CoverImageWrapper isActive={!newImage}>
            {change.old ? (
              <CoverImage src={proxifyImageUrl(change.old)} />
            ) : (
              <NoImage>{t('components.leaderboard.cover_change.no_cover')}</NoImage>
            )}
          </CoverImageWrapper>
        </CoverCard>
        <CoverCard onClick={change.old ? () => setImage(true) : null}>
          <CoverTitle>{t('components.leaderboard.cover_change.new_cover')}</CoverTitle>
          <CoverImageWrapper isActive={newImage}>
            <CoverImage src={proxifyImageUrl(change.new)} />
          </CoverImageWrapper>
        </CoverCard>
      </CoverImages>
    </Wrapper>
  );
}

AvatarChange.propTypes = {
  change: PropTypes.shape({
    old: PropTypes.string.isRequired,
    new: PropTypes.string.isRequired,
  }).isRequired,
  screenType: PropTypes.string.isRequired,
  expiration: PropTypes.string.isRequired,
};
