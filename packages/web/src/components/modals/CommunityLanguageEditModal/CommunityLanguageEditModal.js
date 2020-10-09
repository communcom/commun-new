/* eslint-disable react/destructuring-assignment */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '@commun/ui';

import { withTranslation } from 'shared/i18n';
import { applyRef } from 'utils/hocs';
import { displaySuccess } from 'utils/toastsMessages';

import AsyncAction from 'components/common/AsyncAction';
import ChooseLanguage from 'components/common/ChooseLanguage';

const Wrapper = styled.div`
  flex-basis: 500px;
  padding: 20px;
  border-radius: 15px;
  background: ${({ theme }) => theme.colors.white};
`;

const RuleHeader = styled.h2`
  margin-bottom: 18px;
  font-size: 18px;
`;

const Field = styled.div`
  margin: 10px 0;
`;

const RuleFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

@withTranslation()
@applyRef('modalRef')
export default class CommunityLanguageEditModal extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string,
    language: PropTypes.string.isRequired,

    openConfirmDialog: PropTypes.func.isRequired,
    setCommunityInfo: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    communityId: '',
  };

  state = {
    selectedLanguage: this.props.language,
    isUpdating: false,
  };

  onCancelClick = async () => {
    if (await this.canClose()) {
      const { close } = this.props;
      close();
    }
  };

  canClose() {
    const { language, openConfirmDialog, t } = this.props;
    const { selectedLanguage } = this.state;

    if (selectedLanguage === language) {
      return true;
    }

    return openConfirmDialog(t('common.lost_data_question'));
  }

  onLanguageChange = locale => {
    this.setState({
      selectedLanguage: locale,
    });
  };

  onCreateProposalClick = async () => {
    const { communityId, setCommunityInfo, close, t } = this.props;
    const { selectedLanguage } = this.state;

    this.setState({
      isUpdating: true,
    });

    try {
      await setCommunityInfo({
        communityId,
        updates: {
          language: selectedLanguage.code.toLowerCase(),
        },
      });

      displaySuccess(t('modals.community_language_edit.toastsMessages.created'));
      close();
    } catch {
      this.setState({
        isUpdating: false,
      });
    }
  };

  render() {
    const { language, t } = this.props;
    const { selectedLanguage, isUpdating } = this.state;

    const isDisabled = selectedLanguage === language;

    return (
      <Wrapper>
        <RuleHeader>{t('modals.community_language_edit.title')}</RuleHeader>
        <Field>
          <ChooseLanguage language={selectedLanguage} onSelect={this.onLanguageChange} />
        </Field>
        <RuleFooter>
          <Button onClick={this.onCancelClick}>{t('common.cancel')}</Button>
          <AsyncAction onClickHandler={isDisabled ? null : this.onCreateProposalClick}>
            <Button primary disabled={isDisabled || isUpdating}>
              {t('common.save')}
            </Button>
          </AsyncAction>
        </RuleFooter>
      </Wrapper>
    );
  }
}
