import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import isNil from 'ramda/src/isNil';
import last from 'ramda/src/last';
import styled from 'styled-components';
import is from 'styled-is';

import { up } from '@commun/ui';

import { KeyBusProvider } from 'utils/keyBus';
import { getDynamicComponentInitialProps } from 'utils/lazy';
import {
  SHOW_MODAL_BAN,
  SHOW_MODAL_COMMUNITY_LANGUAGE_EDIT,
  SHOW_MODAL_DONATES,
  SHOW_MODAL_MOBILE_COMMUNITY_LEADER_MENU,
  SHOW_MODAL_MOBILE_CONTACTS,
  SHOW_MODAL_SHARE,
} from 'store/constants';
import {
  SHOW_MODAL_AVATAR_EDIT,
  SHOW_MODAL_BECOME_LEADER,
  SHOW_MODAL_CHOOSE_POST_COVER,
  SHOW_MODAL_CONFIRM,
  SHOW_MODAL_CONVERT_POINTS,
  SHOW_MODAL_CREATE_COMMUNITY_CONFIRMATION,
  SHOW_MODAL_CREATE_COMMUNITY_NOT_ENOUGH,
  SHOW_MODAL_DESCRIPTION_EDIT,
  SHOW_MODAL_EXCHANGE_3DS,
  SHOW_MODAL_EXCHANGE_COMMUN,
  SHOW_MODAL_HISTORY_FILTER,
  SHOW_MODAL_LOGIN,
  SHOW_MODAL_MOBILE_FEED_FILTERS,
  SHOW_MODAL_MOBILE_MENU,
  SHOW_MODAL_NEW_POST_EDITOR,
  SHOW_MODAL_ONBOARDING,
  SHOW_MODAL_ONBOARDING_APP_BANNER,
  SHOW_MODAL_ONBOARDING_REGISTRATION,
  SHOW_MODAL_ONBOARDING_WELCOME,
  SHOW_MODAL_PASSWORD,
  SHOW_MODAL_POINT_INFO,
  SHOW_MODAL_POST,
  SHOW_MODAL_POST_EDIT,
  SHOW_MODAL_PROFILE_ABOUT_EDIT,
  SHOW_MODAL_REPORT,
  SHOW_MODAL_RULE_EDIT,
  SHOW_MODAL_SELECT_POINT,
  SHOW_MODAL_SELECT_RECIPIENT,
  SHOW_MODAL_SELECT_TOKEN,
  SHOW_MODAL_SELL_COMMUN,
  SHOW_MODAL_SEND_POINTS,
  SHOW_MODAL_SIGNUP,
  SHOW_MODAL_SWITCH_TO_APP,
  SHOW_MODAL_VIEW_BIO,
} from 'store/constants/modalTypes';

import ScrollFix from 'components/common/ScrollFix';
import ScrollLock from 'components/common/ScrollLock';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 30;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overscroll-behavior: none;
  z-index: 1;

  &:last-child {
    z-index: 3;
  }
`;

const ModalWrapper = styled(ScrollFix)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;

  ${up.tablet} {
    padding: 40px 20px;
  }

  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.01);
  z-index: 2;
  user-select: none;

  ${is('isShowShadow')`
    background-color: rgba(0, 0, 0, 0.7);
  `};
`;

