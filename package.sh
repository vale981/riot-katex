#!/bin/sh
npm install

mkdir katex-riot-pub
cp manifest.json riot-katex.js node_modules/katex/dist/katex.min.js node_modules/katex/dist/contrib/auto-render.min.js node_modules/katex/dist/katex.min.css katex-riot-pub
mkdir katex-riot-pub/fonts
cp -r node_modules/katex/dist/fonts/*.woff2 katex-riot-pub/fonts/

zip -r -FS katex-riot.zip katex-riot-pub/*
