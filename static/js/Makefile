
JSX_DIR=lib
MAIN=$(JSX_DIR)/index.js

BROWSERIFY_ARGS=-t reactify -o bundle.js --full-path=false $(MAIN)

default: bundle.js

.PHONY : deps watch

# $(JSX_DIR) as a dependency so that bundle.js gets rebuilt whenever any of files int it is updated
bundle.js : deps $(JSX_DIR) $(MAIN)
	node_modules/browserify/bin/cmd.js $(BROWSERIFY_ARGS)

bundle.min.js : bundle.js
	node_modules/minify/bin/minify.js bundle.js > bundle.min.js

watch : deps $(MAIN)
	node_modules/watchify/bin/cmd.js $(BROWSERIFY_ARGS)

deps : package.json
	npm install .
