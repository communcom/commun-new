import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, SimpleInput, Button } from '@commun/ui';
import AsyncAction from 'components/common/AsyncAction';
import { displaySuccess } from 'utils/toastsMessages';

const Wrapper = styled(Card)`
  flex-basis: 450px;
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
      this.setState({
        isProcessing: false,
      });
    }
  };

  onUrlChange = e => {
    this.setState({
      urlText: e.target.value,
    });
  };

  render() {
    const { close } = this.props;
    const { isProcessing, urlText } = this.state;

    return (
      <Wrapper>
        <CardHeader>Become a leader</CardHeader>
        <Label>
          <FieldTitle>Welcome post URL:</FieldTitle>
          <SimpleInput value={urlText} disabled={isProcessing} onChange={this.onUrlChange} />
        </Label>
        <Actions>
          <AsyncAction onClickHandler={this.onBecomeClick}>
            <Button>Become a leader</Button>
          </AsyncAction>
          {isProcessing ? null : (
            <Button gray onClick={close}>
              Cancel
            </Button>
          )}
        </Actions>
      </Wrapper>
    );
  }
}
