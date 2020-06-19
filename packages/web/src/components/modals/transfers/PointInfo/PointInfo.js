import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { withTranslation } from 'shared/i18n';

import { MobilePanel } from 'components/pages/wallet';
import { PointInfoPanel } from 'components/pages/wallet/panels';
import UsersLayout from 'components/pages/wallet/UsersLayout';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  ${up.mobileLandscape} {
    padding-bottom: 32px;

    width: 330px;

    border-radius: 15px;
  }
`;

const MobilePanelStyled = styled(MobilePanel)`
  width: 100%;
  margin: 30px 0 0;

  & > div {
    padding-bottom: 15px;
  }
`;

@withTranslation()
export default class PointInfo extends PureComponent {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    friends: PropTypes.arrayOf(PropTypes.shape({})),
    loggedUserId: PropTypes.string.isRequired,

    openModalSendPoint: PropTypes.func.isRequired,
    openModalSelectRecipient: PropTypes.func.isRequired,
    getUserSubscriptions: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    friends: [],
  };

  async componentDidMount() {
    const { loggedUserId, getUserSubscriptions } = this.props;

    try {
      await getUserSubscriptions({
        userId: loggedUserId,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  usersSeeAllClickHandler = async () => {
    const { openModalSelectRecipient } = this.props;
    const result = await openModalSelectRecipient();

    if (result) {
      this.sendItemClickHandler(result.selectedItem);
    }
  };

  sendItemClickHandler = user => {
    const { symbol, openModalSendPoint } = this.props;

    if (user === 'add-friend') {
      // TODO implement
    } else {
      openModalSendPoint({ selectedUser: user, symbol });
    }
  };

  closeModal = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { symbol, friends, t } = this.props;

    const mobilePanel = friends.length ? (
      <MobilePanelStyled
        title={t('modals.transfers.point_info.title-mobile')}
        seeAllActionHndler={this.usersSeeAllClickHandler}
      >
        <UsersLayout items={friends} itemClickHandler={this.sendItemClickHandler} />
      </MobilePanelStyled>
    ) : null;

    return (
      <Wrapper>
        <PointInfoPanel symbol={symbol} mobilePanel={mobilePanel} closeAction={this.closeModal} />
      </Wrapper>
    );
  }
}
