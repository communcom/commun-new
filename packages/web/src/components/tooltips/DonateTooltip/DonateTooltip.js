import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import { contentIdType, userType } from 'types';
import { useTranslation } from 'shared/i18n';
import { SEND_MODAL_TYPE } from 'shared/constants';
import { SHOW_MODAL_SEND_POINTS } from 'store/constants';

const Wrapper = styled.div`
  position: absolute;
  bottom: 50px;
  left: 0;
  z-index: 3;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(100vw - 20px);
  height: 44px;
  padding: 0 5px 0 15px;
  background-color: ${({ theme }) => theme.colors.blue};
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  border-radius: 22px;
  color: #fff;
  transition: opacity 1s;

  @media (min-width: 360px) {
    width: 335px;
    margin: 0;
  }

  &:before {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 37px;
    width: 14px;
    height: 14px;
    background-color: ${({ theme }) => theme.colors.blue};
    border-radius: 2px;
    transform: matrix(0.71, 0.69, -0.72, 0.71, 0, 0);
  }
`;

const Left = styled.div`
  margin-bottom: 2px;
  font-weight: bold;
  font-size: 10px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.6);
`;

const Strong = styled.div`
  font-size: 12px;
  color: #fff;
`;

const Buttons = styled.div`
  display: flex;
  margin-left: 8px;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  overflow-x: scroll;

  ${up.tablet} {
    overflow-x: auto;
  }
`;

const Button = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 34px;
  padding: 0 5px;
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);

  &:not(:last-child) {
    margin-right: 5px;
  }
`;

function DonateTooltip({ tooltipRef, entity: { contentId }, author, openModal, className }) {
  const { t } = useTranslation();

  const handleClick = sendAmount => () => {
    openModal(SHOW_MODAL_SEND_POINTS, {
      type: SEND_MODAL_TYPE.DONATE_POINTS,
      selectedUser: author,
      sendAmount,
      symbol: contentId.communityId,
      memo: `donation for ${contentId.communityId}:${contentId.userId}:${contentId.permlink}`,
    });
  };

  return (
    <Wrapper ref={tooltipRef} className={className}>
      <Left>
        <Strong>{t('tooltips.donate.title')}:</Strong>
        {t('tooltips.donate.points')}
      </Left>
      <Buttons>
        <Container>
          <Button onClick={handleClick('10')}>+10</Button>
          <Button onClick={handleClick('100')}>+100</Button>
          <Button onClick={handleClick('1000')}>+1000</Button>
          <Button onClick={handleClick()}>{t('tooltips.donate.other')}</Button>
        </Container>
      </Buttons>
    </Wrapper>
  );
}

DonateTooltip.propTypes = {
  tooltipRef: PropTypes.object.isRequired,
  entity: PropTypes.shape({
    contentId: contentIdType.isRequired,
  }).isRequired,
  author: userType,
  openModal: PropTypes.func.isRequired,
};

DonateTooltip.defaultProps = {
  author: null,
};

export default DonateTooltip;
