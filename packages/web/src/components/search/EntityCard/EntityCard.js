import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, styles } from '@commun/ui';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { Link } from 'shared/routes';

import AsyncAction from 'components/common/AsyncAction';
import Avatar from 'components/common/Avatar';

const Wrapper = styled.a`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 135px;
  height: 173px;
  background-image: url('${({ image }) => image}');
  background-size: cover;
  background-position: center, center;
  background-repeat: no-repeat;
  border-radius: 15px;
  overflow: hidden;
`;

const InfoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 125px;
  max-width: 125px;
  padding: 34px 10px 10px;
  background-color: #fff;
  color: #000;
  box-shadow: 0 10px 25px rgba(176, 176, 204, 0.25);
  border-radius: 10px;
  font-weight: 600;
`;

const EntityName = styled.h3`
  max-width: 100%;
  margin-bottom: 2px;
  font-size: 14px;
  line-height: 19px;
  ${styles.overflowEllipsis};
`;

const EntityStats = styled.p`
  margin-bottom: 16px;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const ButtonStyled = styled(Button)`
  width: 105px;
  max-height: 30px;
  padding: 6px 10px;
`;

const AvatarStyled = styled(Avatar)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid #fff;
  transform: translate(-50%, -50%);
`;

export default function EntityCard({
  className,
  userId,
  communityId,
  coverUrl,
  name,
  alias,
  followers,
  isSubscribed,
  isOwnerUser,
  pin,
  unpin,
  joinCommunity,
  leaveCommunity,
  waitForTransaction,
  fetchProfile,
  fetchCommunity,
}) {
  const handlerBlueprint = useCallback(
    async (mainAction, mainData, fetchAction, fetchData) => {
      try {
        const result = await mainAction(mainData);
        await waitForTransaction(result.transaction_id);
        await fetchAction(fetchData);
        displaySuccess('Success');
      } catch (err) {
        displayError(err);
      }
    },
    [waitForTransaction]
  );

  const onUnsubscribeClick = useCallback(
    async e => {
      e.preventDefault();

      if (userId) {
        await handlerBlueprint(unpin, userId, fetchProfile, { userId });
      } else if (communityId) {
        await handlerBlueprint(leaveCommunity, communityId, fetchCommunity, { communityId });
      }
    },
    [communityId, fetchCommunity, fetchProfile, handlerBlueprint, leaveCommunity, unpin, userId]
  );

  const onSubscribeClick = useCallback(
    async e => {
      e.preventDefault();

      if (userId) {
        await handlerBlueprint(pin, userId, fetchProfile, { userId });
      } else if (communityId) {
        await handlerBlueprint(joinCommunity, communityId, fetchCommunity, { communityId });
      }
    },
    [communityId, fetchCommunity, fetchProfile, handlerBlueprint, joinCommunity, pin, userId]
  );

  if (!userId && !communityId) {
    return null;
  }

  let link;

  if (userId) {
    link = {
      route: 'profile',
      params: {
        username: name,
      },
    };
  } else {
    link = {
      route: 'community',
      params: {
        communityAlias: alias,
      },
    };
  }

  return (
    <Link {...link} passHref>
      <Wrapper className={className} image={coverUrl}>
        <InfoWrapper>
          <AvatarStyled userId={userId} communityId={communityId} />
          <EntityName>{name}</EntityName>
          <EntityStats>{followers} followers</EntityStats>
          {!isOwnerUser ? (
            <AsyncAction onClickHandler={isSubscribed ? onUnsubscribeClick : onSubscribeClick}>
              <ButtonStyled
                name={isSubscribed ? 'search-card__unsubscribe' : 'search-card__subscribe'}
                primary={!isSubscribed}
              >
                {isSubscribed ? 'Unfollow' : 'Follow'}
              </ButtonStyled>
            </AsyncAction>
          ) : null}
        </InfoWrapper>
      </Wrapper>
    </Link>
  );
}

EntityCard.propTypes = {
  userId: PropTypes.string,
  communityId: PropTypes.string,
  coverUrl: PropTypes.string,
  name: PropTypes.string,
  alias: PropTypes.string,
  followers: PropTypes.number,
  isSubscribed: PropTypes.bool,
  isOwnerUser: PropTypes.bool,

  pin: PropTypes.func.isRequired,
  unpin: PropTypes.func.isRequired,
  joinCommunity: PropTypes.func.isRequired,
  leaveCommunity: PropTypes.func.isRequired,
  waitForTransaction: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  fetchCommunity: PropTypes.func.isRequired,
};

EntityCard.defaultProps = {
  userId: null,
  communityId: null,
  coverUrl: null,
  name: null,
  alias: null,
  followers: 0,
  isSubscribed: false,
  isOwnerUser: false,
};
