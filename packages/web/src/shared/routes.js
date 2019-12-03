const { createElement } = require('react');
const { connect } = require('react-redux');
const ramdaPath = require('ramda').path;
const nextLinks = require('next-links').default;

const routes = nextLinks();
const { Link } = routes;

routes.add('home', '/');
routes.add('feed', '/feed/:feedType/:feedSubType?', 'home');
routes.add('agreement', '/agreement');
routes.add('communities', '/communities/:section?');
routes.add('messenger', '/messenger');
routes.add('policy', '/policies/:policy');
routes.add('trending', '/trending');
routes.add('profile', '/@:username/:section?');
routes.add('wallet', '/wallet');
routes.add('settings', '/settings');
routes.add('walletSection', '/wallet/:section', 'wallet');
routes.add('walletSectionType', '/wallet/:section/:type', 'wallet');
routes.add('notifications', '/notifications');
routes.add('leaderboard', '/leaderboard/:section?');
routes.add('post', '/:communityAlias/@:username/:permlink');
routes.add('community', '/:communityAlias/:section?/:subSection?');

// make referral for all links
const LinkRef = ({ currentUserId, params, ...rest }) => {
  const finalParams = params || {};

  if (currentUserId) {
    finalParams.invite = currentUserId;
  }

  return createElement(Link, {
    ...rest,
    params: finalParams,
  });
};

routes.Link = connect(
  state => ({
    currentUserId: ramdaPath(['data', 'auth', 'currentUser', 'userId'])(state),
  }),
  null
)(LinkRef);

module.exports = routes;
