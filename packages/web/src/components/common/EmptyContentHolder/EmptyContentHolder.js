import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';
import { useTranslation } from 'shared/i18n';

export const NO_NOTIFICATIONS = 'NO_NOTIFICATIONS';
export const NO_COMMENTS = 'NO_COMMENTS';
export const NO_POINTS = 'NO_POINTS';

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 50vh;
  padding: 105px 0 140px;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.colors.white};

  ${up.tablet} {
    min-height: 100%;
    border-radius: 6px;
  }
`;

const Title = styled.h2`
  margin-top: 20px;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
`;

const Subtitle = styled.p`
  max-width: 288px;
  margin-top: 12px;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
`;

const CustomIcon = styled(Icon)`
  width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default function EmptyContentHolder({ type, className }) {
  const { t } = useTranslation();

  let iconName = '';
  let title = '';
  let subTitle = '';
  switch (type) {
    case NO_NOTIFICATIONS:
      iconName = 'notifications';
      title = t('components.empty_content_holder.notifications.title');
      subTitle = t('components.empty_content_holder.notifications.desc');
      break;
    case NO_COMMENTS:
      iconName = 'chat';
      title = t('components.empty_content_holder.comments.title');
      subTitle = t('components.empty_content_holder.comments.desc');
      break;
    case NO_POINTS:
      iconName = 'wallet';
      title = t('components.empty_content_holder.points.title');
      subTitle = t('components.empty_content_holder.points.desc');
      break;
    default:
  }

  return (
    <Wrapper className={className}>
      <CustomIcon name={iconName} />
      <Title>{title}</Title>
      <Subtitle>{subTitle}</Subtitle>
    </Wrapper>
  );
}

EmptyContentHolder.propTypes = {
  type: PropTypes.string.isRequired,
};
