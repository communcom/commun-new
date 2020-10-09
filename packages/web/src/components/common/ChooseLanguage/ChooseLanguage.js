import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import CountryFlag from 'cyber-country-flag';
import styled from 'styled-components';

import { KEY_CODES } from '@commun/ui';

import { LANGUAGES } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { KeyBusContext } from 'utils/keyBus';

import {
  CloseButton,
  Control,
  DropDownIcon,
  DropDownItem,
  DropDownItemButton,
  DropDownList,
  DropDownWrapper,
  EmptyBlock,
  ListContainer,
  Name,
  OpenButton,
  SearchBlock,
  SearchIcon,
  SearchInput,
  Stub,
} from 'components/common/ChooserStyles';

const Wrapper = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
  height: 50px;
  max-height: 50px;
  padding: 0 15px;
`;

const CountryFlagWrapped = styled(CountryFlag)`
  width: 30px;
  height: 30px;
`;

@withTranslation()
export default class ChooseLanguage extends PureComponent {
  static propTypes = {
    language: PropTypes.object,
    mobileTopOffset: PropTypes.number,
    readOnly: PropTypes.bool,
    isClosed: PropTypes.bool,

    onSelect: PropTypes.func,
  };

  static defaultProps = {
    language: null,
    mobileTopOffset: 0,
    readOnly: false,
    isClosed: false,
    onSelect: undefined,
  };

  static contextType = KeyBusContext;

  state = {
    searchText: '',
    // eslint-disable-next-line react/destructuring-assignment
    isOpen: !this.props.language && !this.props.isClosed,
  };

  wrapperRef = createRef();

  componentDidUpdate(prevProps, prevState) {
    const keyBus = this.context;
    const { language } = this.props;
    const { isOpen } = this.state;

    if (!prevProps.language && language) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isOpen: false,
      });
    }

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
    const { selectedId } = this.state;

    const index = selectedId ? LANGUAGES.findIndex(item => item.language === selectedId) : -1;

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

        if (index >= LANGUAGES.length - 1) {
          break;
        }

        newIndex = index + 1;
        break;

      default:
      // Do nothing
    }

    if (newIndex !== index) {
      const language = LANGUAGES[newIndex];

      this.setState({
        selectedId: language.name,
      });
    }
  };

  onEnterPressed = () => {
    const { onSelect } = this.props;
    const { selectedId } = this.state;

    if (!selectedId) {
      return;
    }

    const language = LANGUAGES.find(item => item.name === selectedId);

    if (language) {
      this.close();

      if (onSelect) {
        onSelect(language);
      }
    }
  };

  close = () => {
    this.setState({
      isOpen: false,
    });
  };

  onSearchTextChange = e => {
    this.setState({
      searchText: e.target.value,
    });
  };

  onControlClick = () => {
    this.setState({
      isOpen: true,
    });
  };

  onLanguageClick = newLanguage => {
    const { language, onSelect } = this.props;

    this.close();

    if (onSelect && language?.name !== newLanguage.name) {
      onSelect(newLanguage);
    }
  };

  render() {
    const { className, language, readOnly, mobileTopOffset, t } = this.props;
    const { searchText, selectedId, isOpen } = this.state;

    let finalLanguages = LANGUAGES;
    let isSearching = false;

    if (searchText.trim()) {
      const term = searchText.trim().toLowerCase();
      isSearching = true;
      finalLanguages = LANGUAGES.filter(({ name }) => name.toLowerCase().startsWith(term));
    }

    let flag = null;
    let languageName = null;

    if (!language) {
      flag = <Stub />;
      languageName = t('components.createCommunity.description.choose_language');
    } else {
      flag = <CountryFlagWrapped code={language.flagCode} />;
      languageName = language.name;
    }

    return (
      <Wrapper ref={this.wrapperRef} className={className}>
        <Control disabled={readOnly} onClick={!readOnly ? this.onControlClick : undefined}>
          {flag}
          <Name>{languageName}</Name>
          {!readOnly ? (
            <OpenButton title={t('common.open')}>
              <DropDownIcon />
            </OpenButton>
          ) : null}
        </Control>
        {isOpen ? (
          <DropDownWrapper mobileTopOffset={mobileTopOffset}>
            <SearchBlock>
              <SearchIcon />
              <SearchInput
                placeholder={t('components.createCommunity.description.choose_language')}
                value={searchText}
                autoFocus
                onChange={this.onSearchTextChange}
              />
              <CloseButton title={t('common.close')} onClick={this.close}>
                <DropDownIcon isDown />
              </CloseButton>
            </SearchBlock>
            <ListContainer>
              <DropDownList>
                {finalLanguages.map(itemLanguage => (
                  <DropDownItem key={itemLanguage.name}>
                    <DropDownItemButton
                      isActive={
                        (language && language.name === itemLanguage.name) ||
                        (selectedId && selectedId === itemLanguage.name)
                      }
                      onClick={() => this.onLanguageClick(itemLanguage)}
                    >
                      <CountryFlagWrapped code={itemLanguage.flagCode} />
                      <Name>{itemLanguage.name}</Name>
                    </DropDownItemButton>
                  </DropDownItem>
                ))}
              </DropDownList>
              {finalLanguages.length === 0 && isSearching ? (
                <EmptyBlock>{t('components.choose_community.no_found')}</EmptyBlock>
              ) : null}
              {finalLanguages.length === 0 && !isSearching ? (
                <EmptyBlock>{t('components.choose_community.empty')}</EmptyBlock>
              ) : null}
            </ListContainer>
          </DropDownWrapper>
        ) : null}
      </Wrapper>
    );
  }
}
