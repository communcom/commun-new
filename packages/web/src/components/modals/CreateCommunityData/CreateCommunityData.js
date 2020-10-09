import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, CloseButton, up } from '@commun/ui';

import { COMMUNITY_CREATION_KEY, LANGUAGES } from 'shared/constants';
import { getData } from 'utils/localStore';

import OnboardingCarousel from 'components/common/OnboardingCarousel';
import OnboardingCarouselDots from 'components/common/OnboardingCarouselDots';
import Base from './Base';
import Information from './Information';
import Rules from './Rules';

export const Wrapper = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 500px;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  overflow-y: auto;

  ${up.mobileLandscape} {
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
  }

  ${up.tablet} {
    height: auto;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 25px 10px;
  min-height: 30px;
  z-index: 1;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const Right = styled.div`
  z-index: 1;
`;

const CloseButtonStyled = styled(CloseButton)`
  display: none;

  width: 30px;
  height: 30px;

  ${up.mobileLandscape} {
    display: flex;
  }
`;

export const BackButton = styled(CloseButton).attrs({ isBack: true })``;

export default function CreateCommunityData({
  modalRef,
  restoreData,
  fetchUsersCommunities,
  getCommunity,
  isMobile,
  close,
}) {
  const carouselRef = useRef();
  const [communityId, setCommunityId] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useImperativeHandle(modalRef, () => ({
    canClose: () => false,
  }));

  useEffect(() => {
    async function getPendingCommunityData() {
      let data = null;

      try {
        const { communities } = await fetchUsersCommunities();
        const pendingCommunity = communities.find(community => !community.isDone);

        if (pendingCommunity) {
          const { community } = await getCommunity(pendingCommunity.communityId);

          if (!community) {
            return null;
          }

          let language = null;
          let rules = [];

          if (community.language) {
            language = LANGUAGES.find(lang => lang.code === community.language.toUpperCase());
          }

          if (community.rules) {
            try {
              rules = JSON.parse(community.rules);
            } catch (err) {
              // eslint-disable-next-line
              console.warn('Cannot parse community rules', err);
            }
          }

          data = {
            name: community.name,
            avatarUrl: community.avatarUrl || '',
            coverUrl: community.coverUrl || '',
            description: community.description || '',
            language,
            rules,
          };

          setCommunityId(community.communityId);
        }
      } catch (err) {
        // eslint-disable-next-line
        console.warn('Cannot get community data from prism', err);
      }

      return data;
    }

    async function restore() {
      const prismData = await getPendingCommunityData();
      const storageData = getData(COMMUNITY_CREATION_KEY);
      const data = prismData || storageData;

      if (data) {
        restoreData(data);
      }
    }

    restore();
  }, [fetchUsersCommunities, getCommunity, restoreData]);

  function onChangeActive(index) {
    setActiveIndex(index);
  }

  function onFinish() {
    close();
  }

  const steps = [
    <Base key="base" />,
    <Rules key="rules" />,
    <Information key="information" communityId={communityId} close={close} />,
  ];

  return (
    <Wrapper>
      <Header>
        <Left />
        {steps.length > 1 ? (
          <OnboardingCarouselDots count={steps.length} activeIndex={activeIndex} />
        ) : null}
        {!isMobile ? (
          <Right>
            <CloseButtonStyled onClick={onFinish} />
          </Right>
        ) : null}
      </Header>
      <OnboardingCarousel
        ref={carouselRef}
        activeIndex={activeIndex}
        onChangeActive={onChangeActive}
        onFinish={onFinish}
      >
        {steps}
      </OnboardingCarousel>
    </Wrapper>
  );
}

CreateCommunityData.propTypes = {
  // eslint-disable-next-line react/require-default-props
  modalRef: PropTypes.shape({ current: PropTypes.elementType }),
  isMobile: PropTypes.bool,

  restoreData: PropTypes.func.isRequired,
  fetchUsersCommunities: PropTypes.func.isRequired,
  getCommunity: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

CreateCommunityData.defaultProps = {
  isMobile: false,
};
