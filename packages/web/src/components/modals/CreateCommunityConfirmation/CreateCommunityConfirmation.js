import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, Glyph } from '@commun/ui';

import {
  COMMUNITY_CREATION_BOUNTY_POINTS_NUMBER,
  COMMUNITY_CREATION_TOKENS_NUMBER,
  COMMUNITY_CREATION_WALLET_POINTS_NUMBER,
  POINT_CONVERT_TYPE,
} from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { displaySuccess } from 'utils/toastsMessages';

import AsyncAction from 'components/common/AsyncAction';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  flex-basis: 405px;
  padding: 25px 25px 15px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.05);
  border-radius: 15px;
`;

const Title = styled.div`
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 18px;
  line-height: 25px;
  text-align: left;
  color: ${({ theme }) => theme.colors.black};
`;

const SubTitle = styled.p`
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
`;

const TextItem = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const BulletIcon = styled(Icon).attrs({ name: 'bullet' })`
  margin: 0 10px 0 5px;
  width: 16px;
  height: 16px;
`;

const Text = styled.p`
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.black};

  .blue {
    color: ${({ theme }) => theme.colors.blue};
  }

  .bold {
    font-weight: 700;
  }
`;

const SubText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.gray};
`;

const RoundWrapper = styled.div`
  margin-bottom: 15px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 15px;

  ${is('withPadding')`
    padding: 15px 15px 20px;
  `}
`;

const NeedWrapper = styled.div`
  padding: 15px;
  text-align: center;
`;

const MoneyIcon = styled(Icon).attrs({ name: 'money' })`
  margin-bottom: 15px;
  width: 56px;
  height: 43px;
`;

const TextNeed = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: ${({ theme }) => theme.colors.black};

  .blue {
    color: ${({ theme }) => theme.colors.blue};
  }

  .semibold {
    font-weight: 400;
  }

  .bold {
    font-weight: 700;
  }
`;

const BalanceWrapper = styled.div`
  display: flex;
  padding: 15px;
  border-top: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const CommunLogo = styled(Glyph).attrs({ icon: 'commun', size: 'medium' })``;

const BalanceGroup = styled.div`
  flex: 1;
  margin: 0 10px;
`;

const BalanceText = styled.div`
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.gray};
`;

const BalanceValue = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.black};
`;

const BuyButton = styled(Button)`
  min-width: auto;
`;

const PlusIcon = styled(Icon).attrs({ name: 'plus' })`
  display: inline-block;
  margin-right: 3px;
  width: 12px;
  height: 12px;
  vertical-align: bottom;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

const LoaderHint = styled.div`
  margin: 10px 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.gray};
`;

const FireIcon = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 4px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAA21BMVEUAAADyjo74TCLyPB/zMRf0d3L2Qzv0gAT5QRL4nAr6Qh/5Qhf7VST9aST77IrxXQz78bDuIwbxSxT5QB75txX2SCD6PRbvKgr5UyfrHw37ZlD5RTD9zSPvMAj2UyHvXh7wLhL8Tzn0QS/vfRDzlyn3WlLvEAD/nEb9/ND+8Xf/11b/u0b/qUT/ijr/XDf+oRH9Rgn9/Nz8+73+8oz+7lz/5lP/3VL/ykz/fEn/wEf/lkf/ikT/zUP/lED/bTz+4Tv+ejD/li3/sSv/cyn8YCP/wx3/Rhz9Ygv1TQJ4DU1ZAAAAJ3RSTlMABrxiSxcN/vz7+vrx7tbWw7W0q6qnl5OKiomFhIR1X1NRRz8sHxDY9z0GAAAAfElEQVQI12MAAwkWBhhgY9JDcMTsrIVVGVjBbEZuXXULUQYpCIdDV92Kh0GREchWYuay1dZxYZVmA3LE3fTUzS0dmHiZgRxBA0dtLS0dZ3dZIEfSwMnMWNNG30MByFHjd9XUMDLVFwKbJs9pYqhhzy4HsVRFRoBPRBnIAAALzgw1Ol6phQAAAABJRU5ErkJggg==')
    no-repeat;
