import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, up } from '@commun/ui';
import { withTranslation } from 'shared/i18n';

import ChooseLanguage from './ChooseLanguage';

const Wrapper = styled.section``;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: #fff;
  border-radius: 6px;
`;

const DescriptionHeader = styled.h2`
  padding-bottom: 15px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #000;
`;

const DescriptionInput = styled.textarea`
  flex-grow: 1;
  width: 100%;
  min-height: 112px;
  padding: 18px 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  line-height: 24px;
  font-size: 16px;
  border: 1px solid #e2e6e8;
  resize: none;

  ${up.mobileLandscape} {
    font-size: 15px;
  }
`;

const ButtonStyled = styled(Button)`
  align-self: flex-end;
`;

@withTranslation()
export default class CreateDescription extends PureComponent {
  static propTypes = {
    description: PropTypes.string,
    language: PropTypes.object,

    setLanguage: PropTypes.func.isRequired,
    setDescription: PropTypes.func.isRequired,
  };

  static defaultProps = {
    language: null,
    description: '',
  };

  state = {
    ...this.getStateFromProps(),
  };

  componentDidUpdate(prevProps) {
    const { description: stateDescription } = this.state;
    const { description } = this.props;

    if (!stateDescription && description !== prevProps.description) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        description,
      });
    }
  }

  getStateFromProps() {
    const { description } = this.props;

    if (!description) {
      return {
        description: '',
      };
    }

    return {
      description,
    };
  }

  onTextChange = e => {
    const { value } = e.target;

    this.setState(prevState => ({
      description: prevState.description ? value : value.trim(),
    }));
  };

  onSelectLanguage = language => {
    const { setLanguage } = this.props;

    setLanguage(language);
  };

  onSaveDescription = () => {
    const { setDescription } = this.props;
    const { description } = this.state;

    setDescription(description);
  };

  render() {
    const { language, t } = this.props;
    const { description } = this.state;

    return (
      <Wrapper>
        <ChooseLanguage language={language} onSelect={this.onSelectLanguage} />
        <DescriptionWrapper>
          <DescriptionHeader>
            {t('components.createCommunity.description.add_description')}
          </DescriptionHeader>
          <DescriptionInput
            placeholder={t('components.createCommunity.description.description_placeholder')}
            name="create-community__description-input"
            value={description}
            onChange={this.onTextChange}
          />
          <ButtonStyled primary onClick={this.onSaveDescription}>
            {t('common.save')}
          </ButtonStyled>
        </DescriptionWrapper>
      </Wrapper>
    );
  }
}
