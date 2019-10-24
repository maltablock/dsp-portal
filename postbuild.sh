# Temporary solution to serve app under `dsp.maltablock.org/liquiairdrops`.
# Remove it once it will be fixed on server side (in nginx configs).
# (all subpaths should be served with root index.html).
cd build && mkdir liquiairdrops && cp index.html liquiairdrops/