`;

function CreateCommunityConfirmation({
  isFinalConfirmation,
  communPoint,
  createCommunity,
  openModalConvertPoint,
  openCreateCommunityDataModal,
  close,
}) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  async function onContinueClick() {
    setIsProcessing(true);
    openCreateCommunityDataModal();
    close();
  }

  const onCreateCommunity = debounce(
    async () => {
      if (createCommunity && !isProcessing) {
        setIsProcessing(true);
        displaySuccess(t('modals.create_community.wait'));
        await createCommunity();
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

  const onExchangePointsClick = () => {
    openModalConvertPoint({
      convertType: POINT_CONVERT_TYPE.SELL,
    });
  };

  function renderConfirmButton() {
    if (isFinalConfirmation && createCommunity) {
      return (
        <>
          {isProcessing ? <LoaderHint>{t('modals.create_community.wait')}</LoaderHint> : null}
          <AsyncAction onClickHandler={onCreateCommunity}>
            <Button full big primary disabled={isProcessing}>
              {t('components.createCommunity.create_community_header.create')}
            </Button>
          </AsyncAction>
        </>
      );
    }

    return (
      <Button full big primary onClick={onContinueClick}>
        {t('common.continue')}
      </Button>
    );
  }

  return (
    <Wrapper>
      <Title>{t('modals.create_community.confirmation')}</Title>

      <RoundWrapper>
        <NeedWrapper>
          <MoneyIcon />
          <TextNeed
            dangerouslySetInnerHTML={{
              __html: t('modals.create_community.you_need', { COMMUNITY_CREATION_TOKENS_NUMBER }),
            }}
          />
        </NeedWrapper>

        <BalanceWrapper>
          <CommunLogo />
          <BalanceGroup>
            <BalanceText>{t('modals.create_community.total_balance')}</BalanceText>
            <BalanceValue>{Number(communPoint.balance)}</BalanceValue>
          </BalanceGroup>
          <BuyButton disabled={isProcessing} onClick={onExchangePointsClick}>
            <PlusIcon /> {t(`modals.create_community.exchange`)}
          </BuyButton>
        </BalanceWrapper>
      </RoundWrapper>

      <RoundWrapper withPadding>
        <SubTitle>{t('modals.create_community.after_creating')}</SubTitle>
        <TextItem>
          <BulletIcon />
          <Text>
            <span
              dangerouslySetInnerHTML={{
                __html: t('modals.create_community.burned_tokens', {
                  COMMUNITY_CREATION_TOKENS_NUMBER: COMMUNITY_CREATION_TOKENS_NUMBER / 10,
                }),
              }}
            />
            <SubText>
              {t('modals.create_community.burned')}
              <FireIcon />
            </SubText>
          </Text>
        </TextItem>
        <TextItem>
          <BulletIcon />
          <Text>
            <span
              dangerouslySetInnerHTML={{
                __html: t('modals.create_community.bounty_points', {
                  COMMUNITY_CREATION_BOUNTY_POINTS_NUMBER,
                }),
              }}
            />
            <SubText>{t('modals.create_community.bounty')}</SubText>
          </Text>
        </TextItem>
        <TextItem>
          <BulletIcon />
          <Text>
            <span
              dangerouslySetInnerHTML={{
                __html: t('modals.create_community.transferred_points', {
                  COMMUNITY_CREATION_WALLET_POINTS_NUMBER,
                }),
              }}
            />
            <SubText>{t('modals.create_community.transferred')}</SubText>
          </Text>
        </TextItem>
      </RoundWrapper>

      <ButtonsWrapper>
        {renderConfirmButton()}
        {!isProcessing ? (
          <Button full big hollow transparent onClick={close}>
            {t('common.cancel')}
          </Button>
        ) : null}
      </ButtonsWrapper>
    </Wrapper>
  );
}

CreateCommunityConfirmation.propTypes = {
  isFinalConfirmation: PropTypes.bool,
  communPoint: PropTypes.object.isRequired,

  openModalConvertPoint: PropTypes.func.isRequired,
  openCreateCommunityDataModal: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  createCommunity: PropTypes.func,
};

CreateCommunityConfirmation.defaultProps = {
  isFinalConfirmation: false,

  createCommunity: undefined,
};

export default CreateCommunityConfirmation;
