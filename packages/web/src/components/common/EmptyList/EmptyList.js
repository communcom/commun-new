import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { up } from '@commun/ui';

import { useTranslation } from 'shared/i18n';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 203px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 15px;

  ${up.desktop} {
    height: 251px;
    border-radius: 0;
  }
`;

const NoPostsImage = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 10px;
  background: url('/images/crying-cat.png');
  background-size: 32px 32px;

  ${is('monkey')`
    background: url('/images/monkey.png');
  `};
`;

const Title = styled.h2`
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 21px;
  line-height: 25px;
  text-align: center;

  ${up.desktop} {
    font-size: 21px;
    line-height: 25px;
    margin-bottom: 10px;
  }
`;

const SubText = styled.p`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export default function EmptyList({
  headerText,
  subText,
  icon,
  noIcon,
  monkey,
  children,
  className,
}) {
  const { t } = useTranslation();

  let Icon = null;

  if (!noIcon) {
    if (icon) {
      Icon = icon;
    } else {
      Icon = <NoPostsImage monkey={monkey} />;
    }
  }

  return (
    <Wrapper className={className}>
      {Icon || null}
      <Title>{headerText || t('components.empty_list.text')}</Title>
      {subText ? <SubText>{subText}</SubText> : null}
      {children}
    </Wrapper>
  );
}

EmptyList.propTypes = {
  headerText: PropTypes.string,
  subText: PropTypes.string,
  icon: PropTypes.node,
  noIcon: PropTypes.bool,
  monkey: PropTypes.bool,
};

EmptyList.defaultProps = {
  headerText: undefined,
  subText: undefined,
  icon: undefined,
  noIcon: false,
  monkey: false,
};
