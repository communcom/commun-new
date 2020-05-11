import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { DONATIONS_BADGE_NAME } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { parseLargeNumber } from 'utils/parseLargeNumber';

import Avatar from 'components/common/Avatar';

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const Badge = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
`;

const Plus = styled.span`
  margin-right: 2px;
  font-weight: 600;
  font-size: 17px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.blue};
`;

const AmountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Amount = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.blue};
`;

const Points = styled.span`
  font-size: 12px;
  line-height: 12px;
  color: ${({ theme }) => theme.colors.blue};
  text-transform: lowercase;
`;

const Tooltip = styled.div`
  position: absolute;
  top: -55px;
  left: -15px;
  z-index: 10;
  display: flex;
  align-items: center;
  min-width: 215px;
  padding: 5px;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 22px;

  &::after {
    position: absolute;
    bottom: -8px;
    left: ${({ amountWidth }) => `calc(${amountWidth / 2}px + 20px)`};
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background-color: ${({ theme }) => theme.colors.blue};
    transform: rotate(45deg) translateY(-50%);
  }
`;

const DonatorsRow = styled.div`
  display: flex;
  margin-right: 4px;

  & > :not(:last-child) {
    margin-right: -8px;
  }
`;

const AvatarStyled = styled(Avatar)`
  width: 34px;
  height: 34px;
  border: 2px solid ${({ theme }) => theme.colors.white};
`;

const Donations = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

const CloseButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 15px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  color: #fff;
`;

const CloseIcon = styled(Icon).attrs({ name: 'close' })`
  width: 15px;
  height: 15px;
`;

function DonationsBadge({ donations: { donations, totalAmount }, className }) {
  const { t } = useTranslation();
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  const tooltipRef = useRef(null);
  const amountRef = useRef(null);

  const onAwayClick = useCallback(
    e => {
      if (isTooltipVisible && !tooltipRef.current?.contains(e.target)) {
        setTooltipVisibility(false);
      }
    },
    [isTooltipVisible]
  );

  useEffect(() => {
    if (isTooltipVisible) {
      window.addEventListener('click', onAwayClick);
    }

    return () => {
      window.removeEventListener('click', onAwayClick);
    };
  }, [isTooltipVisible, onAwayClick]);

  const items = useMemo(() => {
    if (donations) {
      const sortedDonations = [...donations].sort(
        (a, b) => parseFloat(b.quantity) - parseFloat(a.quantity)
      );

      const topDonators = sortedDonations.map(({ sender }) => ({
        ...sender,
      }));

      if (topDonators.length > 3) {
        topDonators.length = 3;
      }

      return topDonators;
    }

    return [];
  }, [donations]);

  function onClick(e) {
    e.preventDefault();

    setTooltipVisibility(prevTooltipVisibility => !prevTooltipVisibility);
  }

  const getAmountWidth = useCallback(() => {
    if (amountRef?.current) {
      return amountRef.current.offsetWidth;
    }

    return 0;
  }, [amountRef]);

  if (!totalAmount) {
    return null;
  }

  return (
    <Wrapper className={className}>
      <Badge name={DONATIONS_BADGE_NAME} onClick={onClick}>
        <Plus>+</Plus>
        <AmountWrapper ref={amountRef}>
          <Amount>{parseLargeNumber(totalAmount.toFixed(0))}</Amount>
          <Points>{t('common.point', { count: Number(totalAmount.toFixed(0)) })}</Points>
        </AmountWrapper>
      </Badge>
      {isTooltipVisible && items.length ? (
        <Tooltip tooltipRef={tooltipRef} amountWidth={getAmountWidth()}>
          <DonatorsRow>
            {items.map(sender => (
              <AvatarStyled
                key={sender.userId}
                userId={sender.userId}
                passedUser={sender}
                useLink
              />
            ))}
          </DonatorsRow>
          {donations.length > items.length ? (
            <Donations>
              {t('tooltips.donate.donation', { count: donations.length - items.length })}
            </Donations>
          ) : null}
          <CloseButton aria-label={t('common.close')} onClick={onClick}>
            <CloseIcon />
          </CloseButton>
        </Tooltip>
      ) : null}
    </Wrapper>
  );
}

DonationsBadge.propTypes = {
  donations: PropTypes.shape({
    donations: PropTypes.string,
    totalAmount: PropTypes.number,
  }),
};

DonationsBadge.defaultProps = {
  donations: {
    donations: [],
    totalAmount: 0,
  },
};

export default DonationsBadge;
