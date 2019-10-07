import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { styles } from '@commun/ui';

import { SOCIAL_NETWORKS_LIST, RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import { profileType } from 'types/common';

const Wrapper = styled.section`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
  padding: 8px 16px 20px;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  border-radius: 4px;
`;

const CompactWrapper = styled.div`
  max-width: 400px;
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
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const Text = styled.div`
  margin-bottom: 10px;
  font-size: 15px;
  line-height: 20px;
`;

const MoreText = styled.button`
  color: ${({ theme }) => theme.colors.contextBlue};
`;

const DescriptionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 425px;
`;

const EditButton = styled(Icon)`
  position: relative;
  height: 30px;
  width: 30px;
  background: #f3f5fa;
  border-radius: 20px;
  font-size: 13px;
  color: #9b9fa2;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

const Contacts = styled.ul`
  display: flex;

  ${is('isCompact')`
    justify-content: center;
    padding: 20px 0 16px;
  `};
`;

const ContactsItem = styled.li`
  &:not(:last-child) {
    margin-right: 35px;
  }
`;

const ContactLink = styled.a.attrs({ rel: 'noopener noreferrer', target: '_blank' })`
  display: flex;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.contextGrey};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlue};
  }
`;

const HiddenTitle = styled.span`
  ${styles.visuallyHidden};
`;

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
    showEditButton: false,
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

  onMouseHover = state => this.setState({ showEditButton: state });

  renderText() {
    const { profile } = this.props;
    const { isCollapsed } = this.state;

    let about;

    if (profile.personal) {
      about = profile.personal.about || '';
    } else {
      about = '';
    }

    if (isCollapsed) {
      return (
        <Text>
          {`${about.substr(0, 120)}... `}
          <MoreText onClick={this.onMoreClick}>More</MoreText>
        </Text>
      );
    }

    return <Text>{about}</Text>;
  }

  renderContacts() {
    const { profile, isCompact } = this.props;
    const elements = [];

    if (profile.personal) {
      for (const social of SOCIAL_NETWORKS_LIST) {
        const url = profile.personal?.contacts?.[social.fieldName];

        if (url) {
          elements.push({
            ...social,
            url,
          });
        }
      }
    }

    return (
      <Contacts isCompact={isCompact}>
        {elements.map(contact => (
          <ContactsItem key={contact.fieldName}>
            <ContactLink href={contact.url} title={contact.name}>
              <Icon name={contact.icon} size={24} />
              <HiddenTitle>{contact.url}</HiddenTitle>
            </ContactLink>
          </ContactsItem>
        ))}
      </Contacts>
    );
  }

  render() {
    const { userId, profile, isOwner, isCompact } = this.props;
    const { isCollapsed, showEditButton } = this.state;

    const Wrap = isCompact ? CompactWrapper : Wrapper;

    return (
      <Wrap>
        {isCompact ? null : (
          <Header>
            <Title>Description</Title>
            {isOwner ? <EditButton onClick={this.onEditClick}>Edit</EditButton> : null}
          </Header>
        )}
        <DescriptionContainer
          onMouseEnter={() => this.onMouseHover(true)}
          onMouseLeave={() => this.onMouseHover(false)}
        >
          {this.renderText()}
          {isOwner && (!isCollapsed || showEditButton) ? (
            <EditButton name="edit" size={11} onClick={this.onEditClick} />
          ) : null}
        </DescriptionContainer>
        {isCollapsed ? null : <>{this.renderContacts()}</>}
      </Wrap>
    );
  }
}
