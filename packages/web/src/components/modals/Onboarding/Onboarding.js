import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import { profileType } from 'types';
import { OnboardingStep } from 'shared/constants';

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
    user: PropTypes.shape({}),
    profile: profileType,

    close: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    updateProfileMeta: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: null,
    profile: null,
  };

  state = {
    currentStep: 0,
    isProfileLoading: false,
    // eslint-disable-next-line
    image: this.props.profile?.avatarUrl,
  };

  async componentDidMount() {
    const { profile, user, close, fetchProfile } = this.props;

    if (!user) {
      close();
      return;
    }

    if (user && !profile) {
      this.setState({ isProfileLoading: true });
      try {
        await fetchProfile(user);
        this.setState({ isProfileLoading: false });
      } catch (err) {
        close();
      }
    }
  }

  componentDidUpdate() {
    const { user, profile, close } = this.props;
    const { isProfileLoading } = this.state;

    if (!user || (!profile && !isProfileLoading)) {
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
    const { profile, user, close, updateProfileMeta } = this.props;
    const StepComponent = STEPS[currentStep].component;

    if (!profile) {
      return null;
    }

    return (
      <StepComponent
        profile={profile}
        currentUserId={user.userId}
        image={image}
        close={close}
        goToStep={stepNumber => this.goToStep(stepNumber)}
        onSelectImage={(selectedImage, cb) => this.onSelectImage(selectedImage, cb)}
        updateProfileMeta={updateProfileMeta}
      />
    );
  }
}
