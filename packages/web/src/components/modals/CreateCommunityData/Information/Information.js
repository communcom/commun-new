import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, CheckBox } from '@commun/ui';

import { useTranslation } from 'shared/i18n';

import { Buttons, Content, StepInfo, StepName, Wrapper } from '../common.styled';

const OwlWrapper = styled.div`
  place-self: center;
  width: 120px;
  height: 120px;
  background-color: ${({ theme }) => theme.colors.white};
  background-image: url('/images/owl.png');
  background-size: 36px 36px;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
`;

const Description = styled.div`
  margin: 30px 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;

  .blue {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const Agree = styled.div`
  display: flex;
  padding: 30px 0;
  border-top: 1px solid #e2e6e8;
`;

const AgreeText = styled.span`
  padding-left: 15px;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
`;

export default function Information({
  communityId,
  name,
  fetchUsersCommunities,
  openCreateCommunityConfirmationModal,
  createCommunity,
  restoreCommunityCreation,
  close,
  prev,
}) {
  const { t } = useTranslation();
  const [isAgreed, setIsAgreed] = useState();

  const onChangeAgree = () => {
    setIsAgreed(!isAgreed);
  };

  const onCreateCommunityClick = async () => {
    let pendingCommunityId = communityId;

    try {
      const { communities } = await fetchUsersCommunities();
      const pendingCommunity = communities.find(community => !community.isDone);

      if (pendingCommunity) {
        pendingCommunityId = pendingCommunity.communityId;
      }
    } catch (err) {
      // eslint-disable-next-line
      console.warn('Cannot get pending community data from prism', err);
    }

    const hasPendingCommunity = Boolean(pendingCommunityId);

    openCreateCommunityConfirmationModal({
      isFinalConfirmation: true,
      createCommunity: hasPendingCommunity
        ? () => restoreCommunityCreation(pendingCommunityId, name)
        : () => createCommunity(name),
    });
    close();
  };

  return (
    <Wrapper>
      <Content>
        <StepInfo>
          <StepName>{t('modals.create_community_data.information.title')}</StepName>
        </StepInfo>
        <OwlWrapper />
        <Description
          dangerouslySetInnerHTML={{
            __html: t('modals.create_community_data.information.description'),
          }}
        />

        <Agree>
          <CheckBox checked={isAgreed} onChange={onChangeAgree} />
          <AgreeText onClick={onChangeAgree}>
            {t('modals.create_community_data.information.agree')}
          </AgreeText>
        </Agree>
      </Content>
      <Buttons>
        <Button hollow transparent gray medium onClick={prev}>
          {t('common.back')}
        </Button>
        <Button primary medium disabled={!isAgreed} onClick={onCreateCommunityClick}>
          {t('modals.create_community_data.information.submit')}
        </Button>
      </Buttons>
    </Wrapper>
  );
}

Information.propTypes = {
  communityId: PropTypes.string,
  name: PropTypes.string.isRequired,
  fetchUsersCommunities: PropTypes.func.isRequired,
  openCreateCommunityConfirmationModal: PropTypes.func.isRequired,
  createCommunity: PropTypes.func.isRequired,
  restoreCommunityCreation: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
};

Information.defaultProps = {
  communityId: null,
};
