import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { useTranslation } from 'shared/i18n';

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
const PayMIRIcon = styled(Icon).attrs({ name: 'paymir', width: 35, height: 28 })``;

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
  color: ${({ theme }) => theme.colors.black};
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
  color: #fff;
`;

const AgreeHint = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  margin-top: 15px;
  padding: 0 50px;

  a {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const providers = {
  ChangeHero: {
    link: 'https://changehero.io/terms-of-use',
    icon: <ChangeHeroIcon />,
  },
  Carbon: {
    link: 'https://www.carbon.money/fiber-user-agreement.pdf',
    icon: <CarbonIcon />,
  },
  PayMIR: {
    link: 'https://paymir.io/en/terms-of-service',
    icon: <PayMIRIcon />,
  },
};

export default function BillingInfoBlock({ provider, showAgreement }) {
  const { t } = useTranslation();
  const { icon, link } = providers[provider];

  return (
    <Wrapper>
      <Block href={link} target="_blank" rel="noopener noreferrer">
        <IconBlock>{icon}</IconBlock>
        <Info>
          <Title>{t('modals.transfers.exchange_commun.common.billing_info.title')}</Title>
          <Text>{provider === 'Carbon' ? 'Carbon money' : provider}</Text>
        </Info>
        <Question>
          <QuestionIcon />
        </Question>
      </Block>
      {showAgreement ? (
        <AgreeHint
          dangerouslySetInnerHTML={{
            __html: t('modals.transfers.exchange_commun.common.billing_info.agree', {
              provider,
              termsLink: link,
            }),
          }}
        />
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
