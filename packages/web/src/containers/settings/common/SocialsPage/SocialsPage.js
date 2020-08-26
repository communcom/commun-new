import React, { Component } from 'react';
import PropTypes from 'prop-types';
import equals from 'ramda/src/equals';
import symmetricDifference from 'ramda/src/symmetricDifference';

import { Panel } from '@commun/ui';

import { profileType } from 'types';
import { SOCIAL_LINKS_LIST, SOCIAL_MESSENGERS_LIST } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import Contact from 'containers/settings/common/Contact';
import EditContact from 'containers/settings/common/EditContact';

@withTranslation()
export default class SocialsPage extends Component {
  static propTypes = {
    isMessengers: PropTypes.bool,
    profile: profileType.isRequired,
    updateProfileMeta: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isMessengers: false,
  };

  static updateStateContacts = (props, state) => {
    const { profile, isMessengers } = props;

    const items = isMessengers ? SOCIAL_MESSENGERS_LIST : SOCIAL_LINKS_LIST;
    const type = isMessengers ? 'messengers' : 'links';

    const contacts = {};
    items.map(item => {
      const contact = profile.personal?.[type]?.[item.contactId];

      if (contact) {
        contacts[item.contactId] = {
          ...state?.contacts[item.contactId],
          ...contact,
        };
      }
    });

    return contacts;
  };

  constructor(props) {
    super(props);

    this.state = {
      current: {
        contactId: null,
        contactDefault: false,
        value: null,
      },
      prevContactsIds: [],
      prevPersonal: this.props.profile.personal,
      contacts: SocialsPage.updateStateContacts(this.props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { profile, isMessengers } = props;

    const type = isMessengers ? 'messengers' : 'links';
    const contacts = profile.personal[type];

    if (contacts && symmetricDifference(Object.keys(contacts), state.prevContactsIds).length) {
      return {
        prevContactsIds: Object.keys(contacts),
        contacts: SocialsPage.updateStateContacts(props, state),
      };
    }

    if (!equals(state.prevPersonal, profile.personal)) {
      return {
        contacts: SocialsPage.updateStateContacts(props, state),
      };
    }

    return null;
  }

  onChangeDefault = contactId => async flag => {
    if (!contactId) {
      this.setState(state => ({
        current: {
          ...state.current,
          contactDefault: flag,
        },
      }));
      return;
    }

    this.setState(state => ({
      contacts: {
        ...state.contacts,
        [contactId]: {
          ...state.contacts[contactId],
          contactDefault: flag,
        },
      },
    }));
  };

  onChangeValue = contactId => value => {
    if (!contactId) {
      this.setState(state => ({
        current: {
          ...state.current,
          value,
        },
      }));
      return;
    }

    const { contacts } = this.state;

    this.setState({
      contacts: {
        ...contacts,
        [contactId]: {
          ...contacts[contactId],
          value,
        },
      },
    });
  };

  onClearContact = contactId => () => {
    if (!contactId) {
      this.setState({
        current: {},
      });
      return;
    }

    this.setState(state => ({
      contacts: {
        ...state.contacts,
        [contactId]: {
          ...state.contacts[contactId],
          isEditing: false,
        },
      },
    }));
  };

  onEditClick = contactId => () => {
    this.setState(state => ({
      contacts: {
        ...state.contacts,
        [contactId]: {
          ...state.contacts[contactId],
          isEditing: true,
        },
      },
    }));
  };

  onSaveClick = contactId => async () => {
    const { updateProfileMeta, fetchProfile, profile, waitForTransaction, t } = this.props;

    try {
      if (!contactId) {
        const { current } = this.state;

        const result = await updateProfileMeta({
          [current.contactId]: JSON.stringify({
            value: current.value,
            default: current.contactDefault || false,
          }),
        });
        await waitForTransaction(result.transaction_id);
        await fetchProfile({ userId: profile.userId });

        displaySuccess(t('toastsMessages.saved'));
        this.onClearContact()();
        return;
      }

      const { contacts } = this.state;
      const contact = contacts[contactId];

      const result = await updateProfileMeta({
        [contactId]: JSON.stringify({
          value: contact.value,
          default: contact.contactDefault || false,
        }),
      });
      await waitForTransaction(result.transaction_id);
      await fetchProfile({ userId: profile.userId });

      displaySuccess(t('toastsMessages.saved'));
      this.onClearContact(contactId)();
    } catch (err) {
      displayError(err);
    }
  };

  onChangeContact = contactId => {
    this.setState({
      current: {
        contactId,
      },
    });
  };

  freshContacts() {
    const { profile, isMessengers } = this.props;

    const type = isMessengers ? 'messengers' : 'links';
    const keys = Object.keys(profile.personal[type] || {});

    return (isMessengers ? SOCIAL_MESSENGERS_LIST : SOCIAL_LINKS_LIST).filter(
      item => !keys.includes(item.contactId)
    );
  }

  renderContacts = () => {
    const { profile, isMessengers } = this.props;
    const { contacts } = this.state;

    return (isMessengers ? SOCIAL_MESSENGERS_LIST : SOCIAL_LINKS_LIST).map(item => {
      const contact = contacts[item.contactId];

      if (!contact) {
        return null;
      }

      if (contact.isEditing) {
        return (
          <EditContact
            key={item.contactId}
            userId={profile.userId}
            contacts={isMessengers ? SOCIAL_MESSENGERS_LIST : SOCIAL_LINKS_LIST}
            contactId={item.contactId}
            contactDefault={contact.contactDefault}
            value={contact.value}
            type={item.type}
            onClearContact={this.onClearContact(item.contactId)}
            onChangeValue={this.onChangeValue(item.contactId)}
            onChangeDefault={this.onChangeDefault(item.contactId)}
            onSaveClick={this.onSaveClick(item.contactId)}
            isMessengers={isMessengers}
            isEditing
          />
        );
      }

      return (
        <Contact
          key={item.contactId}
          userId={profile.userId}
          {...item}
          href={contact.href}
          value={contact.value}
          contactDefault={contact.default}
          onEditClick={this.onEditClick(item.contactId)}
          onChangeDefault={this.onChangeDefault(item.contactId)}
          isMessengers={isMessengers}
        />
      );
    });
  };

  renderAddContact() {
    const { isMessengers } = this.props;
    const { current } = this.state;

    const contacts = this.freshContacts();

    if (!contacts.length) {
      return null;
    }

    return (
      <EditContact
        contacts={contacts}
        contactId={current.contactId}
        contactDefault={current.contactDefault}
        value={current.value}
        onChangeContact={this.onChangeContact}
        onClearContact={this.onClearContact()}
        onChangeValue={this.onChangeValue()}
        onChangeDefault={this.onChangeDefault()}
        onSaveClick={this.onSaveClick()}
        isMessengers={isMessengers}
      />
    );
  }

  render() {
    const { isMessengers, isMobile, t } = this.props;

    if (isMobile) {
      return (
        <div>
          {this.renderContacts()}
          {this.renderAddContact()}
        </div>
      );
    }

    return (
      <Panel
        title={t(`components.settings.tabs.${isMessengers ? 'messengers' : 'links'}`)}
        noPadding
      >
        {this.renderContacts()}
        {this.renderAddContact()}
      </Panel>
    );
  }
}
