export BUCKET_URI=dsp.maltablock.org
export KEY_FILE=${PWD}/maltablock-access.json
export GCLOUD_PROJECT=gold-surface-237111

echo ${BUCKET_URI}

# Authorize and set project
${HOME}/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file ${KEY_FILE}
${HOME}/google-cloud-sdk/bin/gcloud config set project ${GCLOUD_PROJECT}

# Copy Files
${HOME}/google-cloud-sdk/bin/gsutil rsync -d -r ${PWD}/build gs://${BUCKET_URI}/

# Make Files Publically Accessible
${HOME}/google-cloud-sdk/bin/gsutil acl ch -r -u AllUsers:R gs://${BUCKET_URI}/*

# Edit the website configuration
${HOME}/google-cloud-sdk/bin/gsutil web set -m index.html -e index.html gs://${BUCKET_URI}
