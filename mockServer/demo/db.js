//運用 glob 套件取出檔名，動態的引入 api 檔案，並運用 Regexp 把'_'開頭的檔案不視作 api 引入
const glob = require('glob');
const dir = './demo/**/!(db)*.js';
const apiFiles = glob.sync(dir);

let data = {};
let routesList = [];

apiFiles.forEach(item => {

	let [, fileName] = item.split('demo/'); // e.g. fileName.js
	const filePath = require('./' + fileName);

	fileName = fileName.slice(0, fileName.length - 3); // remove .js >> fileName
	data[fileName] = filePath;

	routesList.push(fileName);
});

module.exports = {
	routesList,
	data
}