import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import AsyncButton from 'components/common/AsyncButton';
import { displaySuccess } from 'utils/toastsMessages';
import { WidgetCard, Cover, Bottom } from 'components/widgets/common';

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

const CoverStyled = styled(Cover)`
  align-items: center;
`;

const Info = styled.div`
  margin-left: 15px;
`;

const Title = styled.h4`
  font-size: 22px;
  font-weight: bold;
  line-height: 32px;
  color: #fff;
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

const Image = styled.span`
  display: block;
  flex-grow: 0;
  flex-shrink: 0;
  width: 100px;
  height: 91px;
  margin-right: 8px;
  background-image: url('/images/widgets/coins.png');
  background-size: 100px 91px;
`;

export default function AirdropWidget({
  communityId,
  isAuthorized,
  hide,
  getAirdrop,
  unauthSetAirdropCommunity,
  openSignUpModal,
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (hide) {
    return null;
  }

  async function onClick() {
    if (isAuthorized) {
      setIsLoading(true);

      try {
        await getAirdrop({ communityId });
        displaySuccess('Claim received');
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
      <CoverStyled>
        <Info>
          <Title>Wow! Gift Meme&#39;s points are here!</Title>
        </Info>
        <Image src="/images/widgets/coins.png" />
      </CoverStyled>
      <Bottom>
        <Text>
          Just click on the button and
          <br />
          get a Meme&#39;s points!
        </Text>
        <ButtonStyled primary isProcessing={isLoading} onClick={onClick}>
          Claim
        </ButtonStyled>
      </Bottom>
    </WidgetCardStyled>
  );
}

AirdropWidget.propTypes = {
  communityId: PropTypes.string.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  hide: PropTypes.bool,
  getAirdrop: PropTypes.func.isRequired,
  unauthSetAirdropCommunity: PropTypes.func.isRequired,
  openSignUpModal: PropTypes.func.isRequired,
};

AirdropWidget.defaultProps = {
  hide: false,
};
