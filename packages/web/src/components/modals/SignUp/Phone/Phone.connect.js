import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector, statusSelector } from 'store/selectors/common';
import { regDataSelector } from 'store/selectors/registration';
import { fetchRegFirstStep, firstStepStopLoader } from 'store/actions/gate/registration';
import { lookupGeoIp } from 'store/actions/gate';
import { setPhoneNumber, setLocationData, clearRegErrors } from 'store/actions/local/registration';

import Phone from './Phone';

export default connect(
  createSelector(
    [statusSelector('registration'), dataSelector(['auth', 'refId']), regDataSelector],
    (
      { isLoadingFirstStep, sendPhoneError, nextSmsRetry },
      referralId,
      { phoneNumber, locationData }
    ) => ({
      referralId,
      phoneNumber,
      locationData,
      nextSmsRetry,
      isLoadingFirstStep,
      sendPhoneError,
    })
  ),
  {
    setPhoneNumber,
    setLocationData,
    fetchRegFirstStep,
    firstStepStopLoader,
    clearRegErrors,
    lookupGeoIp,
  }
)(Phone);
