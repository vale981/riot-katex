# Riot KaTeX

This extension injects KaTeX into the `Riot` chat client for
`matrix`. This currently works for just one domain
(matrix.tu-dresden.de). If you want to use it, you have to adjust the
`manifest.json`.

## Writing LaTeX
 - `$$x^2$$` renders math block style
 - `\(x^2\)` renders math inline

## Building the Extension
 - make sure you have npm installed
 - run `./package.sh`, the webextension will be zipped as
   `katex-riot.zip` and the file structure of the extionsion is
   written to the folder `katex-riot-pub` for debugging
