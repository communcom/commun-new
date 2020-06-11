import React from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types';
import { useTranslation } from 'shared/i18n';
import { parseLargeNumber } from 'utils/parseLargeNumber';
import Avatar from 'components/common/Avatar';
import CommunityLink from 'components/links/CommunityLink';

import {
  WidgetItemText,
  WidgetNameLink,
  StatsWrapper,
  StatsItem,
  ButtonsWrapper,
  WidgetItem,
} from '../common';

export default function WidgetCommunityRow({ community, actions }) {
  const { t } = useTranslation();
  const { communityId, name, subscribersCount, postsCount } = community;

  return (
    <WidgetItem key={communityId}>
      <Avatar communityId={communityId} useLink />
      <WidgetItemText>
        <CommunityLink community={community}>
          <WidgetNameLink>{name}</WidgetNameLink>
        </CommunityLink>
        <StatsWrapper>
          <StatsItem>
            {parseLargeNumber(subscribersCount)}{' '}
            {t('common.counters.follower', { count: subscribersCount })}
            {' • '}
            {parseLargeNumber(postsCount)} {t('common.counters.post', { count: postsCount })}
          </StatsItem>
        </StatsWrapper>
      </WidgetItemText>
      {actions ? <ButtonsWrapper>{actions(community)}</ButtonsWrapper> : null}
    </WidgetItem>
  );
}

WidgetCommunityRow.propTypes = {
  community: communityType.isRequired,
  actions: PropTypes.func,
};

WidgetCommunityRow.defaultProps = {
  actions: undefined,
};
