import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import { OnboardingStep } from 'shared/constants';
import { profileType } from 'types';

const PickAvatar = dynamic(() => import('./PickAvatar'));
const EditAvatar = dynamic(() => import('./EditAvatar'));
const Description = dynamic(() => import('./Description'));
const Communities = dynamic(() => import('./Communities'));

const STEPS = [
  {
    id: OnboardingStep.PICK_AVATAR,
    component: PickAvatar,
  },
  {
    id: OnboardingStep.CHANGE_AVATAR_POSITION,
    component: EditAvatar,
  },
  {
    id: OnboardingStep.DESCRIPTION,
    component: Description,
  },
  {
    id: OnboardingStep.BUILD_FEED,
    component: Communities,
  },
];

export default class Onboarding extends Component {
  static propTypes = {
    currentUserId: PropTypes.string.isRequired,
    profile: profileType.isRequired,

    close: PropTypes.func.isRequired,
    updateProfileMeta: PropTypes.func.isRequired,
  };

  state = {
    currentStep: 0,
    // eslint-disable-next-line
    image: this.props.profile?.personal?.avatarUrl,
  };

  componentDidMount() {
    const { profile, close } = this.props;

    if (!profile) {
      close();
    }
  }

  componentDidUpdate() {
    const { profile, close } = this.props;

    if (!profile) {
      close();
    }
  }

  onSelectImage = (image, cb) => {
    this.setState(
      {
        image,
      },
      cb
    );
  };

  goToStep = stepNumber => {
    this.setState({
      currentStep: stepNumber,
    });
  };

  render() {
    const { currentStep, image } = this.state;
    const { profile, currentUserId, close, updateProfileMeta } = this.props;
    const StepComponent = STEPS[currentStep].component;

    if (!profile) {
      return null;
    }

    return (
      <StepComponent
        profile={profile}
        currentUserId={currentUserId}
        image={image}
        close={close}
        goToStep={stepNumber => this.goToStep(stepNumber)}
        onSelectImage={(selectedImage, cb) => this.onSelectImage(selectedImage, cb)}
        updateProfileMeta={updateProfileMeta}
      />
    );
  }
}
