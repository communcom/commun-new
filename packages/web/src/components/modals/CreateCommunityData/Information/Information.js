import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import styled from 'styled-components';

import { Button, CheckBox } from '@commun/ui';

import { useTranslation } from 'shared/i18n';
import { displaySuccess } from 'utils/toastsMessages';

import AsyncAction from 'components/common/AsyncAction';
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

const LoaderHint = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  font-weight: 400;
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default function Information({
  communityId,
  name,
  createCommunity,
  restoreCommunityCreation,
  close,
  prev,
}) {
  const { t } = useTranslation();
  const [isAgreed, setIsAgreed] = useState();
  const [isProcessing, setIsProcessing] = useState(false);

  const onChangeAgree = () => {
    setIsAgreed(!isAgreed);
  };

  const onCreateCommunity = debounce(
    async () => {
      if (!isProcessing) {
        const pendingCommunityId = communityId;
        const hasPendingCommunity = Boolean(pendingCommunityId);

        setIsProcessing(true);
        displaySuccess(t('modals.create_community.wait'));

        if (hasPendingCommunity) {
          await restoreCommunityCreation(pendingCommunityId, name);
        } else {
          await createCommunity(name);
        }

        setIsProcessing(false);
        close();
      }
    },
    500,
    {
      leading: true,
      trailing: false,
    }
  );

  useEffect(() => () => {
    onCreateCommunity.cancel();
  });

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
      {isProcessing ? <LoaderHint>{t('modals.create_community.wait')}</LoaderHint> : null}
      <Buttons>
        <Button hollow transparent gray medium onClick={prev}>
          {t('common.back')}
        </Button>
        <AsyncAction onClickHandler={onCreateCommunity}>
          <Button primary medium disabled={!isAgreed}>
            {t('modals.create_community_data.information.submit')}
          </Button>
        </AsyncAction>
      </Buttons>
    </Wrapper>
  );
}

Information.propTypes = {
  communityId: PropTypes.string,
  name: PropTypes.string.isRequired,
  createCommunity: PropTypes.func.isRequired,
  restoreCommunityCreation: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
};

Information.defaultProps = {
  communityId: null,
};
