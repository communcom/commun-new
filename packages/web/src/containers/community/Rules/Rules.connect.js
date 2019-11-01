import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_RULE_EDIT } from 'store/constants';

import Rules from './Rules';

const MOCK_RULES = [
  {
    id: 's1',
    title: 'Content must target the Overwatch audgdasdf fdsf fdsf sfds sf dsfsfds fsdf sfsdfssd',
    text:
      'All content (title, articles, video, image, website, etc.) must be SFW: Safe For Work. Content that is NSFW: Not Safe For Work, is banned. This rule applies to all posts and comments.\n',
  },
  {
    id: 's2',
    title: 'Content should be Safe for Work',
    text:
      'All content (title, articles, video, image, website, etc.) must be SFW: Safe For Work. Content that is NSFW: Not Safe For Work, is banned. This rule applies to all posts and comments.\n' +
      'Examples of NSFW posts:\n' +
      '– Pornographic images - Does it qualify as pornography?\n' +
      '– Intense gore - no serious wounds, abuse, torture or general gore.\n' +
      '– Erotic literature - whether stories, poetry or graphic imagery.\n' +
      '– Linking to NSFW subreddits - in exceptional circumstances, only when serious discussion lends requirement to it, this is allowed.\n' +
      '– Thinly veiled inappropriate innuendo or puns - titles that refer to sexual acts (ex. "British girl puts it in behind to secure the load").',
  },
];

export default connect(
  () => ({
    rules: MOCK_RULES,
  }),
  {
    openRuleEditModal: ({ communityId, isNewRule, rule }) =>
      openModal(SHOW_MODAL_RULE_EDIT, { communityId, isNewRule, rule }),
  }
)(Rules);
