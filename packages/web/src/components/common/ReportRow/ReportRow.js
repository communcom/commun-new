import React from 'react';
import styled from 'styled-components';

import { styles } from '@commun/ui';
import { reportType } from 'types';
import { useTranslation, i18n } from 'shared/i18n';

import Avatar from 'components/common/Avatar';
import { ProfileIdLink } from 'components/links';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 10px 15px;
  background: #fff6ef;
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

const AvatarStyled = styled(Avatar)`
  width: 30px;
  height: 30px;
  margin-right: 12px;
`;

const UserLink = styled.a`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  line-height: 19px;
  text-decoration: none;
  color: #000;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const Text = styled.p`
  flex-shrink: 2;
  margin-left: 5px;
  font-size: 14px;
  line-height: 19px;

  ${styles.breakWord}
`;

function formatReportDescription(desc) {
  try {
    const reason = JSON.parse(desc);
    if (Array.isArray(reason)) {
      return reason
        .map(item => {
          if (item.includes('other-')) {
            const report = item.split('-')[1];
            return report.replace(/,+/g, ' ');
          }

          return i18n.t(`reports.${item}`);
        })
        .join(', ');
    }
  } catch (err) {
    // do nothing
  }

  return desc;
}

export default function ReportRow({ report }) {
  const { t } = useTranslation();

  if (!report) {
    return null;
  }

  const { author, reason } = report;

  return (
    <Wrapper>
      <ProfileIdLink userId={author.userId}>
        <UserLink>
          <AvatarStyled userId={author.userId} />
          {author.username}
        </UserLink>
      </ProfileIdLink>
      <Text>
        {t('components.report_row.this_is')}: {formatReportDescription(reason)}
      </Text>
    </Wrapper>
  );
}

ReportRow.propTypes = {
  report: reportType.isRequired,
};
