import { connect } from 'react-redux';
import { compose } from 'redux';
import { branchOnFeatureToggle } from '@flopflip/react-redux';

import { FEATURE_ADVERTISEMENT } from 'shared/feature-flags';

import Advertisement from './Advertisement';

export const HOME_PAGE_ADV_ID = 'HOME_PAGE_ADV_ID';
export const COMMUNITY_PAGE_ADV_ID = 'COMMUNITY_PAGE_ADV_ID';

function setAdvertisementData(advId) {
  let imgUrl = '';
  let imgAltText = '';
  let advTitle = '';
  let linkToSource = '';
  switch (advId) {
    case HOME_PAGE_ADV_ID:
      imgUrl = 'https://i.imgur.com/cDOhVl0.png';
      imgAltText = 'Какой-то сайт: 4vision.ru';
      advTitle = 'Overwatch is a team-based multiplayer first-person shooter video game';
      linkToSource = 'http://4vision.ru';
      break;
    case COMMUNITY_PAGE_ADV_ID:
      imgUrl = 'https://i.imgur.com/0vXPBCF.png';
      imgAltText = 'Лучший букмекер: 1xbet.com';
      advTitle = 'Something is a team-based multiplayer first-person video game';
      linkToSource = 'https://1xbet.com';
      break;
    default:
  }

  return {
    imgUrl,
    imgAltText,
    advTitle,
    linkToSource,
  };
}

export default compose(
  branchOnFeatureToggle({ flag: FEATURE_ADVERTISEMENT }),
  connect((_, props) => setAdvertisementData(props.advId))
)(Advertisement);
