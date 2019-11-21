#/bin/bash
set -euo pipefail

IMAGETAG="dev-${BUILDKITE_BRANCH}-${BUILDKITE_BUILD_NUMBER}"

wget https://download.cyberway.io/commun/.npmrc.vault -O .npmrc
wget https://download.cyberway.io/commun/.yarnrc.vault -O .yarnrc

ansible-vault decrypt --vault-id=npmrc@~/commun-key .npmrc
ansible-vault decrypt --vault-id=npmrc@~/commun-key .yarnrc
docker build -t commun/commun:${IMAGETAG} .
rm .npmrc .yarnrc

docker login -u=$DHUBU -p=$DHUBP
docker push commun/commun:${IMAGETAG}
