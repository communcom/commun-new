import React from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types';
import { Link } from 'shared/routes';
import { parseLargeNumber } from 'utils/parseLargeNumber';
import Avatar from 'components/common/Avatar';

import {
  WidgetItemText,
  WidgetNameLink,
  StatsWrapper,
  StatsItem,
  ButtonsWrapper,
  WidgetItem,
} from '../common';

export default function WidgetCommunityRow({ community, actions }) {
  const { communityId, alias, name, subscribersCount } = community;

  return (
    <WidgetItem key={communityId}>
      <Avatar communityId={communityId} useLink />
      <WidgetItemText>
        <Link route="community" params={{ communityAlias: alias }} passHref>
          <WidgetNameLink>{name}</WidgetNameLink>
        </Link>
        <StatsWrapper>
          <StatsItem>{parseLargeNumber(subscribersCount)} followers</StatsItem>
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
