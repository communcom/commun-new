/* eslint-disable class-methods-use-this */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// TODO: will be implemented after MVP
// import { Icon } from '@commun/icons';
import { Loader } from '@commun/ui';

import { profileType } from 'types/common';
import { BIO_MAX_LENGTH } from 'shared/constants';
// TODO: will be implemented after MVP
// import { SOCIAL_NETWORKS_LIST } from 'shared/constants';
import {
  Wrapper,
  DescriptionBlock,
  DescriptionHeader,
  ModalName,
  DescriptionInputWrapper,
  DescriptionInput,
  Actions,
  SaveButton,
  ResetButton,
  CloseButtonStyled,
  BackButton,
  DescriptionLength,
} from '../common/common.styled';

// TODO: will be implemented after MVP

// const ContactsEditList = styled.ul`
//   margin-top: 24px;
// `;

// const ContactEditItem = styled.li`
//   display: flex;
//   align-items: center;

//   &:not(:last-child) {
//     margin-bottom: 16px;
//   }
// `;

// const EditModeIcon = styled(Icon)`
//   width: 22px;
//   height: 22px;
//   margin-right: 16px;
//   color: ${({ theme }) => theme.colors.gray};
// `;

// const ContactEditInput = styled.input.attrs({
//   spellCheck: false,
//   autoCapitalize: 'off',
//   autoCorrect: 'off',
// })`
//   flex-grow: 1;
//   width: 100px;
//   height: 48px;
//   padding: 0 16px;
//   border-radius: 8px;
//   font-size: 15px;
//   background: ${({ theme }) => theme.colors.lightGrayBlue};

//   &::placeholder {
//     color: ${({ theme }) => theme.colors.gray};
//   }
// `;

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
        biography: '',
        // TODO: will be implemented after MVP
        // contacts: {},
      };
    }

    return {
      biography: profile.personal.biography || '',
      // TODO: will be implemented after MVP
      // contacts: profile.personal.contacts || {},
    };
  }

  onDescriptionChange = e => {
    if (e.target.value.length > BIO_MAX_LENGTH) {
      return;
    }

    this.setState({
      biography: e.target.value,
    });
  };

  // TODO: will be implemented after MVP
  // onContactChange = (e, fieldName) => {
  //   const { contacts } = this.state;

  //   this.setState({
  //     contacts: {
  //       ...contacts,
  //       [fieldName]: e.target.value,
  //     },
  //   });
  // };

  onResetClick = () => {
    this.setState(this.getStateFromProps());
  };

  onSaveClick = async () => {
    const { profile, updateProfileMeta, waitForTransaction, fetchProfile, close } = this.props;
    const { biography } = this.state;

    this.setState({
      isUpdating: true,
    });

    let result;

    try {
      result = await updateProfileMeta({
        biography,
        // TODO: will be implemented after MVP
        // ...contacts,
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
      await fetchProfile({ userId: profile.userId });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    close();
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  // TODO: will be implemented after MVP
  // renderContacts() {
  //   const { contacts } = this.state;

  //   return (
  //     <ContactsEditList>
  //       {SOCIAL_NETWORKS_LIST.map(social => (
  //         <ContactEditItem key={social.fieldName}>
  //           <EditModeIcon name={social.icon} title={social.name} />
  //           <ContactEditInput
  //             name={`profile__${social.name}-input`}
  //             placeholder={`Link to ${social.name}`}
  //             value={contacts[social.fieldName]}
  //             onChange={e => this.onContactChange(e, social.fieldName)}
  //           />
  //         </ContactEditItem>
  //       ))}
  //     </ContactsEditList>
  //   );
  // }

  render() {
    const { biography, isUpdating } = this.state;
    const { biography: initialBiography } = this.getStateFromProps();
    const isChanged = biography !== initialBiography;

    return (
      <Wrapper>
        <DescriptionBlock>
          <DescriptionHeader>
            <BackButton onClick={this.onCloseClick} />
            <ModalName>Edit Bio</ModalName>
            <CloseButtonStyled onClick={this.onCloseClick} />
          </DescriptionHeader>
          <DescriptionInputWrapper>
            <DescriptionInput
              placeholder="Type something about you"
              name="profile__description-input"
              value={biography}
              maxLength={BIO_MAX_LENGTH}
              onChange={this.onDescriptionChange}
            />
            <DescriptionLength>{`${biography.length}/${BIO_MAX_LENGTH}`}</DescriptionLength>
          </DescriptionInputWrapper>
        </DescriptionBlock>
        {/* TODO: will be implemented after MVP */}
        {/* {this.renderContacts()} */}
        <Actions>
          <ResetButton
            name="profile__description-reset"
            disabled={isUpdating || !isChanged}
            isChanged={isChanged}
            onClick={this.onResetClick}
          >
            Reset
          </ResetButton>
          <SaveButton
            name="profile__description-submit"
            disabled={isUpdating || !isChanged}
            isChanged={isChanged}
            onClick={this.onSaveClick}
          >
            {isUpdating ? <Loader /> : 'Save'}
          </SaveButton>
        </Actions>
      </Wrapper>
    );
  }
}
