import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { InvisibleText, Loader, Switch } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import { DropDownMenuItem } from 'components/common/DropDownMenu';
import { DropDownMenu } from 'components/common/EntityHeader';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 15px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;

  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const ContactTop = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  height: 60px;
  padding: 20px 15px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const ContactIcon = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const ContactName = styled.div`
  flex: 1;
  margin-left: 15px;
  font-size: 15px;
  font-weight: 600;
`;

const MoreActions = styled.button.attrs({ type: 'button' })`
  display: flex;

  justify-content: center;
  align-items: center;
  width: 30px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray};
  background-color: transparent;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const MoreIcon = styled(Icon).attrs({ name: 'more' })`
  width: 24px;
  height: 24px;
`;

const ContactInfo = styled.div`
  padding: 10px 15px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const ContactType = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.gray};
`;

const ContactValue = styled.div`
  margin-top: 6px;
  font-size: 15px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.black};
`;

const ContactTextLink = styled.a`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.blue};
`;

const ContactDefault = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 19px 15px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Contact = ({
  userId,
  name,
  href,
  value,
  type,
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
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
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

  const onRemoveClick = async () => {
    setIsRemoveLoading(true);

    try {
      const result = await updateProfileMeta({
        [contactId]: '', // will be written like null in bd
      });
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId });
      displaySuccess(t('components.settings.links.toastsMessages.removed'));
    } catch (err) {
      displayError(err);
    }

    setIsRemoveLoading(false);
  };

  const renderDropDownMenu = () => {
    if (isRemoveLoading) {
      return <Loader />;
    }

    return (
      <DropDownMenu
        align="right"
        openAt="bottom"
        handler={props => (
          <MoreActions {...props} name="profile-header__more-actions">
            <MoreIcon />
            <InvisibleText>{t('common.more')}</InvisibleText>
          </MoreActions>
        )}
        items={() => (
          <>
            <DropDownMenuItem onClick={onEditClick}>{t('common.edit')}</DropDownMenuItem>
            <DropDownMenuItem onClick={onRemoveClick}>{t('common.remove')}</DropDownMenuItem>
          </>
        )}
      />
    );
  };

  return (
    <Wrapper>
      <ContactTop>
        <ContactIcon name={iconName} />
        <ContactName>{name}</ContactName>
        {renderDropDownMenu()}
      </ContactTop>
      <ContactInfo>
        <ContactType>{t(`components.settings.links.types.${type}`)}</ContactType>
        <ContactValue>
          {href ? (
            <ContactTextLink href={href} target="_blank" rel="noopener noreferrer noindex">
              {type === 'username' ? `@${value}` : value}
            </ContactTextLink>
          ) : type === 'username' ? (
            `@${value}`
          ) : (
            value
          )}
        </ContactValue>
      </ContactInfo>
      {isMessengers ? (
        <ContactDefault>
          {t('components.settings.links.default')}
          {isDefaultLoading ? <Loader /> : <Switch value={contactDefault} onChange={onChange} />}
        </ContactDefault>
      ) : null}
    </Wrapper>
  );
};

Contact.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
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
