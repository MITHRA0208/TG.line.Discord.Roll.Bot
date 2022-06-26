// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'schema'.
const schema = require('./schema.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'crypto'.
const crypto = require('crypto');
var userList: any = null;

(async () => {
	try {
		await getRecords();
	} catch (e) {
		console.error('error: message#10')
		setTimeout(async () => {
			await getRecords();
		}, 1000)

	}
})();


function joinMessage() {
	const rawdata = fs.readFileSync("./assets/message.json");
	const message = JSON.parse(rawdata);
	let newJoinMessage = ""
	for (let index = 0; index < message.joinMessage.length; index++) {
		newJoinMessage += message.joinMessage[index] + "\n";
	}
	return newJoinMessage;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'firstTimeM... Remove this comment to see the full error message
function firstTimeMessage() {
	const rawdata = fs.readFileSync("./assets/message.json");
	const message = JSON.parse(rawdata);
	let newfirstTimeUseMessage = ""
	for (let index = 0; index < message.firstTimeUseMessage.length; index++) {
		newfirstTimeUseMessage += message.firstTimeUseMessage[index] + "\n";
	}
	return newfirstTimeUseMessage;
}


async function getRecords() {
	userList = await schema.firstTimeMessage.find({
// @ts-expect-error TS(7006): Parameter 'error' implicitly has an 'any' type.
	}).catch(error => console.error('message #42 mongoDB error: ', error.name, error.reson))
	console.log('message userList Got!')
}

// @ts-expect-error TS(7006): Parameter 'userid' implicitly has an 'any' type.
async function newUserChecker(userid, botname) {
	if (!Array.isArray(userList)) return false;
	const hash = (crypto as any).createHash('sha256').update(userid.toString()).digest('base64');
	let user = userList.find(v => {
		return v.userID == hash && v.botname == botname
	})
	if (!user) {
		userList.push({ userID: hash, botname: botname })
		user = new schema.firstTimeMessage({ userID: hash, botname: botname })
// @ts-expect-error TS(7006): Parameter 'error' implicitly has an 'any' type.
		user.save().catch(error => console.error('massage #55 mongoDB error: ', error.name, error.reson));
		return true;
	} else
		return false;

}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
	joinMessage,
	newUserChecker,
	firstTimeMessage
};