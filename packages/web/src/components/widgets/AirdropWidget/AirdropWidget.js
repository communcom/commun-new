import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useTranslation } from 'shared/i18n';
import { displaySuccess } from 'utils/toastsMessages';
import { trackEvent } from 'utils/analytics';

import { up } from '@commun/ui';
import AsyncButton from 'components/common/AsyncButton';
import { WidgetCard, Bottom } from 'components/widgets/common';
import FaqWidget from 'components/widgets/FaqWidget';

const WidgetCardStyled = styled(WidgetCard)`
  padding: 10px 10px 20px;
  background-color: transparent;
  border-radius: 10px;

  ${up.tablet} {
    width: 100%;
    padding: 0;
    margin-bottom: 10px;
  }

  ${up.desktop} {
    width: 330px;
  }
`;

const Cover = styled.div`
  position: relative;
  height: 196px;
  border-radius: 10px 10px 0 0;
  background: url('/images/widgets/dankmeme@1x.png') no-repeat;
  background-size: cover;
  overflow: hidden;

  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    background-image: url('/images/widgets/dankmeme@2x.png');
  }
`;

const Title = styled.h4`
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  line-height: 32px;
  color: #fff;
  transform: translateY(-50%);
`;

const FirstLine = styled(Title)`
  top: 14%;
`;

const SecondLine = styled(Title)`
  top: 85%;
`;

const Text = styled.p`
  margin-right: 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};
`;

const ButtonStyled = styled(AsyncButton)`
  min-width: 64px;

  ${up.mobileLandscape} {
    min-width: 90px;
  }
`;

export default function AirdropWidget({
  communityId,
  isAutoLogging,
  isAuthorized,
  hide,
  joinCommunity,
  getAirdrop,
  unauthSetAirdropCommunity,
  openSignUpModal,
}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  if (isAutoLogging) {
    return null;
  }

  if (hide) {
    return <FaqWidget />;
  }

  async function onClick() {
    trackEvent('Click Get Dank Meme');

    if (isAuthorized) {
      setIsLoading(true);

      try {
        try {
          await joinCommunity(communityId);
        } catch (err) {
          // skip error
        }
        await getAirdrop({ communityId });
        displaySuccess(t('widgets.airdrop.toastsMessages.claim_received'));
      } finally {
        setIsLoading(false);
      }
    } else {
      unauthSetAirdropCommunity(communityId);
      openSignUpModal();
    }
  }

  return (
    <WidgetCardStyled noPadding>
      <Cover>
        <FirstLine>{t('widgets.airdrop.first_line')}</FirstLine>
        <SecondLine>{t('widgets.airdrop.second_line')}</SecondLine>
      </Cover>
      <Bottom>
        <Text dangerouslySetInnerHTML={{ __html: t('widgets.airdrop.text') }} />
        <ButtonStyled primary isProcessing={isLoading} onClick={onClick}>
          {t('widgets.airdrop.get')}
        </ButtonStyled>
      </Bottom>
    </WidgetCardStyled>
  );
}

AirdropWidget.propTypes = {
  communityId: PropTypes.string.isRequired,
  isAutoLogging: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  hide: PropTypes.bool,
  getAirdrop: PropTypes.func.isRequired,
  unauthSetAirdropCommunity: PropTypes.func.isRequired,
  joinCommunity: PropTypes.func.isRequired,
  openSignUpModal: PropTypes.func.isRequired,
};

AirdropWidget.defaultProps = {
  hide: false,
};
