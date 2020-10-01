import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { useTranslation } from 'shared/i18n';

const Wrapper = styled.div`
  margin-left: 5px;
  font-weight: 400;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

const ExpirationTime = ({ expiration, className }) => {
  const { t } = useTranslation();

  let text = t('components.expiration_time.expired');

  if (new Date(expiration) > Date.now()) {
    text = t('components.expiration_time.expiring_in', { expiration: dayjs(expiration).fromNow() });
  }

  return <Wrapper className={className}>({text})</Wrapper>;
};

ExpirationTime.propTypes = {
  expiration: PropTypes.string.isRequired,
};

export default ExpirationTime;
