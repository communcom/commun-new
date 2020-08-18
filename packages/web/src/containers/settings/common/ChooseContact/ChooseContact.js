import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { animations, KEY_CODES, up } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { KeyBusContext } from 'utils/keyBus';

import {
  CloseButton,
  Control,
  DropDownIcon,
  DropDownItem,
  DropDownList,
  ListContainer,
  OpenButton,
  SearchBlock,
} from 'components/common/ChooserStyles';

const Wrapper = styled.div`
  position: relative;
  min-width: 210px;
  height: 50px;
  max-height: 50px;
  z-index: 5;
`;

const CircleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const Margin = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 0 17px 0 20px;
`;

const Name = styled.span`
  flex-grow: 1;
  margin: 0 10px;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
`;

const NameSmall = styled(Name)`
  font-size: 14px;
  font-weight: 500;
`;

const ChooseText = styled.div`
  flex-grow: 1;
  font-size: 15px;
  color: #a5a7bd;
  white-space: nowrap;
`;

const Blue = styled.div`
  color: ${({ theme }) => theme.colors.blue};
`;

const SocialIcon = styled(Icon)`
  width: 30px;
  height: 30px;
`;

const SocialIconSmall = styled(SocialIcon)`
  margin-left: 15px;
`;

const DropDownWrapper = styled.div`
  position: fixed;
  top: ${({ mobileTopOffset }) => mobileTopOffset}px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.white};
  animation: ${animations.fadeIn} 0.1s forwards;
  overflow: hidden;

  ${up.mobileLandscape} {
    position: absolute;
    top: 0;
    left: -15px;
    right: -15px;
    bottom: unset;
    border-radius: 10px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  }
`;

const DropDownItemButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  color: ${({ theme }) => theme.colors.black};
  text-align: left;

  ${is('isActive')`
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  `};

  &:hover {
    background-color: ${({ theme }) => theme.colors.chooseColor};
  }
`;

@withTranslation()
export default class ChooseContact extends PureComponent {
  static propTypes = {
    contactId: PropTypes.string,
    contact: PropTypes.shape({
      id: PropTypes.string.isRequired,
      contactId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      iconName: PropTypes.string.isRequired,
    }),
    disabled: PropTypes.bool,
    contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
    mobileTopOffset: PropTypes.number,
    placeholder: PropTypes.string.isRequired,
    PlaceholderIcon: PropTypes.node.isRequired,

    onSelect: PropTypes.func,
  };

  static defaultProps = {
    contactId: null,
    contact: null,
    disabled: false,
    mobileTopOffset: 0,
    onSelect: undefined,
  };

  static contextType = KeyBusContext;

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    isOpen: false,
  };

  wrapperRef = createRef();

  componentDidUpdate(prevProps, prevState) {
    const keyBus = this.context;
    const { isOpen } = this.state;

    if (isOpen !== prevState.isOpen) {
      if (isOpen) {
        window.addEventListener('mousedown', this.onMouseDown);
        keyBus.on(this.onKeyDown);
      } else {
        window.removeEventListener('mousedown', this.onMouseDown);
        keyBus.off(this.onKeyDown);
      }
    }
  }

  componentWillUnmount() {
    const keyBus = this.context;

    this.unmount = true;
    window.removeEventListener('mousedown', this.onMouseDown);
    keyBus.off(this.onKeyDown);
  }

  onMouseDown = e => {
    if (this.wrapperRef && this.wrapperRef.current.contains(e.target)) {
      return;
    }

    this.close();
  };

  onKeyDown = e => {
    if (e.altKey || e.ctrlKey || e.metaKey) {
      return;
    }

    switch (e.which) {
      case KEY_CODES.UP:
      case KEY_CODES.DOWN:
        e.preventDefault();
        this.processArrows(e.which);
        break;
      case KEY_CODES.ENTER:
        e.preventDefault();
        this.onEnterPressed();
        break;
      default:
      // Do nothing
    }
  };

  processArrows = keyCode => {
    const { contacts } = this.props;
    const { selectedId } = this.state;

    const index = selectedId ? contacts.findIndex(contact => contact.contactId === selectedId) : -1;

    let newIndex = index;

    switch (keyCode) {
      case KEY_CODES.UP:
        if (index === -1 || index === 0) {
          break;
        }

        newIndex = index - 1;
        break;

      case KEY_CODES.DOWN:
        if (index === -1) {
          newIndex = 0;
          break;
        }

        if (index >= contacts.length - 1) {
          break;
        }

        newIndex = index + 1;
        break;

      default:
      // Do nothing
    }

    if (newIndex !== index) {
      const contact = contacts[newIndex];

      this.setState({
        selectedId: contact.contactId,
      });
    }
  };

  onEnterPressed = () => {
    const { contacts, onSelect } = this.props;
    const { selectedId } = this.state;

    if (!selectedId) {
      return;
    }

    const contact = contacts.find(c => c.contactId === selectedId);

    if (contact) {
      this.close();

      if (onSelect) {
        onSelect(contact.contactId, contact);
      }
    }
  };

  close = () => {
    this.setState({
      isOpen: false,
    });
  };

  onControlClick = () => {
    this.setState({
      isOpen: true,
    });
  };

  onContactClick = (clickContactId, contact) => () => {
    const { contactId, onSelect } = this.props;

    this.close();

    if (onSelect && contactId !== clickContactId) {
      onSelect(clickContactId, contact);
    }
  };

  render() {
    const {
      className,
      contactId,
      placeholder,
      contacts,
      disabled,
      mobileTopOffset,
      PlaceholderIcon,
      t,
    } = this.props;
    const { selectedId, isOpen } = this.state;

    let avatar = null;
    let contactName = null;

    const contact = contacts.find(c => c.contactId === contactId);

    if (!contact) {
      avatar = (
        <CircleWrapper>
          <PlaceholderIcon />
        </CircleWrapper>
      );
      contactName = <Blue>{placeholder}</Blue>;
    } else {
      avatar = <SocialIcon name={contact.iconName} />;
      contactName = contact.name;
    }

    return (
      <Wrapper ref={this.wrapperRef} className={className}>
        <Control disabled={disabled} onClick={disabled ? null : this.onControlClick}>
          {avatar}
          <Name>{contactName}</Name>
          {disabled ? null : (
            <>
              <OpenButton title={t('common.open')}>
                <DropDownIcon />
              </OpenButton>
            </>
          )}
        </Control>
        {isOpen && !disabled ? (
          <DropDownWrapper mobileTopOffset={mobileTopOffset}>
            <SearchBlock>
              <Margin>
                <PlaceholderIcon />
              </Margin>
              <ChooseText>{placeholder}</ChooseText>
              <CloseButton title={t('common.close')} onClick={this.close}>
                <DropDownIcon isDown />
              </CloseButton>
            </SearchBlock>
            <ListContainer>
              <DropDownList>
                {contacts.map(itemContact => (
                  <DropDownItem key={itemContact.contactId}>
                    <DropDownItemButton
                      isActive={
                        (contactId && contactId === itemContact.contactId) ||
                        (selectedId && selectedId === itemContact.contactId)
                      }
                      onClick={this.onContactClick(itemContact.contactId, itemContact)}
                    >
                      <SocialIconSmall name={itemContact.iconName} />
                      <NameSmall>{itemContact.name}</NameSmall>
                    </DropDownItemButton>
                  </DropDownItem>
                ))}
              </DropDownList>
            </ListContainer>
          </DropDownWrapper>
        ) : null}
      </Wrapper>
    );
  }
}
