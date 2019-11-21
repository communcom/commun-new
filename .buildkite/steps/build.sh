#/bin/bash
set -euo pipefail

IMAGETAG=${BUILDKITE_BRANCH:-master}

wget https://download.cyberway.io/commun/.npmrc.vault -O .npmrc
wget https://download.cyberway.io/commun/.yarnrc.vault -O .yarnrc

ansible-vault decrypt --vault-id=npmrc@~/commun-key .npmrc
ansible-vault decrypt --vault-id=npmrc@~/commun-key .yarnrc

docker build -t commun/commun:${IMAGETAG} .

rm .npmrc .yarnrc

docker login -u=$DHUBU -p=$DHUBP
docker push commun/commun:${IMAGETAG}

if [[ "${IMAGETAG}" == "master" ]]; then
    docker tag commun/commun:${IMAGETAG} commun/commun:stable
    docker push commun/commun:stable
fi

if [[ "${IMAGETAG}" == "develop" ]]; then
    docker tag commun/commun:${IMAGETAG} commun/commun:latest
    docker push commun/commun:latest
fi