import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';

import { profileType } from 'types';
import { SOCIAL_MESSENGERS_LIST } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

import { CloseButtonStyled, DescriptionHeader, ModalName, Wrapper } from 'components/modals/common';

const WrapperStyled = styled(Wrapper)`
  flex-basis: 450px;
  height: auto;
  padding: 20px 15px;
  margin: auto 0 5px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 24px 24px 0 0;

  ${up.mobileLandscape} {
    margin: 0;
  }
`;

const DescriptionHeaderStyled = styled(DescriptionHeader)`
  justify-content: space-between;
`;

const CloseButton = styled(CloseButtonStyled)`
  display: flex;
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.colors.gray};
  background-color: #fff;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const ContentWrapper = styled.section``;

const Menu = styled.ul`
  overflow: hidden;

  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

const MenuItem = styled.li``;

const MenuAction = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
`;

const ContactIcon = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const ContactInfo = styled.div`
  flex: 1;
  margin: 0 15px;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
`;

const ContactName = styled.div`
  margin-bottom: 5px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
`;

const ContactValue = styled.div`
  line-height: 1;
  color: ${({ theme }) => theme.colors.blue};
`;

const ContactTextLink = styled.a`
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
`;

const ContactIconLink = styled.a``;

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

const ChevronIcon = styled(Icon).attrs({ name: 'chevron' })`
  transform: rotate(-90deg);
`;

@withTranslation()
export default class ProfileMobileContactsModal extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,

    close: PropTypes.func.isRequired,
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  renderContactItem({ contactId, iconName, name, href }) {
    const { profile, t } = this.props;

    const contact = profile.personal.messengers[contactId];

    return (
      <MenuAction>
        <ContactIcon name={iconName} />
        <ContactInfo>
          <ContactName>{name}</ContactName>
          <ContactValue>
            {href ? (
              <ContactTextLink href={href} target="_blank" rel="noopener noreferrer noindex">
                {contact.value}
              </ContactTextLink>
            ) : (
              contact.value
            )}
          </ContactValue>
        </ContactInfo>
        {href ? (
          <ContactIconLink href={href} target="_blank" rel="noopener noreferrer noindex">
            <OpenCircle>
              <ChevronIcon />
            </OpenCircle>
          </ContactIconLink>
        ) : null}
      </MenuAction>
    );
  }

  render() {
    const { profile, t } = this.props;

    return (
      <WrapperStyled role="dialog">
        <DescriptionHeaderStyled>
          <ModalName>{t('modals.profile_mobile_contacts.title')}</ModalName>
          <CloseButton onClick={this.onCloseClick} />
        </DescriptionHeaderStyled>
        <ContentWrapper>
          <Menu>
            {profile.personal.defaultContacts.map(contactId => {
              const contact = SOCIAL_MESSENGERS_LIST.find(item => item.contactId === contactId);

              if (contact) {
                return <MenuItem key={contactId}>{this.renderContactItem(contact)}</MenuItem>;
              }
            })}
          </Menu>
        </ContentWrapper>
      </WrapperStyled>
    );
  }
}
