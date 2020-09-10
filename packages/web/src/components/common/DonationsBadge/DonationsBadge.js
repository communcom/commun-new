import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { useTranslation } from 'shared/i18n';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
`;

const CircleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  height: 28px;
  width: 28px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 50%;
  cursor: pointer;
`;

const DonateIcon = styled(Icon).attrs({ name: 'reward' })`
  width: 15px;
  height: 18px;
`;

const CoolWrapper = styled.div`
  margin-right: 15px;
  height: 28px;
  width: 28px;
  background: url('./images/cool-donate.png') ${({ theme }) => theme.colors.lightGrayBlue} 50% 50%
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
      return t('components.donations_badge.donate_post');
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
      {donations.length ? (
        <CircleWrapper onClick={handleDonatesClick}>
          <DonateIcon />
        </CircleWrapper>
      ) : (
        <CoolWrapper />
      )}
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
