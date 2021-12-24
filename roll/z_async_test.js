"use strict";
//heroku labs:enable runtime-dyno-metadata -a <app name>
var chineseConv = require('chinese-conv'); //繁簡轉換
const duckImage = require("@zetetic/duckduckgo-images-api")
const wiki = require('wikijs').default;
const rollbase = require('./rollbase.js');
const translate = require('@vitalets/google-translate-api');
var variables = {};
var gameName = function () {
	return 'Wiki查詢/圖片搜索 .wiki .image .tran'
}
const { GSearch, GNews, GBooks, GVideo, GShop, GScholar, BASearch } = require('senginta')



var gameType = function () {
	return 'funny:Wiki:hktrpg'
}
var prefixs = function () {
	return [{
		first: /^[.]wiki$|^[.]tran$|^[.]tran[.]\S+$|^[.]image$|^[.]imagee$|^[.]video$|/i,
		second: null
	}]

}

var getHelpMessage = async function () {
	return `【Wiki查詢/即時翻譯】.wiki .image .tran .tran.(目標語言)
Wiki功能		： .wiki (條目)  
EG: .wiki BATMAN  

圖片搜尋功能	： .Image (內容)  
從Google 得到相關隨機圖片Link
隨機YES NO: 如.image yesno 會得到yes 或NO 結果

即時翻譯功能	： .tran (內容)  
預設翻譯成正體中文 
EG: .tran BATMAN 

可翻譯成其他語言 ： .tran.(語系) (內容)
EG: .tran.ja BATMAN  .tran.日 BATMAN
常用語言代碼: 英=en, 簡=zh-cn, 德=de, 日=ja
語系代碼 https://github.com/vitalets/google-translate-api/blob/master/languages.js

注: 翻譯使用Google Translate
`
}
var initialize = function () {
	return variables;
}

var rollDiceCommand = async function ({
	inputStr,
	mainMsg
}) {
	let rply = {
		default: 'on',
		type: 'text',
		text: ''
	}; //type是必需的,但可以更改
	let lang = '',
		test = '';
	//let result = {};

	switch (true) {
		case /^help$/i.test(mainMsg[1]) || !mainMsg[1]:
			rply.text = await this.getHelpMessage();
			return rply;
		case /\S+/.test(mainMsg[1]) && /[.]wiki/.test(mainMsg[0]):
			rply.text = await wiki({
				apiUrl: 'https://zh.wikipedia.org/w/api.php'
			}).page(mainMsg[1].toLowerCase())
				.then(async page => {
					return chineseConv.tify(await page.summary())
				}) //console.log('case: ', rply)
				.catch(error => {
					if (error == 'Error: No article found')
						return '沒有此條目'
					else {
						return error
					}
				})
			return rply;
		case /\S+/.test(mainMsg[1]) && /^[.]tran$/.test(mainMsg[0]):
			rply.text = await translate(inputStr.replace(mainMsg[0], ""), {
				to: 'zh-TW'
			}).then(res => {
				return res.text
			}).catch(err => {
				return err.message;
			});
			return rply;
		case /\S+/.test(mainMsg[1]) && /^[.]tran[.]\S+$/.test(mainMsg[0]):
			lang = /.tran.(\S+)/;
			test = mainMsg[0].match(lang)
			rply.text = await translate(inputStr.replace(mainMsg[0], ""), {
				to: test[1].replace("簡中", "zh-CN").replace("簡體", "zh-CN").replace(/zh-cn/ig, "zh-CN").replace("英", "en").replace("簡", "zh-CN").replace("德", "de").replace("日", "ja")
			}).then(res => {
				//console.log(res.from.language.iso);
				return res.text
			}).catch(err => {
				console.error(err.message)
				return err.message + "\n常用語言代碼: 英=en, 簡=zh-cn, 德=de, 日=ja\n例子: .tran.英\n.tran.日\n.tran.de";
			});
			return rply;
		case /\S+/.test(mainMsg[1]) && /^[.]image$/.test(mainMsg[0]):
			try {
				rply.text = await searchImage(inputStr, mainMsg, true)
				rply.type = 'image'
			} catch (error) {
				console.log('.image error')
				return rply;
			}
			return rply;

		case /\S+/.test(mainMsg[1]) && /^[.]imagee$/.test(mainMsg[0]):
			//成人版
			try {
				rply.text = await searchImage(inputStr, mainMsg, false)
				rply.type = 'image'
			} catch (error) {
				console.log('.image error')
				return rply;
			}
			return rply;
		case /\S+/.test(mainMsg[1]) && /^[.]video$/.test(mainMsg[0]):
			{	//成人版
				try {

					let a = await try_GSearch('Hello')
					console.log('a', a)
					rply.text = await searchImage(inputStr, mainMsg, false)
					rply.type = 'image'
				} catch (error) {
					console.log('.image error')
					return rply;
				}
				return rply;
			}
		default:
			break;
	}
}
async function try_GSearch(cb) {
	const search_spider = new BASearch(cb)
	const result = await search_spider.get_all()
	return result;
}
async function searchImage(inputStr, mainMsg, safe) {
	let keyword = inputStr.replace(mainMsg[0] + " ", "")
	//let page = Math.floor((Math.random() * (10)) * 10) + 1;
	if (mainMsg[1].match(/^yesno$/i)) {
		//隨機YES NO
		let A = ['yes', 'no']
		keyword = A[rollbase.Dice(A.length) - 1] + " GIF";
	}
	return await duckImage.image_search({
		query: keyword,
		moderate: safe
	})
		.then(async images => {
			if (images[0] && images[0].image) {
				//let resultnum = Math.floor((Math.random() * (images.length)) + 0)
				let resultnum = rollbase.Dice(images.length) - 1;
				return images[resultnum].image;
			} else {
				return '沒有結果'
			}

		}).catch(err => {
			console.error(err)
		})
}


module.exports = {
	rollDiceCommand: rollDiceCommand,
	initialize: initialize,
	getHelpMessage: getHelpMessage,
	prefixs: prefixs,
	gameType: gameType,
	gameName: gameName
};