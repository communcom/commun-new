import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import debounce from 'lodash.debounce';

import { useTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import {
  COMMUNITY_CREATION_TOKENS_NUMBER,
  COMMUNITY_CREATION_BOUNTY_POINTS_NUMBER,
  COMMUNITY_CREATION_WALLET_POINTS_NUMBER,
} from 'shared/constants';

import AsyncAction from 'components/common/AsyncAction';
import {
  Wrapper,
  Title,
  Text,
  Subtitle,
  SubText,
  ButtonsWrapper,
  BigButton,
} from '../common.styled';

const TitleStyled = styled(Title)`
  margin-bottom: 7px;
`;

const TextStyled = styled(Text)`
  ${is('withPadding')`
    padding-bottom: 20px;
  `};

  .big {
    font-size: 18px;
  }
`;

const ButtonsWrapperStyled = styled(ButtonsWrapper)`
  padding-top: 10px;
`;

const FireIcon = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 4px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAA21BMVEUAAADyjo74TCLyPB/zMRf0d3L2Qzv0gAT5QRL4nAr6Qh/5Qhf7VST9aST77IrxXQz78bDuIwbxSxT5QB75txX2SCD6PRbvKgr5UyfrHw37ZlD5RTD9zSPvMAj2UyHvXh7wLhL8Tzn0QS/vfRDzlyn3WlLvEAD/nEb9/ND+8Xf/11b/u0b/qUT/ijr/XDf+oRH9Rgn9/Nz8+73+8oz+7lz/5lP/3VL/ykz/fEn/wEf/lkf/ikT/zUP/lED/bTz+4Tv+ejD/li3/sSv/cyn8YCP/wx3/Rhz9Ygv1TQJ4DU1ZAAAAJ3RSTlMABrxiSxcN/vz7+vrx7tbWw7W0q6qnl5OKiomFhIR1X1NRRz8sHxDY9z0GAAAAfElEQVQI12MAAwkWBhhgY9JDcMTsrIVVGVjBbEZuXXULUQYpCIdDV92Kh0GREchWYuay1dZxYZVmA3LE3fTUzS0dmHiZgRxBA0dtLS0dZ3dZIEfSwMnMWNNG30MByFHjd9XUMDLVFwKbJs9pYqhhzy4HsVRFRoBPRBnIAAALzgw1Ol6phQAAAABJRU5ErkJggg==')
    no-repeat;
`;

function Confirmation({ isFinalConfirmation, createCommunity, close }) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  function onContinueClick() {
    close();
  }

  const onCreateCommunity = debounce(
    async () => {
      if (createCommunity && !isProcessing) {
        setIsProcessing(true);
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

  function renderConfirmButton() {
    if (isFinalConfirmation && createCommunity) {
      return (
        <AsyncAction onClickHandler={onCreateCommunity}>
          <BigButton disabled={isProcessing}>
            {t('components.createCommunity.create_community_header.create')}
          </BigButton>
        </AsyncAction>
      );
    }

    return (
      <Link route="createCommunity" passHref>
        <BigButton as="a" onClick={onContinueClick}>
          {t('common.continue')}
        </BigButton>
      </Link>
    );
  }

  return (
    <Wrapper>
      <TitleStyled>{t('modals.create_community.confirmation')}</TitleStyled>
      <TextStyled
        dangerouslySetInnerHTML={{
          __html: t('modals.create_community.you_need', { COMMUNITY_CREATION_TOKENS_NUMBER }),
        }}
      />
      <Subtitle>{t('modals.create_community.after_creating')}</Subtitle>
      <TextStyled withPadding>
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
      </TextStyled>
      <TextStyled withPadding>
        <span
          dangerouslySetInnerHTML={{
            __html: t('modals.create_community.bounty_points', {
              COMMUNITY_CREATION_BOUNTY_POINTS_NUMBER,
            }),
          }}
        />
        <SubText>{t('modals.create_community.bounty')}</SubText>
      </TextStyled>
      <TextStyled withPadding>
        <span
          dangerouslySetInnerHTML={{
            __html: t('modals.create_community.transferred_points', {
              COMMUNITY_CREATION_WALLET_POINTS_NUMBER,
            }),
          }}
        />
        <SubText>{t('modals.create_community.transferred')}</SubText>
      </TextStyled>
      <ButtonsWrapperStyled>
        {renderConfirmButton()}
        <BigButton type="button" isTransparent onClick={close}>
          {t('common.cancel')}
        </BigButton>
      </ButtonsWrapperStyled>
    </Wrapper>
  );
}

Confirmation.propTypes = {
  isFinalConfirmation: PropTypes.bool,

  close: PropTypes.func.isRequired,
  createCommunity: PropTypes.func,
};

Confirmation.defaultProps = {
  isFinalConfirmation: false,

  createCommunity: undefined,
};

export default Confirmation;
