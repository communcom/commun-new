import { connect } from 'react-redux';

import { LANGUAGES } from 'shared/constants';
import { entitySelector } from 'store/selectors/common';

import About from './About';

export default connect((state, props) => {
  const community = entitySelector('communities', props.communityId)(state);
  const language = LANGUAGES.find(item => item.code === community.language.toUpperCase());

  return {
    communityAlias: community.alias,
    description: community.description || '',
    language,
    subject: community.subject || '',
  };
})(About);
