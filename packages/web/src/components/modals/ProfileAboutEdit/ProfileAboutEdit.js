/* eslint-disable class-methods-use-this */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// TODO: will be implemented after MVP
// import { Icon } from '@commun/icons';
import { Loader, CloseButton, up } from '@commun/ui';

import { profileType } from 'types/common';
// TODO: will be implemented after MVP
// import { SOCIAL_NETWORKS_LIST } from 'shared/constants';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 502px;
  padding: 20px 12px;
  height: 100vh;
  background-color: #fff;

  ${up.mobileLandscape} {
    /* height: auto; */
    padding: 16px 20px 20px;
    border-radius: 25px;
  }

  ${up.tablet} {
    height: auto;
  }
`;

const DescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-bottom: 20px;
`;

const DescriptionHeader = styled.h2`
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
  font-size: 21px;
  line-height: 29px;
`;

const DescriptionInput = styled.textarea`
  flex-grow: 1;
  width: 100%;
  min-height: 150px;
  padding: 15px 15px;
  border-radius: 10px;
  line-height: 20px;
  font-size: 15px;
  background: ${({ theme }) => theme.colors.contextWhite};
  resize: none;
`;

const Actions = styled.div`
  display: flex;

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
  border-radius: 8px;
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

const CloseButtonStyled = styled(CloseButton)`
  display: none;

  ${up.mobileLandscape} {
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
  }
`;

const BackButton = styled(CloseButton).attrs({ isBack: true })`
  position: absolute;
  top: 15px;
  left: 15px;

  ${up.mobileLandscape} {
    display: none;
  }
`;

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
//   color: ${({ theme }) => theme.colors.contextGrey};
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
//   background: ${({ theme }) => theme.colors.contextWhite};

//   &::placeholder {
//     color: ${({ theme }) => theme.colors.contextGrey};
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

    return (
      <Wrapper>
        <DescriptionBlock>
          <DescriptionHeader>Bio</DescriptionHeader>
          <CloseButtonStyled onClick={this.onCloseClick} />
          <BackButton onClick={this.onCloseClick} />
          <DescriptionInput
            placeholder="Description"
            name="profile__description-input"
            value={biography}
            onChange={this.onDescriptionChange}
          />
        </DescriptionBlock>
        {/* TODO: will be implemented after MVP */}
        {/* {this.renderContacts()} */}
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
            {isUpdating ? <Loader /> : 'Save'}
          </SaveButton>
        </Actions>
      </Wrapper>
    );
  }
}
