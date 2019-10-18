export BUCKET_URI=dsp.maltablock.org
export KEY_FILE=${PWD}/maltablock-access.json
export GCLOUD_PROJECT=gold-surface-237111

echo ${BUCKET_URI}

# Authorize and set project
gcloud auth activate-service-account --key-file ${KEY_FILE}
gcloud config set project ${GCLOUD_PROJECT}

# Copy Files
gsutil -m rsync -d -r ${PWD}/build gs://${BUCKET_URI}/

# Make Files Publically Accessible
gsutil -m acl ch -r -u AllUsers:R gs://${BUCKET_URI}/*

# Edit the bucket configuration to serve main and error websites
# instead of the standard bucket listing
gsutil web set -m index.html -e index.html gs://${BUCKET_URI}
