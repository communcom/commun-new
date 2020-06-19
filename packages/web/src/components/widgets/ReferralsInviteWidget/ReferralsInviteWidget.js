import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, styles, up } from '@commun/ui';

import { useTranslation } from 'shared/i18n';
import { SHOW_MODAL_SHARE } from 'store/constants';

import { WidgetCard } from 'components/widgets/common';

const WidgetCardStyled = styled(WidgetCard)`
  position: relative;
  margin: 10px;
  padding: 20px 15px;
  width: auto;
  border-radius: 10px;
  overflow: hidden;

  ${up.mobileLandscape} {
    margin: 0 0 20px;
  }

  ${up.tablet} {
    width: 100%;
  }
`;

const HiddenInput = styled.input.attrs({ type: 'text' })`
  ${styles.visuallyHidden};
`;

const InviteId = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.black};
`;

const Text = styled.div`
  margin: 6px 200px 9px 0;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Buttons = styled.div``;

const ButtonStyled = styled(Button)`
  min-width: 64px;

  ${up.mobileLandscape} {
    min-width: 130px;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const Image = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  max-height: 100%;
  width: 176px;
`;

export default function InviteWidget({ currentUserId, openModal }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  if (!currentUserId) {
    return null;
  }

  function handleCopyClick() {
    const input = inputRef.current;

    input.focus();
    input.setSelectionRange(0, input.value.length);
    document.execCommand('copy');
  }

  function handleShareClick(e) {
    e.preventDefault();
    openModal(SHOW_MODAL_SHARE, {
      title: '',
      post: {
        url: '/', // a little hack
      },
    });
  }

  return (
    <WidgetCardStyled noPadding>
      <HiddenInput ref={inputRef} value={currentUserId} />
      <InviteId>{currentUserId}</InviteId>
      <Text>{t('widgets.referrals_invite.text')}</Text>
      <Buttons>
        <ButtonStyled primary onClick={handleShareClick}>
          {t('widgets.referrals_invite.share')}
        </ButtonStyled>
        <ButtonStyled primary onClick={handleCopyClick}>
          {t('widgets.referrals_invite.copy')}
        </ButtonStyled>
      </Buttons>
      <Image src="/images/widgets/referrals_invite.png" alt="" />
    </WidgetCardStyled>
  );
}

InviteWidget.propTypes = {
  currentUserId: PropTypes.string,
  openModal: PropTypes.func.isRequired,
};

InviteWidget.defaultProps = {
  currentUserId: undefined,
};
