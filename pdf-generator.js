const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const {number2text} = require('./index.js');

const data = {
	"heading": "Invoice",
	"invoiceNo": 100452,
	"type": "INCOME",
	"invoice": {
		"name": "Rakesh Awasthi",
		"address": "Bunglow 001, 16th Cross Rd, 22nd A Main, Vanganahalli, 1st Sector, HSR Layout, Bengaluru, Karnataka 560102"
	},
	"billing": {
		"name": "Rajesh Sharma",
		"address": "Bunglow 001, 16th Cross Rd, 22nd A Main, Vanganahalli, 1st Sector, HSR Layout, Bengaluru, Karnataka 560102"
	},
	"sub-header": {
		"invoiceNo": 100452,
		"terms": "Due on Reciept",
		"duedate": "04 Sept 2019"
	},
	"transaction": [
		{
			"decription": "Lorem Ipsum Dolor Sit Imet",
			"SAC": 989871,
			"qty": 1,
			"rate": 56000,
			"tax": 18
		},
		{
			"decription": "Lorem Ipsum Dolor Sit Imet",
			"SAC": 989871,
			"qty": 1,
			"rate": 56000,
			"tax": 0
		},
		{
			"decription": "Lorem Ipsum Dolor Sit Imet",
			"SAC": 989871,
			"qty": 1,
			"rate": 56000,
			"tax": 0
		},
		{
			"decription": "Lorem Ipsum Dolor Sit Imet",
			"SAC": 989871,
			"qty": 1,
			"rate": 56000,
			"tax": 18
		},
		{
			"decription": "Lorem Ipsum Dolor Sit Imet",
			"SAC": 989871,
			"qty": 1,
			"rate": 56000,
			"tax": 18
		},{
			"decription": "Lorem Ipsum Dolor Sit Imet",
			"SAC": 989871,
			"qty": 1,
			"rate": 56000,
			"tax": 18
		},
		{
			"decription": "Lorem Ipsum Dolor Sit Imet",
			"SAC": 989871,
			"qty": 1,
			"rate": 56000,
			"tax": 18
		}
	],
	"total": 0,
	"totalTax": 0,
	"amountDue": 0
};

data.transaction.forEach((item) => {
	item.taxAmount = (item.qty * item.rate) * (item.tax / 100);
	item.total = (item.taxAmount + ((item.qty * item.rate)));
	data.total = data.total + item.total;
	data.totalTax = item.taxAmount;
	data.NumInWords = number2text(data.total);
});


(async () => {
	var templateHtml = await fs.readFileSync(path.join(process.cwd(), 'template.html'), 'utf8');
	var template = await handlebars.compile(templateHtml);
	var html = await template(data);
	var pdfPath = path.join('pdf', `gg.pdf`);
	var options = {
		path: pdfPath,
		format: "A4",
		pageRanges: "1-2",
		printBackground: true,
		margin: {
			bottom: "60px",
			top: "60px"
		}
	}

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: true
	});

	var page = await browser.newPage();
	// await page.setContent(html)
	const htmlPath = await path.resolve('./index.html');
	
	await fs.writeFileSync('index.html', `${html}`, 'utf-8');
	await page.setViewport({width: 1366, height: 768, deviceScaleFactor: 1 });
	await page.goto(`file://${htmlPath}`, {
		waitUntil: 'networkidle0'
	});
	await page.emulateMedia('screen');
	await page.pdf(options);
	await browser.close();
})();