const modalsMap = new Map([
  [SHOW_MODAL_LOGIN, dynamic(() => import('components/modals/Login'))],
  [SHOW_MODAL_PASSWORD, dynamic(() => import('components/modals/Password'))],
  [SHOW_MODAL_SWITCH_TO_APP, dynamic(() => import('components/modals/SwitchToApp'))],
  [SHOW_MODAL_SIGNUP, dynamic(() => import('components/modals/SignUp'))],
  [SHOW_MODAL_PROFILE_ABOUT_EDIT, dynamic(() => import('components/modals/ProfileAboutEdit'))],
  [SHOW_MODAL_DONATES, dynamic(() => import('components/modals/Donations'))],
  [SHOW_MODAL_SEND_POINTS, dynamic(() => import('components/modals/transfers/SendPoints'))],
  [SHOW_MODAL_CONVERT_POINTS, dynamic(() => import('components/modals/transfers/ConvertPoints'))],
  [SHOW_MODAL_EXCHANGE_COMMUN, dynamic(() => import('components/modals/transfers/ExchangeCommun'))],
  [SHOW_MODAL_SELL_COMMUN, dynamic(() => import('components/modals/transfers/SellCommun'))],
  [SHOW_MODAL_EXCHANGE_3DS, dynamic(() => import('components/modals/transfers/Exchange3DS'))],
  [SHOW_MODAL_POST, dynamic(() => import('components/modals/PostModal'))],
  [SHOW_MODAL_NEW_POST_EDITOR, dynamic(() => import('components/modals/NewPostEditor'))],
  [SHOW_MODAL_CHOOSE_POST_COVER, dynamic(() => import('components/modals/ChoosePostCoverModal'))],
  [SHOW_MODAL_POST_EDIT, dynamic(() => import('components/modals/PostEditModal'))],
  [SHOW_MODAL_RULE_EDIT, dynamic(() => import('components/modals/RuleEditModal'))],
  [
    SHOW_MODAL_COMMUNITY_LANGUAGE_EDIT,
    dynamic(() => import('components/modals/CommunityLanguageEditModal')),
  ],
  [SHOW_MODAL_DESCRIPTION_EDIT, dynamic(() => import('components/modals/DescriptionEditModal'))],
  [SHOW_MODAL_CONFIRM, dynamic(() => import('components/modals/ConfirmDialog'))],
  [SHOW_MODAL_BECOME_LEADER, dynamic(() => import('components/modals/BecomeLeader'))],
  [SHOW_MODAL_SHARE, dynamic(() => import('components/modals/ShareModal'))],
  [
    SHOW_MODAL_MOBILE_CONTACTS,
    dynamic(() => import('components/modals/ProfileMobileContactsModal')),
  ],
  [SHOW_MODAL_MOBILE_MENU, dynamic(() => import('components/modals/ProfileMobileMenuModal'))],
  [
    SHOW_MODAL_MOBILE_COMMUNITY_LEADER_MENU,
    dynamic(() => import('components/modals/CommunityLeaderMobileMenuModal')),
  ],
  [
    SHOW_MODAL_MOBILE_FEED_FILTERS,
    dynamic(() => import('components/modals/FeedFiltersMobileModal')),
  ],
  [SHOW_MODAL_ONBOARDING, dynamic(() => import('components/modals/Onboarding'))],
  [
    SHOW_MODAL_ONBOARDING_APP_BANNER,
    dynamic(() => import('components/modals/OnboardingAppBanner')),
  ],
  [SHOW_MODAL_REPORT, dynamic(() => import('components/modals/ReportModal'))],
  [SHOW_MODAL_BAN, dynamic(() => import('components/modals/BanModal'))],
  [SHOW_MODAL_ONBOARDING_WELCOME, dynamic(() => import('components/modals/OnboardingWelcome'))],
  [SHOW_MODAL_SELECT_POINT, dynamic(() => import('components/modals/transfers/SelectPoint'))],
  [SHOW_MODAL_SELECT_TOKEN, dynamic(() => import('components/modals/transfers/SelectToken'))],
  [SHOW_MODAL_POINT_INFO, dynamic(() => import('components/modals/transfers/PointInfo'))],
  [SHOW_MODAL_HISTORY_FILTER, dynamic(() => import('components/modals/transfers/HistoryFilter'))],
  [
    SHOW_MODAL_SELECT_RECIPIENT,
    dynamic(() => import('components/modals/transfers/SelectRecipient')),
  ],
  [
    SHOW_MODAL_ONBOARDING_REGISTRATION,
    dynamic(() => import('components/modals/OnboardingRegistration')),
  ],
  [SHOW_MODAL_AVATAR_EDIT, dynamic(() => import('components/modals/AvatarEdit'))],
  [SHOW_MODAL_VIEW_BIO, dynamic(() => import('components/modals/ViewBioModal'))],
  [
    SHOW_MODAL_CREATE_COMMUNITY_CONFIRMATION,
    dynamic(() => import('components/modals/CreateCommunity/Confirmation')),
  ],
  [
    SHOW_MODAL_CREATE_COMMUNITY_NOT_ENOUGH,
    dynamic(() => import('components/modals/CreateCommunity/NotEnoughTokens')),
  ],
]);

