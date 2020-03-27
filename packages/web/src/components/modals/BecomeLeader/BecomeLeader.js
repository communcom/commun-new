import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, SimpleInput, Button } from '@commun/ui';
import { withTranslation } from 'shared/i18n';
import { displaySuccess } from 'utils/toastsMessages';
import AsyncAction from 'components/common/AsyncAction';

const Wrapper = styled(Card)`
  flex-basis: 450px;
  padding: 15px;
  margin-bottom: 8px;
`;

const CardHeader = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
`;

const FieldTitle = styled.span`
  margin-bottom: 6px;
  font-size: 15px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0 5px;

  & > :not(:last-child) {
    margin-right: 14px;
  }
`;

@withTranslation()
export default class BecomeLeader extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    becomeLeader: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    isProcessing: false,
    urlText: '',
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  onBecomeClick = async () => {
    const { communityId, becomeLeader, close } = this.props;
    const { urlText } = this.state;

    this.setState({
      isProcessing: true,
    });

    try {
      const { transaction_id: transactionId } = await becomeLeader({
        communityId,
        url: urlText.trim(),
      });

      displaySuccess('Successfully');

      close({
        transactionId,
      });
    } finally {
      if (!this.unmount) {
        this.setState({
          isProcessing: false,
        });
      }
    }
  };

  onUrlChange = e => {
    this.setState({
      urlText: e.target.value,
    });
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { isProcessing, urlText, t } = this.state;

    return (
      <Wrapper>
        <CardHeader>{t('modals.become_leader.title')}</CardHeader>
        <Label>
          <FieldTitle>{t('modals.become_leader.url')}:</FieldTitle>
          <SimpleInput value={urlText} disabled={isProcessing} onChange={this.onUrlChange} />
        </Label>
        <Actions>
          <AsyncAction onClickHandler={this.onBecomeClick}>
            <Button primary>{t('modals.become_leader.become')}</Button>
          </AsyncAction>
          {isProcessing ? null : <Button onClick={this.onCloseClick}>{t('common.cancel')}</Button>}
        </Actions>
      </Wrapper>
    );
  }
}
