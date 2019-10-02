/* eslint-disable no-console */

export function saveDraft({ body, attachments }, key) {
  try {
    if (body.toJSON) {
      // eslint-disable-next-line no-param-reassign
      body = body.toJSON();
    }

    const json = JSON.stringify({
      body,
      attachments,
    });

    localStorage.setItem(key, json);
  } catch (err) {
    console.warn(`Failed when trying save ${key}!`, err);
  }
}

export function removeDraft(key) {
  localStorage.removeItem(key);
}

export function loadDraft(key) {
  const draft = localStorage.getItem(key);

  let result = null;

  try {
    result = draft ? JSON.parse(draft) : null;
  } catch (err) {
    console.warn(`Failed when trying load ${key}!`, err);
  }

  return result;
}
