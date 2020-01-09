import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { styles, up } from '@commun/ui';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import { profileType } from 'types/common';

const Wrapper = styled.section`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
  padding: 8px 16px 20px;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 4px;
  overflow-y: auto;

  ${up.desktop} {
    max-height: 56px;
  }
`;

const CompactWrapper = styled.div`
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;

  ${up.desktop} {
    max-width: 400px;
    max-height: 30px;

    ${is('isOwner')`
      max-width: 100%;
    `};
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  line-height: normal;
`;

const Title = styled.h4`
  font-size: 12px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray};
`;

const Text = styled.div`
  max-width: 100%;
  max-height: 100%;
  font-size: 14px;
  line-height: 20px;
  text-align: left;

  ${styles.breakWord};
`;

const MoreText = styled.button`
  color: ${({ theme }) => theme.colors.blue};
`;

const AddBioButton = styled(MoreText)`
  display: none;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;

  ${up.desktop} {
    display: inline-block;
  }
`;

const DescriptionContainer = styled.div`
  display: flex;

  &:hover > button {
    visibility: visible;
    opacity: 1;
  }

  ${up.desktop} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    max-width: 460px;

    ${is('isOwner')`
      max-width: 100%;
    `};
  }
`;

const EditIcon = styled(Icon).attrs({ name: 'edit' })`
  display: none;
  width: 15px;
  height: 15px;

  ${up.desktop} {
    display: inline-block;
  }
`;

const EditText = styled.span`
  font-weight: bold;
  font-size: 15px;

  ${up.desktop} {
    display: none;
  }
`;

const EditButton = styled.button`
  display: none;

  ${up.desktop} {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    padding: 0;
    margin-top: 0;
    margin-left: 10px;
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
    border-radius: 20px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.gray};
    transition: color 0.15s, visibility 0.15s, opacity 0.15s;
    visibility: hidden;
    opacity: 0;

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.blueHover};
    }

    ${is('isEmptyBio')`
      display: none;
    `};
  }
`;
// TODO: will be implemented after MVP

// const Contacts = styled.ul`
//   display: flex;

//   ${is('isCompact')`
//     justify-content: center;
//     padding: 20px 0 16px;
//   `};
// `;

// const ContactsItem = styled.li`
//   &:not(:last-child) {
//     margin-right: 35px;
//   }
// `;

// const ContactLink = styled.a.attrs({ rel: 'noopener noreferrer', target: '_blank' })`
//   display: flex;
//   text-decoration: none;
//   color: ${({ theme }) => theme.colors.gray};
//   transition: color 0.15s;

//   &:hover,
//   &:focus {
//     color: ${({ theme }) => theme.colors.blue};
//   }
// `;

// const HiddenTitle = styled.span`
//   ${styles.visuallyHidden};
// `;

export default class Description extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,
    isOwner: PropTypes.bool,
    isCompact: PropTypes.bool,
    openEditProfileAboutModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOwner: false,
    isCompact: false,
  };

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    isCollapsed: this.props.isCompact,
  };

  onEditClick = () => {
    const { profile, openEditProfileAboutModal } = this.props;

    openEditProfileAboutModal(profile.userId);
  };

  onMoreClick = () => {
    this.setState({
      isCollapsed: false,
    });
  };

  renderText() {
    const { profile } = this.props;
    const { isCollapsed } = this.state;

    const about = profile?.personal?.biography || '';

    if (about.length > 55 && isCollapsed) {
      return (
        <Text>
          {`${about.substr(0, 55)}... `}
          <MoreText onClick={this.onMoreClick}>More</MoreText>
        </Text>
      );
    }

    return <Text>{about}</Text>;
  }

  // TODO: will be implemented after MVP
  // renderContacts() {
  //   const { profile, isCompact } = this.props;
  //   const elements = [];

  //   if (profile.personal) {
  //     for (const social of SOCIAL_NETWORKS_LIST) {
  //       const url = profile.personal?.contacts?.[social.fieldName];

  //       if (url) {
  //         elements.push({
  //           ...social,
  //           url,
  //         });
  //       }
  //     }
  //   }

  //   return (
  //     <Contacts isCompact={isCompact}>
  //       {elements.map(contact => (
  //         <ContactsItem key={contact.fieldName}>
  //           <ContactLink href={contact.url} title={contact.name}>
  //             <Icon name={contact.icon} size={24} />
  //             <HiddenTitle>{contact.url}</HiddenTitle>
  //           </ContactLink>
  //         </ContactsItem>
  //       ))}
  //     </Contacts>
  //   );
  // }
  renderEditBioButton() {
    const { isOwner } = this.props;

    if (!isOwner) {
      return null;
    }

    return (
      <EditButton onClick={this.onEditClick}>
        <EditIcon />
        <EditText>Edit bio</EditText>
      </EditButton>
    );
  }

  renderAddBioButton() {
    const { isOwner } = this.props;

    if (!isOwner) {
      return null;
    }

    return (
      <>
        <EditButton isEmptyBio onClick={this.onEditClick}>
          <EditText>Add bio</EditText>
        </EditButton>
        <AddBioButton onClick={this.onEditClick}>Add bio</AddBioButton>
      </>
    );
  }

  render() {
    const { isOwner, isCompact, profile } = this.props;
    const Wrap = isCompact ? CompactWrapper : Wrapper;

    if (!profile?.personal?.biography && !isOwner) {
      return null;
    }

    return (
      <Wrap isOwner={isOwner}>
        {isCompact ? null : (
          <Header>
            <Title>Description</Title>
            {isOwner ? <EditButton onClick={this.onEditClick}>Edit</EditButton> : null}
          </Header>
        )}
        {profile?.personal?.biography ? (
          <DescriptionContainer isOwner={isOwner}>
            {this.renderText()}
            {this.renderEditBioButton()}
          </DescriptionContainer>
        ) : (
          <>{this.renderAddBioButton()}</>
        )}
        {/*  TODO: will be implemented after MVP */}
        {/* {isCollapsed ? null : <>{this.renderContacts()}</>} */}
      </Wrap>
    );
  }
}
