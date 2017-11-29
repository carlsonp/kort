module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
		"jquery": true
    },
    rules: {
		"no-mixed-spaces-and-tabs": [0],
		
		// https://eslint.org/docs/rules/#nodejs-and-commonjs
		// the following are nodejs specific:
		"global-require": [1],
		"no-path-concat": [1],
		"no-process-exit": [1],
		"handle-callback-err": [1],
		"callback-return": [1]
	}
};
