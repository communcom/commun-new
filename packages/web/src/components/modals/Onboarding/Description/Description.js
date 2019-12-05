import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Button } from '@commun/ui';
import { displaySuccess, displayError } from 'utils/toastsMessages';
import { profileType } from 'types';

import AsyncAction from 'components/common/AsyncAction';
import { DescriptionInput, Actions } from 'components/modals/common';
import { Wrapper, Header, StepInfo, StepName, StepDesc, BackButton } from '../common.styled';

const ActionsStyled = styled(Actions)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 50px;

  & > * {
    flex-grow: 0;
    flex-basis: 50px;
  }

  & > :not(:last-child) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const ButtonStyled = styled(Button)`
  width: 288px;
  height: 50px;
  border-radius: 100px;

  ${is('isPlainText')`
    background-color: #fff;
  `};
`;

export default class Description extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,

    goToStep: PropTypes.func.isRequired,
    updateProfileMeta: PropTypes.func.isRequired,
  };

  state = {
    isUpdating: false,
    ...this.getStateFromProps(),
  };

  getStateFromProps() {
    const { profile } = this.props;
    const { biography: description } = profile.personal;

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
    this.setState({
      description: e.target.value,
    });
  };

  onSkipClick = () => {
    const { goToStep } = this.props;

    goToStep(3);
  };

  onBackClick = () => {
    const { goToStep } = this.props;

    goToStep(0);
  };

  onNextClick = async () => {
    const { description } = this.state;
    const { updateProfileMeta, goToStep } = this.props;
    const { description: propsDescription } = this.getStateFromProps();
    const isChanged = description !== propsDescription;

    try {
      if (isChanged) {
        await updateProfileMeta({
          biography: description,
        });
        displaySuccess('Description successfully updated!');
      }

      goToStep(3);
    } catch (err) {
      displayError(err);
    }
  };

  render() {
    const { description, isUpdating } = this.state;

    return (
      <Wrapper>
        <Header>
          <BackButton onClick={this.onBackClick} />
        </Header>
        <StepInfo>
          <StepName>Description</StepName>
          <StepDesc>Type something about you</StepDesc>
        </StepInfo>
        <DescriptionInput
          placeholder="Description"
          disabled={isUpdating}
          name="onboarding__description-input"
          value={description}
          onChange={this.onTextChange}
        />
        <ActionsStyled>
          <AsyncAction onClickHandler={this.onNextClick}>
            <ButtonStyled primary name="onboarding__description-submit">
              Next
            </ButtonStyled>
          </AsyncAction>
          <ButtonStyled isPlainText name="onboarding__description-skip" onClick={this.onSkipClick}>
            Skip
          </ButtonStyled>
        </ActionsStyled>
      </Wrapper>
    );
  }
}
