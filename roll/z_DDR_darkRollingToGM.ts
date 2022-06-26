"use strict";
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
if (!process.env.mongoURL) {
    // @ts-expect-error TS(1108): A 'return' statement can only be used within a fun... Remove this comment to see the full error message
    return;
}
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'records'.
const records = require('../modules/records.js');
var trpgDarkRollingfunction = {};
records.get('trpgDarkRolling', (msgs: any) => {
    (trpgDarkRollingfunction as any).trpgDarkRollingfunction = msgs;
})
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'gameName'.
var gameName = function () {
    return '【暗骰GM功能】 .drgm (addgm del show) dr ddr dddr'
}
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'gameType'.
var gameType = function () {
    return 'Tool:trpgDarkRolling:hktrpg'
}
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prefixs'.
var prefixs = function () {
    return [{
        first: /(^[.]drgm$)/ig,
        second: null
    }];
}
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getHelpMes... Remove this comment to see the full error message
var getHelpMessage = async function () {
    return `【暗骰GM功能】.drgm(addgm del show) dr ddr dddr
這是讓你可以私骰GM的功能
輸入.drgm addgm 讓自己成為GM
輸入.drgm show 顯示GM列表
輸入.drgm del(編號)或all 即可刪除
輸入dr  (指令) 私訊自己 
輸入ddr (指令) 私訊GM及自己
輸入dddr(指令) 私訊GM
-------
想成為GM的人先輸入.drgm addgm
然後別人DDR 或DDDR (指令)即可以私訊給這位GM
例如輸入 ddr cc 80 鬥毆 
就會把結果私訊GM及自己
例如輸入 dddr cc 80 鬥毆 
就會把結果只私訊GM

輸入.drgm addgm (代名) 即可成為GM,如果想化名一下,
可以在addgm 後輸入一個名字, 暗骰時就會顯示
不輸入就會顯示原名
`
}
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'initialize... Remove this comment to see the full error message
var initialize = function () {
    return trpgDarkRollingfunction;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'rollDiceCo... Remove this comment to see the full error message
var rollDiceCommand = async function(
    this: any,
    {
        mainMsg,
        groupid,
        userid,
        userrole,
        botname,
        displayname,
        channelid
    }: any
) {
    let checkifsamename = 0;
    let rply = {
        default: 'on',
        type: 'text',
        text: ''
    };
    switch (true) {
        case /^help$/i.test(mainMsg[1]) || !mainMsg[1]:
            rply.text = await this.getHelpMessage();
            (rply as any).quotes = true;
            if (botname == "Line")
                rply.text += "\n因為Line的機制, 如擲骰時並無顯示用家名字, 請到下列網址,和機器人任意說一句話,成為好友. \n https://line.me/R/ti/p/svMLqy9Mik"
            return rply;
        case /(^[.]drgm$)/i.test(mainMsg[0]) && /^addgm$/i.test(mainMsg[1]):
            //
            //增加自定義關鍵字
            // .drgm[0] addgm[1] 代替名字[2]  
            checkifsamename = 0
            if (channelid)
                groupid = channelid
            //因為在DISCROD以頻道作單位
            if (groupid && userrole >= 1 && userid) {
                if ((trpgDarkRollingfunction as any).trpgDarkRollingfunction)
                    for (let i = 0; i < (trpgDarkRollingfunction as any).trpgDarkRollingfunction.length; i++) {
                        if ((trpgDarkRollingfunction as any).trpgDarkRollingfunction[i].groupid == groupid) {
                            for (let a = 0; a < (trpgDarkRollingfunction as any).trpgDarkRollingfunction[i].trpgDarkRollingfunction.length; a++) {
                                if ((trpgDarkRollingfunction as any).trpgDarkRollingfunction[i].trpgDarkRollingfunction[a].userid == userid) {
                                    checkifsamename = 1
                                }
                            }
                        }
                    }
                let temp = {
                    groupid: groupid,
                    trpgDarkRollingfunction: [{
                        userid: userid,
                        diyName: mainMsg[2] || "",
                        displayname: displayname
                    }]
                    //|| displayname

                }
                if (checkifsamename == 0) {
                    records.pushtrpgDarkRollingfunction('trpgDarkRolling', temp, () => {
                        records.get('trpgDarkRolling', (msgs: any) => {
                            (trpgDarkRollingfunction as any).trpgDarkRollingfunction = msgs;
                        })

                    })
                    rply.text = '新增成功: ' + (mainMsg[2] || displayname ||
                        "")
                } else rply.text = '新增失敗. 你已在GM列表'
            } else {
                rply.text = '新增失敗.'
                if (!userid)
                    rply.text += ' 沒有個人ID....如果是LINE的話, 要先LIKE 這個BOT.'
                if (!groupid)
                    //&& !channelid
                    rply.text += ' 此功能必須在群組中使用.'
                if (groupid && userrole < 1)
                    rply.text += ' 只有GM以上才可新增.'
            }
            return rply;
        case /(^[.]drgm$)/i.test(mainMsg[0]) && /^del$/i.test(mainMsg[1]) && /^all$/i.test(mainMsg[2]):
            //    
            //刪除所有自定義關鍵字
            //
            if (channelid)
                groupid = channelid
            if (!mainMsg[2]) return;
            if (groupid && mainMsg[2] && (trpgDarkRollingfunction as any).trpgDarkRollingfunction && userrole >= 2) {
                for (let i = 0; i < (trpgDarkRollingfunction as any).trpgDarkRollingfunction.length; i++) {
                    if ((trpgDarkRollingfunction as any).trpgDarkRollingfunction[i].groupid == groupid) {
                        let temp = (trpgDarkRollingfunction as any).trpgDarkRollingfunction[i];
                        temp.trpgDarkRollingfunction = []
                        records.settrpgDarkRollingfunction('trpgDarkRolling', temp, () => {
                            records.get('trpgDarkRolling', (msgs: any) => {
                                (trpgDarkRollingfunction as any).trpgDarkRollingfunction = msgs;
                            })
                        })
                        rply.text = '刪除所有在表GM'
                    }
                }
            } else {
                rply.text = '刪除失敗.'
                if (!groupid)
                    rply.text += '此功能必須在群組中使用. '
                if (groupid && userrole < 2)
                    rply.text += '只有GM以上才可刪除所有在表GM. '
            }

            return rply;
        case /(^[.]drgm$)/i.test(mainMsg[0]) && /^del$/i.test(mainMsg[1]) && /^\d+$/i.test(mainMsg[2]):
            //
            //刪除GM
            //
            if (channelid)
                groupid = channelid
            if (groupid && mainMsg[2] && (trpgDarkRollingfunction as any).trpgDarkRollingfunction && userrole >= 1) {
                for (let i = 0; i < (trpgDarkRollingfunction as any).trpgDarkRollingfunction.length; i++) {
                    if ((trpgDarkRollingfunction as any).trpgDarkRollingfunction[i].groupid == groupid && mainMsg[2] < (trpgDarkRollingfunction as any).trpgDarkRollingfunction[i].trpgDarkRollingfunction.length && mainMsg[2] >= 0) {
                        let temp = (trpgDarkRollingfunction as any).trpgDarkRollingfunction[i];
                        temp.trpgDarkRollingfunction.splice(mainMsg[2], 1)
                        records.settrpgDarkRollingfunction('trpgDarkRolling', temp, () => {
                            records.get('trpgDarkRolling', (msgs: any) => {
                                (trpgDarkRollingfunction as any).trpgDarkRollingfunction = msgs;
                            })
                        })
                    }
                    rply.text = '刪除成功: ' + mainMsg[2]
                }
            } else {
                rply.text = '刪除失敗.'
                if (!mainMsg[2])
                    rply.text += '沒有已註冊GM. '
                if (!groupid)
                    rply.text += '此功能必須在群組中使用. '
                if (groupid && userrole < 1)
                    rply.text += '只有GM以上才可刪除. '
            }
            return rply;
        case /(^[.]drgm$)/i.test(mainMsg[0]) && /^show$/i.test(mainMsg[1]):
            //
            //顯示列表
            //
            if (channelid)
                groupid = channelid
            records.get('trpgDarkRolling', (msgs: any) => {
                (trpgDarkRollingfunction as any).trpgDarkRollingfunction = msgs;
            })
            if (groupid) {
                let temp = 0;
                if ((trpgDarkRollingfunction as any).trpgDarkRollingfunction)
                    for (let i = 0; i < (trpgDarkRollingfunction as any).trpgDarkRollingfunction.length; i++) {
                        if ((trpgDarkRollingfunction as any).trpgDarkRollingfunction[i].groupid == groupid) {
                            rply.text += '已註冊暗骰GM列表:'
                            for (let a = 0; a < (trpgDarkRollingfunction as any).trpgDarkRollingfunction[i].trpgDarkRollingfunction.length; a++) {
                                temp = 1
                                rply.text += ("\n") + a + '. ' + ((trpgDarkRollingfunction as any).trpgDarkRollingfunction[i].trpgDarkRollingfunction[a].diyName || (trpgDarkRollingfunction as any).trpgDarkRollingfunction[i].trpgDarkRollingfunction[a].displayname) + ("\n");
                            }
                        }
                    }
                if (temp == 0) rply.text = '沒有已註冊的暗骰GM. '
            } else {
                rply.text = '不在群組. '
            }
            //顯示GM
            rply.text = rply.text.replace(/^([^(,)\1]*?)\s*(,)\s*/mg, '$1: ').replace(/,/gm, ', ')
            return rply
        default:
            break;
    }
}



// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    rollDiceCommand: rollDiceCommand,
    initialize: initialize,
    getHelpMessage: getHelpMessage,
    prefixs: prefixs,
    gameType: gameType,
    gameName: gameName
};