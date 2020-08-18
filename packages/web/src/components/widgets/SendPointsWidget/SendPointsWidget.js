import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { useTranslation } from 'shared/i18n';
import { SHOW_MODAL_SEND_POINTS } from 'store/constants';

import { WidgetCard, WidgetHeader } from 'components/widgets/common';

const WidgetCardStyled = styled(WidgetCard)`
  cursor: pointer;
`;

const WidgetHeaderStyled = styled(WidgetHeader)`
  min-height: 50px;
  height: auto;
`;

const CircleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const WalletIcon = styled(Icon).attrs({ name: 'wallet' })`
  widht: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.blue};
`;

const Text = styled.div`
  flex: 1;
  margin-left: 15px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue};
`;

const OpenCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  color: ${({ theme }) => theme.colors.gray};
`;

const ArrowIcon = styled(Icon).attrs({ name: 'chevron' })`
  transform: rotate(-90deg);
`;

export default function SendPointsWidget({ profile, isOwner, openModal }) {
  const { t } = useTranslation();

  if (isOwner) {
    return null;
  }

  const sendPointsHandler = () => {
    openModal(SHOW_MODAL_SEND_POINTS, { selectedUser: profile });
  };

  return (
    <WidgetCardStyled onClick={sendPointsHandler}>
      <WidgetHeaderStyled
        title={
          <>
            <CircleWrapper>
              <WalletIcon />
            </CircleWrapper>
            <Text>{t('components.profile.profile_header.send_points')}</Text>
            <OpenCircle>
              <ArrowIcon />
            </OpenCircle>
          </>
        }
      />
    </WidgetCardStyled>
  );
}

SendPointsWidget.propTypes = {
  profile: PropTypes.object,
  isOwner: PropTypes.bool,
  openModal: PropTypes.func.isRequired,
};

SendPointsWidget.defaultProps = {
  profile: undefined,
  isOwner: false,
};
