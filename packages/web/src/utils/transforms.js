// eslint-disable-next-line import/prefer-default-export
export const transformContacts = (contacts = {}) => ({
  facebook: contacts?.facebook,
  vk: contacts?.vkontakte,
  instagram: contacts?.instagram,
});
