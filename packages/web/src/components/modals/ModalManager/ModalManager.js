import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { isNil, last } from 'ramda';

import {
  SHOW_MODAL_LOGIN,
  SHOW_MODAL_PROFILE_ABOUT_EDIT,
  SHOW_MODAL_SIGNUP,
  SHOW_MODAL_SEND_POINTS,
  SHOW_MODAL_CONVERT_POINTS,
  SHOW_MODAL_POST,
  SHOW_MODAL_POST_EDIT,
  SHOW_MODAL_RULE_EDIT,
  SHOW_MODAL_DESCRIPTION_EDIT,
  SHOW_MODAL_NEW_POST_EDITOR,
  SHOW_MODAL_CONFIRM,
  SHOW_MODAL_SET_CONTRACTS_KEYS,
  SHOW_MODAL_COMMUNITY_INIT_STATUS,
  SHOW_MODAL_BECOME_LEADER,
  SHOW_MODAL_AVATAR_EDIT,
  SHOW_MODAL_ONBOARDING,
} from 'store/constants/modalTypes';
import { up } from '@commun/ui';
import ScrollFix from 'components/common/ScrollFix';
import ScrollLock from 'components/common/ScrollLock';
import { getDynamicComponentInitialProps } from 'utils/lazy';
import { SHOW_MODAL_SHARE } from 'store/constants';

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
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 2;
`;

const modalsMap = new Map([
  [SHOW_MODAL_LOGIN, dynamic(() => import('components/modals/Login'))],
  [SHOW_MODAL_SIGNUP, dynamic(() => import('components/modals/SignUp'))],
  [SHOW_MODAL_PROFILE_ABOUT_EDIT, dynamic(() => import('components/modals/ProfileAboutEdit'))],
  [SHOW_MODAL_SEND_POINTS, dynamic(() => import('components/modals/SendPoints'))],
  [SHOW_MODAL_CONVERT_POINTS, dynamic(() => import('components/modals/ConvertPoints'))],
  [SHOW_MODAL_POST, dynamic(() => import('components/modals/PostModal'))],
  [SHOW_MODAL_NEW_POST_EDITOR, dynamic(() => import('components/modals/NewPostEditor'))],
  [SHOW_MODAL_POST_EDIT, dynamic(() => import('components/modals/PostEditModal'))],
  [SHOW_MODAL_RULE_EDIT, dynamic(() => import('components/modals/RuleEditModal'))],
  [SHOW_MODAL_DESCRIPTION_EDIT, dynamic(() => import('components/modals/DescriptionEditModal'))],
  [SHOW_MODAL_CONFIRM, dynamic(() => import('components/modals/ConfirmDialog'))],
  [SHOW_MODAL_BECOME_LEADER, dynamic(() => import('components/modals/BecomeLeader'))],
  [SHOW_MODAL_SHARE, dynamic(() => import('components/modals/ShareModal'))],
  [SHOW_MODAL_ONBOARDING, dynamic(() => import('components/modals/Onboarding'))],
  [SHOW_MODAL_AVATAR_EDIT, dynamic(() => import('components/modals/AvatarEdit'))],
  [
    SHOW_MODAL_SET_CONTRACTS_KEYS,
    dynamic(() => import('components/modals/community/SetContractKeysModal')),
  ],
  [
    SHOW_MODAL_COMMUNITY_INIT_STATUS,
    dynamic(() => import('components/modals/community/CommunityInitStatusModal')),
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

  async componentWillReceiveProps(nextProps) {
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

    const dialogs = dialogsInfo.map(({ modalId, props, ModalComponent, modalFetchData }) => {
      let modalRef = this.modalsRefs[modalId];

      if (!modalRef) {
        modalRef = createRef();
        this.modalsRefs[modalId] = modalRef;
      }

      return (
        <ModalContainer key={modalId} className="scroll-container">
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
      );
    });

    if (dialogs.length) {
      return (
        <Wrapper>
          <ScrollLock />
          <ModalBackground />
          {dialogs}
        </Wrapper>
      );
    }

    return null;
  }
}
