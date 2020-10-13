const { createElement } = require('react');
const PropTypes = require('prop-types');
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
routes.add('policy', '/policies/:policy');
routes.add('search', '/search/:type(profiles|communities|posts)?');
routes.add('profile', '/@:username/:section?/:subSection?');
routes.add('profile%', '/%40:username/:section?/:subSection?', 'profile');
routes.add('wallet', '/wallet');
routes.add('settings', '/settings/:section?/:subSection?');
routes.add('blacklist', '/blacklist');
routes.add('walletSection', '/wallet/:section', 'wallet');
routes.add('walletSectionType', '/wallet/:section/:type', 'wallet');
routes.add('notifications', '/notifications');
routes.add('leaderboard', '/leaderboard/:communityAlias?/:section?/:subSection?');
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

LinkRef.propTypes = {
  currentUserId: PropTypes.string,
  params: PropTypes.object,
  dispatch: PropTypes.func,
  ref: PropTypes.shape({ current: PropTypes.object }),
};

LinkRef.defaultProps = {
  currentUserId: null,
  params: null,
  dispatch: null,
  ref: null,
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
