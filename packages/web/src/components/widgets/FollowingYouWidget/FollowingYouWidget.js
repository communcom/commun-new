import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { WidgetCard, WidgetHeader } from 'components/widgets/common';

const WidgetHeaderStyled = styled(WidgetHeader)`
  justify-content: center;
`;

const Image = styled.span`
  width: 20px;
  height: 20px;
  margin-top: 2px;
  margin-right: 10px;
  background: url('/images/cool.png');
  background-size: 20px 20px;
`;

export default function FollowingYouWidget({ profile }) {
  if (profile && profile.isSubscription && !profile.isSubscribed) {
    return (
      <WidgetCard>
        <WidgetHeaderStyled
          title={
            <>
              <Image />
              {profile.username} subscribed to you
            </>
          }
        />
      </WidgetCard>
    );
  }

  return null;
}

FollowingYouWidget.propTypes = {
  profile: PropTypes.object,
};

FollowingYouWidget.defaultProps = {
  profile: undefined,
};
