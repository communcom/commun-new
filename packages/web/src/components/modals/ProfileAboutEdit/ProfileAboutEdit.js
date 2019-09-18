/* eslint-disable class-methods-use-this */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Loader } from '@commun/ui';

import { profileType } from 'types/common';
import { SOCIAL_NETWORKS_LIST } from 'shared/constants';
import { MODAL_CONFIRM } from 'store/constants';

const Wrapper = styled.div`
  flex-basis: 400px;
  padding: 28px;
  border-radius: 4px;
  background-color: #fff;
`;

const DescriptionBlock = styled.div`
  margin-bottom: 16px;
`;

const DescriptionHeader = styled.h2`
  margin: -2px 0 8px;
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  min-height: 256px;
  padding: 14px 16px;
  border-radius: 4px;
  line-height: 20px;
  font-size: 15px;
  background: ${({ theme }) => theme.colors.contextWhite};
  resize: none;
`;

const ContactsEditList = styled.ul`
  margin-top: 24px;
`;

const ContactEditItem = styled.li`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const EditModeIcon = styled(Icon)`
  width: 22px;
  height: 22px;
  margin-right: 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const ContactEditInput = styled.input.attrs({
  spellCheck: false,
  autoCapitalize: 'off',
  autoCorrect: 'off',
})`
  flex-grow: 1;
  width: 100px;
  height: 48px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 15px;
  background: ${({ theme }) => theme.colors.contextWhite};

  &::placeholder {
    color: ${({ theme }) => theme.colors.contextGrey};
  }
`;

const Actions = styled.div`
  display: flex;
  margin-top: 32px;

  & > * {
    flex-grow: 1;
    flex-basis: 100px;
  }

  & > :not(:last-child) {
    margin-right: 12px;
  }
`;

const Button = styled.button.attrs({
  type: 'button',
})`
  height: 48px;
  padding: 0 12px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
`;

const SaveButton = styled(Button)`
  color: #fff;
  background-color: ${({ theme }) => theme.colors.contextBlue};
`;

const ResetButton = styled(Button)`
  color: ${({ theme }) => theme.colors.contextBlue};
  border: 1px solid ${({ theme }) => theme.colors.contextBlue};
`;

export default class ProfileAboutEdit extends PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    profile: profileType.isRequired,
    close: PropTypes.func.isRequired,
    updateProfileMeta: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  state = {
    ...this.getStateFromProps(),
    isUpdating: false,
  };

  getStateFromProps() {
    const { profile } = this.props;

    if (!profile.personal) {
      return {
        desc: '',
        contacts: {},
      };
    }

    return {
      desc: profile.personal.about || '',
      contacts: profile.personal.contacts || {},
    };
  }

  onDescriptionChange = e => {
    this.setState({
      desc: e.target.value,
    });
  };

  onContactChange = (e, fieldName) => {
    const { contacts } = this.state;

    this.setState({
      contacts: {
        ...contacts,
        [fieldName]: e.target.value,
      },
    });
  };

  onResetClick = () => {
    this.setState(this.getStateFromProps());
  };

  onSaveClick = async () => {
    const { profile, updateProfileMeta, waitForTransaction, fetchProfile, close } = this.props;
    const { desc, contacts } = this.state;

    this.setState({
      isUpdating: true,
    });

    let result;

    try {
      result = await updateProfileMeta({
        about: desc,
        ...contacts,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      // eslint-disable-next-line no-alert
      window.alert(err);

      this.setState({
        isUpdating: false,
      });
      return;
    }

    try {
      await waitForTransaction(result.transaction_id);
    } catch {
      // Do nothing
    }

    try {
      await fetchProfile(profile.userId);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    close({ status: MODAL_CONFIRM });
  };

  renderContacts() {
    const { contacts } = this.state;

    return (
      <ContactsEditList>
        {SOCIAL_NETWORKS_LIST.map(social => (
          <ContactEditItem key={social.fieldName}>
            <EditModeIcon name={social.icon} title={social.name} />
            <ContactEditInput
              name={`profile__${social.name}-input`}
              placeholder={`Link to ${social.name}`}
              value={contacts[social.fieldName]}
              onChange={e => this.onContactChange(e, social.fieldName)}
            />
          </ContactEditItem>
        ))}
      </ContactsEditList>
    );
  }

  render() {
    const { desc, isUpdating } = this.state;

    return (
      <Wrapper>
        <DescriptionBlock>
          <DescriptionHeader>Description</DescriptionHeader>
          <DescriptionInput
            placeholder="Description"
            name="profile__description-input"
            value={desc}
            onChange={this.onDescriptionChange}
          />
        </DescriptionBlock>
        {this.renderContacts()}
        <Actions>
          <ResetButton
            name="profile__description-reset"
            disabled={isUpdating}
            onClick={this.onResetClick}
          >
            Reset
          </ResetButton>
          <SaveButton
            name="profile__description-submit"
            disabled={isUpdating}
            onClick={this.onSaveClick}
          >
            {isUpdating ? <Loader /> : 'Update'}
          </SaveButton>
        </Actions>
      </Wrapper>
    );
  }
}
