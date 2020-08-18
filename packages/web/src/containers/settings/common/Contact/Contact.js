import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Loader, Switch } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { displaySuccess } from 'utils/toastsMessages';

const Wrapper = styled.div`
  display: flex;
  padding: 20px 15px;

  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const ContactIcon = styled(Icon)`
  width: 30px;
  height: 30px;
`;

const ContactInfo = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const ContactTop = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
`;

const ContactName = styled.div`
  flex: 1;
  font-size: 15px;
`;

const Value = styled.div`
  margin-right: 50px;
  font-size: 15px;
`;

const ContactTextLink = styled.a`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.blue};
`;

const ContactEdit = styled.button`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.blue};
`;

const ContactDefault = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Contact = ({
  userId,
  name,
  href,
  value,
  iconName,
  contactId,
  contactDefault,
  isMessengers,
  onEditClick,
  onChangeDefault,
  updateProfileMeta,
  waitForTransaction,
  fetchProfile,
  t,
}) => {
  const [isDefaultLoading, setIsDefaultLoading] = useState(false);

  const onChange = async flag => {
    setIsDefaultLoading(true);
    const result = await updateProfileMeta({
      [contactId]: JSON.stringify({
        value,
        default: flag,
      }),
    });
    await waitForTransaction(result.transaction_id);
    await fetchProfile({ userId });

    onChangeDefault(flag);
    displaySuccess(t('toastsMessages.saved'));

    setIsDefaultLoading(false);
  };

  return (
    <Wrapper>
      <ContactIcon name={iconName} />
      <ContactInfo>
        <ContactTop>
          <ContactName>{name}</ContactName>
          <Value>
            {href ? (
              <ContactTextLink href={href} target="_blank" rel="noopener noreferrer noindex">
                {value}
              </ContactTextLink>
            ) : (
              value
            )}
          </Value>
          <ContactEdit onClick={onEditClick}>{t('common.edit')}</ContactEdit>
        </ContactTop>
        {isMessengers ? (
          <ContactDefault>
            {t('components.settings.links.default')}
            {isDefaultLoading ? <Loader /> : <Switch value={contactDefault} onChange={onChange} />}
          </ContactDefault>
        ) : null}
      </ContactInfo>
    </Wrapper>
  );
};

Contact.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  contactId: PropTypes.bool.isRequired,
  contactDefault: PropTypes.bool.isRequired,
  isMessengers: PropTypes.bool,
  onEditClick: PropTypes.func.isRequired,
  onChangeDefault: PropTypes.func.isRequired,

  updateProfileMeta: PropTypes.func.isRequired,
  waitForTransaction: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
};

Contact.defaultProps = {
  isMessengers: false,
};

export default withTranslation()(Contact);
