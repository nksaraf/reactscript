/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const PRETTIER_LIB_SOURCE = path.join(__dirname, '../node_modules/prettier');
const PRETTIER_LIB_DESTINATION = path.join(__dirname, '../src/lib');

(function () {
	try {
		fs.statSync(PRETTIER_LIB_DESTINATION);
	} catch (err) {
		fs.mkdirSync(PRETTIER_LIB_DESTINATION);
	}

	['standalone.js', 'parser-babylon.js'].forEach(function (name) {
		fs.copyFileSync(path.join(PRETTIER_LIB_SOURCE, name), path.join(PRETTIER_LIB_DESTINATION, name));
	});
})();