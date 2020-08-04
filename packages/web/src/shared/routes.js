const { createElement } = require('react');
const { connect } = require('react-redux');
const ramdaPath = require('ramda/src/path');
const nextLinks = require('next-links').default;

const routes = nextLinks();
const { Link } = routes;

routes.add('home', '/');
routes.add('feed', '/:feedType(hot|trending|feed)/:feedSubType?/:feedSubSubType?', 'home');
routes.add('faq', '/faq');
routes.add('agreement', '/agreement');
routes.add('communities', '/communities/:section?');
routes.add('createCommunity', '/community/create/:section?');
routes.add('policy', '/policies/:policy');
routes.add('search', '/search/:type(profiles|communities|posts)?');
routes.add('profile', '/@:username/:section?');
routes.add('profile%', '/%40:username/:section?', 'profile');
routes.add('wallet', '/wallet');
routes.add('settings', '/settings/:section?/:subSection?');
routes.add('blacklist', '/blacklist');
routes.add('walletSection', '/wallet/:section', 'wallet');
routes.add('walletSectionType', '/wallet/:section/:type', 'wallet');
routes.add('notifications', '/notifications');
routes.add('leaderboard', '/leaderboard/:section?/:subSection?');
routes.add('post', '/:communityAlias/@:username/:permlink');
routes.add('post%', '/:communityAlias/%40:username/:permlink', 'post');
routes.add('paymentComplete', '/payment/complete');
routes.add('paymentSuccess', '/payment/success');
routes.add('paymentVerify', '/payment/verify');
routes.add('community', '/:communityAlias/:section?/:subSection?/:subSubSection?');

// make referral for all links
const LinkRef = ({ currentUserId, params, dispatch, ref, ...rest }) => {
  const finalParams = params || {};

  if (currentUserId) {
    finalParams.invite = currentUserId;
  }

  return createElement(Link, {
    ...rest,
    ref,
    params: finalParams,
  });
};

routes.Link = connect(
  state => ({
    currentUserId: ramdaPath(['data', 'auth', 'currentUser', 'userId'])(state),
  }),
  null,
  null,
  { forwardRef: true }
)(LinkRef);

module.exports = routes;
