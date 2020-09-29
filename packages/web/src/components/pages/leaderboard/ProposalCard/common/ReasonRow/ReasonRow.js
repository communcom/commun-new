import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { styles } from '@commun/ui';

import { userType } from 'types';
import { useTranslation } from 'shared/i18n';
import { formatReasonDescription } from 'utils/reasons';

import Avatar from 'components/common/Avatar';
import { ProfileIdLink } from 'components/links';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 10px 15px;
  background: ${({ isDark, theme }) => (isDark ? theme.colors.chooseColor : '#fff6ef')};
  border-radius: 10px;
  font-size: 14px;
  line-height: 19px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  &::before {
    position: absolute;
    content: '';
    height: 15px;
    width: 2px;
    left: 0;
    background: #f9a568;
    border-radius: 4px;
  }
`;

const UserLink = styled.a`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  line-height: 19px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.black};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const AvatarStyled = styled(Avatar)`
  width: 30px;
  height: 30px;
  margin-right: 12px;
`;

const Text = styled.p`
  flex-shrink: 2;
  margin-left: 5px;
  font-size: 14px;
  line-height: 19px;

  ${styles.breakWord}
`;

const ReasonRow = ({ reason, author }) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <ProfileIdLink userId={author.userId}>
        <UserLink>
          <AvatarStyled userId={author.userId} />
          {author.username}
        </UserLink>
      </ProfileIdLink>
      <Text>
        {t('components.reason_row.this_is')}: {formatReasonDescription(reason)}
      </Text>
    </Wrapper>
  );
};

ReasonRow.propTypes = {
  reason: PropTypes.string.isRequired,
  author: userType.isRequired,
};

export default ReasonRow;
