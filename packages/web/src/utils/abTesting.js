const memo = new Map();

function checkAbTestingInner(testingFixture, clientId) {
  if (!clientId) {
    return null;
  }

  const clientValue = ((clientId + testingFixture.seed) % 1000000) / 10000;

  let left = 0;

  for (const [value, percent] of testingFixture.cases) {
    if (percent === null || percent === undefined) {
      return value;
    }

    if (clientValue < left + percent) {
      return value;
    }

    left += percent;
  }

  return null;
}

// eslint-disable-next-line import/prefer-default-export
export function checkAb(testingFixture, clientId) {
  let result = memo.get(testingFixture);

  if (result === undefined) {
    result = checkAbTestingInner(testingFixture, clientId) || null;
    memo.set(testingFixture, result);
  }

  return result;
}
