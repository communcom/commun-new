import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@commun/ui';

import { withTranslation } from 'shared/i18n';

import { ProfileLink } from 'components/links';

const Wrapper = styled(ListItem)`
  flex-direction: column;
  align-items: stretch;
  padding: 10px 0;
`;

const PointBalance = styled(ListItemText)`
  text-align: right;

  & > div {
    font-size: 14px;
  }
`;

const RightPanel = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const GreenText = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.green};
  text-align: right;
  text-transform: lowercase;
`;

const BottomStatusBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ItemWrapper = styled.a`
  display: flex;
  align-items: center;
`;

const AvatarLink = styled.a`
  display: flex;
  align-items: center;
`;

const Username = styled.a`
  font-weight: 600;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.black};
`;

@withTranslation()
export default class DonationRow extends PureComponent {
  static propTypes = {
    donation: PropTypes.arrayOf(PropTypes.object).isRequired,

    closeTopModal: PropTypes.func.isRequired,
  };

  handleLinkClick = () => {
    const { closeTopModal } = this.props;

    closeTopModal();
  };

  render() {
    const { donation, t } = this.props;
    const { quantity, timestamp, sender } = donation;

    return (
      <Wrapper>
        <ItemWrapper>
          <ListItemAvatar>
            <ProfileLink user={sender}>
              <AvatarLink onClick={this.handleLinkClick}>
                <Avatar size="large" avatarUrl={sender.avatarUrl} />{' '}
              </AvatarLink>
            </ProfileLink>
          </ListItemAvatar>
          <ListItemText
            primary={
              <ProfileLink user={sender}>
                <Username onClick={this.handleLinkClick}>{sender.username}</Username>
              </ProfileLink>
            }
            primaryBold
            secondary={t('components.wallet.history_list.types.donation')}
          />
          <RightPanel>
            <PointBalance
              primary={
                <GreenText>
                  + {quantity} {t('common.point', { count: parseFloat(quantity) })}
                </GreenText>
              }
              primaryBold
              secondary={
                timestamp ? (
                  <BottomStatusBlock>{dayjs(timestamp).format('HH:mm')}</BottomStatusBlock>
                ) : null
              }
            />
          </RightPanel>
        </ItemWrapper>
      </Wrapper>
    );
  }
}
