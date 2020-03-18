import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { displaySuccess } from 'utils/toastsMessages';

import AsyncAction from 'components/common/AsyncAction';

import {
  Wrapper,
  DescriptionBlock,
  DescriptionHeader,
  ModalName,
  DescriptionInput,
  Actions,
  SaveButton,
  ResetButton,
  CloseButtonStyled,
  BackButton,
} from '../common/common.styled';

export default class DescriptionEdit extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,

    openConfirmDialog: PropTypes.func.isRequired,
    setCommunityInfo: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    isUpdating: false,
    ...this.getStateFromProps(),
  };

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

  onResetClick = () => {
    this.setState(this.getStateFromProps());
  };

  onCloseClick = async () => {
    if (await this.canClose()) {
      const { close } = this.props;
      close();
    }
  };

  onCreateProposalClick = async () => {
    const { communityId, close, setCommunityInfo } = this.props;
    const { description } = this.state;

    this.setState({
      isUpdating: true,
    });

    try {
      await setCommunityInfo({
        communityId,
        updates: {
          description: description.trim(),
        },
      });

      displaySuccess('Proposal created');
      close();
    } catch {
      this.setState({
        isUpdating: false,
      });
    }
  };

  canClose() {
    const { description: propsDescription, openConfirmDialog } = this.props;
    const { description } = this.state;

    if (!propsDescription.trim() && !description.trim()) {
      return true;
    }

    if (propsDescription === description) {
      return true;
    }

    return openConfirmDialog('Changes will be lost, continue?');
  }

  render() {
    const { description, isUpdating } = this.state;
    const { description: propsDescription } = this.getStateFromProps();
    const isChanged = description.trim() !== propsDescription;

    return (
      <Wrapper>
        <DescriptionBlock>
          <DescriptionHeader>
            <BackButton onClick={this.onCloseClick} />
            <ModalName>Edit Description</ModalName>
            <CloseButtonStyled onClick={this.onCloseClick} />
          </DescriptionHeader>
          <DescriptionInput
            placeholder="Description"
            disabled={isUpdating}
            name="community__description-input"
            value={description}
            onChange={this.onTextChange}
          />
        </DescriptionBlock>
        <Actions>
          <ResetButton
            name="community__description-reset"
            disabled={!isChanged || isUpdating}
            isChanged={isChanged}
            onClick={this.onResetClick}
          >
            Reset
          </ResetButton>
          <AsyncAction onClickHandler={!isChanged ? null : this.onCreateProposalClick}>
            <SaveButton
              insideAsyncAction
              name="community__description-submit"
              disabled={!isChanged || isUpdating}
              isChanged={isChanged}
            >
              Create proposal
            </SaveButton>
          </AsyncAction>
        </Actions>
      </Wrapper>
    );
  }
}
