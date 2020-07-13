import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, Card, up } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { getDefaultRules } from 'utils/community';

import ChooseLanguage from './ChooseLanguage';

const Wrapper = styled.section``;

const SubjectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
`;

const SubjectHeader = styled.h2`
  padding-bottom: 15px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.black};
`;

const InputStyled = styled(Input)`
  flex-grow: 1;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
`;

const DescriptionHeader = styled.h2`
  padding-bottom: 15px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.black};
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
  color: ${({ theme }) => theme.colors.black};
  background: transparent;
  border: 1px solid #e2e6e8;
  resize: none;

  ${up.mobileLandscape} {
    font-size: 15px;
  }
`;

const ChooseLanguageCard = styled(Card)`
  margin-bottom: 10px;
`;

const ButtonStyled = styled(Button)`
  align-self: flex-end;
`;

@withTranslation()
export default class CreateDescription extends PureComponent {
  static propTypes = {
    description: PropTypes.string,
    language: PropTypes.object,
    isRulesChanged: PropTypes.bool,

    setLanguage: PropTypes.func.isRequired,
    setDescription: PropTypes.func.isRequired,
    setDefaultRules: PropTypes.func.isRequired,
    setSubject: PropTypes.func.isRequired,
  };

  static defaultProps = {
    language: null,
    description: '',
    isRulesChanged: false,
  };

  state = {
    ...this.getStateFromProps(),
    subject: '',
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

  onSubjectChange = e => {
    const { setSubject } = this.props;
    const { value } = e.target;

    const subject = value.trim();
    this.setState({ subject }, () => setSubject(subject));
  };

  onSelectLanguage = language => {
    const { isRulesChanged, setLanguage, setDefaultRules } = this.props;

    setLanguage(language);

    if (!isRulesChanged) {
      setDefaultRules(getDefaultRules(language));
    }
  };

  onSaveDescription = () => {
    const { setDescription } = this.props;
    const { description } = this.state;

    setDescription(description);
  };

  render() {
    const { language, t } = this.props;
    const { description, subject } = this.state;

    return (
      <Wrapper>
        <ChooseLanguageCard>
          <ChooseLanguage language={language} onSelect={this.onSelectLanguage} />
        </ChooseLanguageCard>
        <SubjectWrapper>
          <SubjectHeader>{t('components.createCommunity.subject')}</SubjectHeader>
          <InputStyled
            fluid
            title={t('components.createCommunity.subject.subject_placeholder')}
            value={subject}
            onChange={this.onSubjectChange}
          />
        </SubjectWrapper>
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
