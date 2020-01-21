import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

const Wrapper = styled.div`
  margin-bottom: 5px;
`;

const Block = styled.a`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 15px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
`;

const IconBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
`;

const ChangeHeroIcon = styled(Icon).attrs({ name: 'changehero', width: 32, height: 27 })``;
const CarbonIcon = styled(Icon).attrs({ name: 'carbon', width: 29, height: 30 })``;

const Info = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Text = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #000000;
  margin-top: 2px;
`;

const Question = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gray};
`;

const QuestionIcon = styled(Icon).attrs({ name: 'question', width: 10, height: 16 })`
  color: #ffffff;
`;

const AgreeHint = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  margin-top: 15px;
`;

const TermsLink = styled.a`
  color: ${({ theme }) => theme.colors.black};
`;

export default function BillingInfoBlock({ provider, showAgreement }) {
  const isChangeHero = provider === 'ChangeHero';
  const termsLink = isChangeHero
    ? 'https://changehero.io/terms-of-use'
    : 'https://www.carbon.money/fiber-user-agreement.pdf';

  return (
    <Wrapper>
      <Block href={termsLink} target="_blank" rel="noopener noreferrer">
        <IconBlock>{isChangeHero ? <ChangeHeroIcon /> : <CarbonIcon />}</IconBlock>
        <Info>
          <Title>The purchase is made by</Title>
          <Text>{provider}</Text>
        </Info>
        <Question>
          <QuestionIcon />
        </Question>
      </Block>
      {showAgreement ? (
        <AgreeHint>
          By clicking Convert, you agree to {provider}’s{' '}
          <TermsLink href={termsLink} target="_blank" rel="noopener noreferrer">
            terms of service.
          </TermsLink>
        </AgreeHint>
      ) : null}
    </Wrapper>
  );
}

BillingInfoBlock.propTypes = {
  provider: PropTypes.string,
  showAgreement: PropTypes.bool,
};

BillingInfoBlock.defaultProps = {
  provider: 'ChangeHero',
  showAgreement: false,
};
