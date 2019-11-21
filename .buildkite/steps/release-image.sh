#/bin/bash
set -euo pipefail

IMAGETAG="dev-${BUILDKITE_BRANCH}-${BUILDKITE_BUILD_NUMBER}"

if [[ "${BUILDKITE_TAG}" != "" ]]; then
    docker login -u=$DHUBU -p=$DHUBP
    docker pull commun/commun:${IMAGETAG}
    docker tag commun/commun:${IMAGETAG} commun/commun:${BUILDKITE_TAG}
    docker push commun/commun:${BUILDKITE_TAG}
fi