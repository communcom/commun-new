import React from 'react';
import styled from 'styled-components';

import {
  DOC_BLOCKCHAIN_DISCLAIMER_LINK,
  DOC_PRIVACY_POLICY_LINK,
  DOC_USER_AGREEMENT_LINK,
} from 'shared/constants';
import { useTranslation } from 'shared/i18n';

const Wrapper = styled.p`
  padding: 0 18px;
  margin-top: 17px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};

  a {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

export default function TermsAgree() {
  const { t } = useTranslation();

  return (
    <Wrapper
      dangerouslySetInnerHTML={{
        __html: t('modals.sign_up.common.termsAgree.text', {
          DOC_BLOCKCHAIN_DISCLAIMER_LINK,
          DOC_PRIVACY_POLICY_LINK,
          DOC_USER_AGREEMENT_LINK,
        }),
      }}
    />
  );
}
