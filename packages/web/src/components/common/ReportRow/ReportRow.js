import React from 'react';
import styled from 'styled-components';

import { reportType } from 'types';

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

const Text = styled.div`
  margin-left: 5px;
`;

export default function ReportRow(props) {
  const { report } = props;

  return (
    <Wrapper>
      <ProfileIdLink userId={report.author.userId}>
        <UserLink>
          <AvatarStyled userId={report.author.userId} />
          {report.author.username}
        </UserLink>
      </ProfileIdLink>
      <Text>{report.reason}</Text>
    </Wrapper>
  );
}

ReportRow.propTypes = {
  report: reportType.isRequired,
};