export default class ModalManager extends PureComponent {
  static propTypes = {
    modals: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        modalId: PropTypes.number.isRequired,
        props: PropTypes.shape({}),
      })
    ).isRequired,
    passStore: PropTypes.shape({}).isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  state = {
    propsFetchedSet: {},
  };

  modalsRefs = {};

  componentDidMount() {
    this.calculateHeight();
    this.getInitialDataOfModals(this.props);

    window.addEventListener('resize', this.calculateHeight);
  }

  componentWillReceiveProps(nextProps) {
    this.getInitialDataOfModals(nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculateHeight);
  }

  getInitialDataOfModals(nextProps) {
    const { propsFetchedSet } = this.state;

    for (const { modalId, type, props } of nextProps.modals) {
      if (!propsFetchedSet[modalId] && modalsMap.has(type)) {
        const ModalComponent = modalsMap.get(type);

        getDynamicComponentInitialProps(ModalComponent, {
          store: nextProps.passStore,
          props: isNil(props) ? {} : props,
        }).then(initialProps => {
          // eslint-disable-next-line no-shadow
          const { propsFetchedSet } = this.state;

          this.setState({
            propsFetchedSet: {
              ...propsFetchedSet,
              [modalId]: {
                initialProps,
              },
            },
          });
        });
      }
    }
  }

  onWrapperClick = e => {
    // Обработаываем клик, только если он был непосредственно на элементе.
    if (e.target !== e.currentTarget) {
      return;
    }

    this.closeTopModal();
  };

  onTouchStart = e => {
    if (e.target !== e.currentTarget) {
      return;
    }

    this.lastTouch = {
      time: Date.now(),
      position: {
        x: e.clientX,
        y: e.clientY,
      },
    };
  };

  onTouchEnd = e => {
    // Обработаываем только непосредственно на элементе.
    if (e.target !== e.currentTarget) {
      return;
    }

    if (this.lastTouch && Date.now() - this.lastTouch.time < 500) {
      const { x, y } = this.lastTouch.position;

      // Если это не был свайп, то считаем что был просто тач.
      if (Math.abs(x - e.clientX) + Math.abs(y - e.clientY) < 50) {
        this.closeTopModal();
      }
    }
  };

  getReadyDialogs() {
    const { modals } = this.props;
    const { propsFetchedSet } = this.state;

    const dialogs = [];

    for (const { type, modalId, props } of modals) {
      const ModalComponent = modalsMap.get(type);
      const modalFetchData = propsFetchedSet[modalId];

      if (ModalComponent && modalFetchData) {
        dialogs.push({
          type,
          modalId,
          props,
          ModalComponent,
          modalFetchData,
        });
      }
    }

    return dialogs;
  }

  calculateHeight = () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  async closeTopModal() {
    const { closeModal, modals } = this.props;
    const { modalId } = last(modals);

    const modalRef = this.modalsRefs[modalId];

    if (modalRef && modalRef.current && modalRef.current.canClose) {
      if (!(await modalRef.current.canClose())) {
        return;
      }
    }

    closeModal(modalId);
  }

  render() {
    const { closeModal } = this.props;

    const dialogsInfo = this.getReadyDialogs();

    let isShowShadow = false;

    const dialogs = dialogsInfo.map(({ modalId, props, ModalComponent, modalFetchData }) => {
      let modalRef = this.modalsRefs[modalId];

      if (!modalRef) {
        modalRef = createRef();
        this.modalsRefs[modalId] = modalRef;
      }

      if (!isShowShadow && modalFetchData?.initialProps?.noBackgroundShadow !== true) {
        isShowShadow = true;
      }

      return (
        <KeyBusProvider key={modalId}>
          <ModalContainer id="modal__scroll-container" className="scroll-container">
            <ModalWrapper
              onMouseDown={this.onWrapperClick}
              onTouchStart={this.onTouchStart}
              onTouchEnd={this.onTouchEnd}
            >
              <ModalComponent
                {...props}
                {...modalFetchData.initialProps}
                modalId={modalId}
                modalRef={modalRef}
                close={result => closeModal(modalId, result)}
              />
            </ModalWrapper>
          </ModalContainer>
        </KeyBusProvider>
      );
    });

    if (dialogs.length) {
      return (
        <Wrapper>
          <ScrollLock />
          <ModalBackground isShowShadow={isShowShadow} />
          {dialogs}
        </Wrapper>
      );
    }

    return null;
  }
}
