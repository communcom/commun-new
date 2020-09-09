import React from 'react'; // useCallback, useEffect, useMemo, useRef, useState
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SEND_MODAL_TYPE } from 'shared/constants';
// import { Icon } from '@commun/icons';
// import { up } from '@commun/ui';
//
// import { DONATIONS_BADGE_NAME } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { SHOW_MODAL_DONATES, SHOW_MODAL_SEND_POINTS } from 'store/constants';
// import { parseLargeNumber } from 'utils/parseLargeNumber';
//
// import Avatar from 'components/common/Avatar';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
`;

const CircleWrapper = styled.div`
  margin-right: 15px;
  height: 28px;
  width: 28px;
  background: url('/images/thumb-up.png') ${({ theme }) => theme.colors.lightGrayBlue} 50% 50%
    no-repeat;
  border-radius: 50%;
  cursor: pointer;
`;

const Names = styled.div`
  flex: 1;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.gray};
  cursor: pointer;
`;

const Donate = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
`;

// const Badge = styled.button.attrs({ type: 'button' })`
//   display: flex;
//   align-items: center;
// `;
//
// const Plus = styled.span`
//   margin-right: 2px;
//   font-weight: 600;
//   font-size: 17px;
//   line-height: 20px;
//   color: ${({ theme }) => theme.colors.blue};
// `;
//
// const AmountWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;
//
// const Amount = styled.span`
//   font-weight: 700;
//   font-size: 14px;
//   line-height: 16px;
//   color: ${({ theme }) => theme.colors.blue};
// `;
//
// const Points = styled.span`
//   font-size: 12px;
//   line-height: 12px;
//   color: ${({ theme }) => theme.colors.blue};
//   text-transform: lowercase;
// `;
//
// const Tooltip = styled.div`
//   position: absolute;
//   bottom: 50px;
//   z-index: 10;
//   display: flex;
//   align-items: center;
//   padding: 5px 35px 5px 5px;
//   background-color: ${({ theme }) => theme.colors.blue};
//   border-radius: 22px;
//
//   &::after {
//     position: absolute;
//     bottom: -8px;
//     left: 50%;
//     content: '';
//     display: block;
//     width: 10px;
//     height: 10px;
//     border-radius: 2px;
//     background-color: ${({ theme }) => theme.colors.blue};
//     transform: rotate(45deg) translateY(-50%);
//   }
//
//   ${up.tablet} {
//     left: -15px;
//
//     &::after {
//       left: ${({ amountWidth }) => `calc(${amountWidth / 2}px + 20px)`};
//     }
//   }
// `;
//
// const DonatorsRow = styled.div`
//   display: flex;
//   margin-right: 4px;
//   z-index: 1;
//
//   & > :not(:last-child) {
//     margin-right: -8px;
//   }
// `;
//
// const AvatarStyled = styled(Avatar)`
//   width: 34px;
//   height: 34px;
//   border: 2px solid ${({ theme }) => theme.colors.white};
// `;
//
// const Donations = styled.span`
//   font-size: 14px;
//   font-weight: 600;
//   color: #fff;
//   white-space: nowrap;
// `;
//
// const CloseButton = styled.button.attrs({ type: 'button' })`
//   position: absolute;
//   top: 15px;
//   right: 10px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 15px;
//   height: 15px;
//   color: #fff;
// `;
//
// const CloseIcon = styled(Icon).attrs({ name: 'close' })`
//   width: 15px;
//   height: 15px;
// `;

function DonationsBadge({
  entity: { contentId, author },

  isOwner,
  donations,
  openDonationsModal,
  openDonateModal,
  className,
}) {
  const { t } = useTranslation();

  const handleDonateClick = () => {
    openDonateModal(author, contentId);
  };

  const handleDonatesClick = () => {
    openDonationsModal({ contentId });
  };

  const renderNames = () => {
    if (!donations.length) {
      return t('components.donations_badge.vote_post');
    }

    const partDonations = donations.slice(0, 1);

    let names = partDonations.map(donation => donation.sender.username).join(', ');

    if (donations.length > 1) {
      names += ` ${t('components.donations_badge.others')}`;
    }

    return names;
  };

  if (isOwner && !donations.length) {
    return null;
  }

  return (
    <Wrapper className={className}>
      {donations ? <CircleWrapper onClick={handleDonatesClick} /> : null}
      <Names onClick={handleDonatesClick}>{renderNames()}</Names>
      {!isOwner ? (
        <Donate onClick={handleDonateClick}>{t('components.donations_badge.donate')}</Donate>
      ) : null}
    </Wrapper>
  );
}

DonationsBadge.propTypes = {
  entity: PropTypes.object.isRequired,

  isOwner: PropTypes.bool,
  donations: PropTypes.arrayOf(PropTypes.object),
  openDonationsModal: PropTypes.func.isRequired,
  openDonateModal: PropTypes.func.isRequired,
};

DonationsBadge.defaultProps = {
  isOwner: false,
  donations: {
    donations: [],
    totalAmount: 0,
  },
};

export default DonationsBadge;
