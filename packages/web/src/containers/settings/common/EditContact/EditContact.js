import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, Input, InvisibleText, Loader, Switch, up } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import ChooseContact from 'containers/settings/common/ChooseContact';
import AsyncButton from 'components/common/AsyncButton';
import { DropDownMenuItem } from 'components/common/DropDownMenu';
import { DropDownMenu, MoreActions } from 'components/common/EntityHeader';

const Wrapper = styled.div`
  padding: 10px 15px;

  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
`;

const SocialIcon = styled(Icon)`
  width: 30px;
  height: 30px;
`;

const Name = styled.span`
  flex-grow: 1;
  margin: 0 10px;
  font-size: 15px;
  white-space: nowrap;
`;

const MoreActionsStyled = styled(MoreActions)`
  ${is('isMobile')`
    position: absolute;
    top: 28px;
    right: 16px;
    z-index: 5;
    display: flex;

    ${up.tablet} {
      display: none;
    }
  `};
`;

const MoreIcon = styled(Icon).attrs({ name: 'more' })`
  width: 24px;
  height: 24px;

  ${is('isBig')`
    width: 40px;
    height: 40px;
  `};
`;

const FieldValue = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0 20px 0;
`;

const Error = styled.div`
  color: ${({ theme }) => theme.colors.red};
`;

const ContactDefault = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

const Actions = styled.div`
  display: flex;
  margin: 15px 0 20px 0;
`;

const CancelButton = styled(Button)`
  margin-left: 15px;
`;

const MessengerIcon = styled(Icon).attrs({ name: 'user' })`
  width: 12px;
  height: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;
const LinkIcon = styled(Icon).attrs({ name: 'link' })`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray};
`;

const EditContact = ({
  userId,
  contacts,
  contactId,
  contactDefault,
  value,
  type,
  isEditing,
  isMessengers,
  onChangeContact,
  onChangeValue,
  onChangeDefault,
  onClearContact,
  onSaveClick,
  updateProfileMeta,
  waitForTransaction,
  fetchProfile,
  t,
}) => {
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
  const [valueError, setValueError] = useState(null);

  const contact = contacts.find(c => c.contactId === contactId);

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

  const handleChangeValue = e => {
    const inputValue = e.target.value.trim();

    // TODO: validate
    // if (type === 'phone') {
    //   inputValue = inputValue.replace(/\D+/g, '');
    //
    //   if (!inputValue) {
    //     return;
    //   }
    // } else if (type === 'username') {
    //   inputValue = inputValue.replace(/[^.a-z0-9_-]+/g, '');
    //   if (!inputValue) {
    //     return;
    //   }
    //   // if (!/^[.a-z0-9_-]{3,16}$/.test(inputValue)) {
    //   //   setValueError('Неправльный формат username');
    //   // }
    // } else if (type === 'link') {
    // }

    onChangeValue(inputValue);
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
          <MoreActionsStyled {...props} name="profile-header__more-actions">
            <MoreIcon />
            <InvisibleText>{t('common.more')}</InvisibleText>
          </MoreActionsStyled>
        )}
        items={() => (
          <DropDownMenuItem onClick={onRemoveClick}>{t('common.remove')}</DropDownMenuItem>
        )}
      />
    );
  };

  return (
    <Wrapper>
      <Top>
        {isEditing ? (
          <>
            <SocialIcon name={contact.iconName} />
            <Name>{contact.name}</Name>
            {renderDropDownMenu()}
          </>
        ) : (
          <>
            <ChooseContact
              contacts={contacts}
              contactId={contactId}
              placeholder={t(
                `components.settings.links.${isMessengers ? 'add_contact' : 'add_link'}`
              )}
              PlaceholderIcon={isMessengers ? MessengerIcon : LinkIcon}
              onSelect={onChangeContact}
            />
          </>
        )}
      </Top>
      {contact ? (
        <>
          <FieldValue>
            <Input
              type="text"
              title={t(`components.settings.links.types.${contact.type}`)}
              value={value}
              onChange={handleChangeValue}
            />
            {valueError ? <Error>{valueError}</Error> : null}
          </FieldValue>
          {isMessengers ? (
            <ContactDefault>
              {t('components.settings.links.default')}
              <Switch value={contactDefault} onChange={onChangeDefault} />
            </ContactDefault>
          ) : null}
          <Actions>
            <AsyncButton primary onClick={onSaveClick}>
              {t('common.save')}
            </AsyncButton>
            <CancelButton onClick={onClearContact}>{t('common.cancel')}</CancelButton>
          </Actions>
        </>
      ) : null}
    </Wrapper>
  );
};

EditContact.propTypes = {
  userId: PropTypes.string,
  contacts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  contactId: PropTypes.string,
  contactDefault: PropTypes.bool,
  value: PropTypes.string,
  type: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
  isMessengers: PropTypes.bool,
  onChangeContact: PropTypes.func,
  onChangeValue: PropTypes.func.isRequired,
  onChangeDefault: PropTypes.func.isRequired,
  onClearContact: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,

  updateProfileMeta: PropTypes.func.isRequired,
  waitForTransaction: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
};

EditContact.defaultProps = {
  userId: undefined,
  contactId: undefined,
  contactDefault: false,
  value: undefined,
  isEditing: false,
  isMessengers: false,
  onChangeContact: undefined,
};

export default withTranslation()(EditContact);
