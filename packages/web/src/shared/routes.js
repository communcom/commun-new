const nextLinks = require('next-links').default;

const routes = nextLinks();

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

module.exports = routes;
