import React from 'react';
import styled from 'styled-components';

import { Link } from '@commun/ui';

import {
  DOC_BLOCKCHAIN_DISCLAIMER_LINK,
  DOC_PRIVACY_POLICY_LINK,
  DOC_USER_AGREEMENT_LINK,
} from 'shared/constants';

const TermsAgree = styled.p`
  padding: 0 18px;
  margin-top: 17px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
`;

export default () => (
  <TermsAgree>
    By clicking the “Sign up” button, you agree to the{' '}
    <Link href={DOC_USER_AGREEMENT_LINK} target="_blank">
      User Agreement
    </Link>
    ,{' '}
    <Link href={DOC_PRIVACY_POLICY_LINK} target="_blank">
      Privacy Policy
    </Link>{' '}
    and{' '}
    <Link href={DOC_BLOCKCHAIN_DISCLAIMER_LINK} target="_blank">
      Blockchain Disclaimer
    </Link>
  </TermsAgree>
);
