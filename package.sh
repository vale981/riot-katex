#!/bin/sh
BUILD_DIR="build"
KATEX_PUB_DIR="katex-riot-pub"

mkdir -p ${BUILD_DIR}/${KATEX_PUB_DIR}
cp manifest.json \
   riot-katex.js \
   node_modules/katex/dist/katex.min.js \
   node_modules/katex/dist/contrib/auto-render.min.js \
   node_modules/katex/dist/katex.min.css \
   ${BUILD_DIR}/${KATEX_PUB_DIR}

# fonts
mkdir -p ${BUILD_DIR}/${KATEX_PUB_DIR}/fonts
cp -r node_modules/katex/dist/fonts/*.woff2 ${BUILD_DIR}/${KATEX_PUB_DIR}/fonts/

# iconts
mkdir -p ${BUILD_DIR}/${KATEX_PUB_DIR}/icons
cp icons/icon.png ${BUILD_DIR}/${KATEX_PUB_DIR}/icons


cd ${BUILD_DIR}/${KATEX_PUB_DIR}/
zip -r -FS ../katex-riot.zip *
