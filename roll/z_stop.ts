"use strict";
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
if (!process.env.mongoURL) {
    // @ts-expect-error TS(1108): A 'return' statement can only be used within a fun... Remove this comment to see the full error message
    return;
}
var save = {};
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'records'.
const records = require('../modules/records.js');
records.get('block', (msgs: any) => {
    (save as any).save = msgs;
})
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'VIP'.
const VIP = require('../modules/veryImportantPerson');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'limitArr'.
const limitArr = [30, 200, 200, 300, 300, 300, 300, 300];
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'gameName'.
var gameName = function () {
return '【擲骰開關功能】 .bk (add del show)'
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'gameType'.
var gameType = function () {
    return 'admin:Block:hktrpg'
}
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prefixs'.
var prefixs = function () {
    return [{
        first: /^[.]bk$/ig,
        second: null
    }];
}
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getHelpMes... Remove this comment to see the full error message
var getHelpMessage = async function () {
    return `【擲骰開關功能】
這是根據關鍵字來開關功能,只要符合內容,
例如運勢,那麼只要字句中包括,就不會讓Bot有反應
所以注意如果用了D, 那麼1D100, .1WD 都會全部沒反應.
另外不可擋b,k,bk, 只可以擋漢字,數字和英文
P.S.如果沒立即生效 用.bk show 刷新一下
輸入.bk add xxxxx 即可增加關鍵字 每次一個
輸入.bk show 顯示關鍵字
輸入.bk del (編號)或all 即可刪除`
}
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'initialize... Remove this comment to see the full error message
var initialize = function () {
    return save;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'rollDiceCo... Remove this comment to see the full error message
var rollDiceCommand = async function(
    this: any,
    {
        mainMsg,
        groupid,
        userrole
    }: any
) {
    let rply = {
        default: 'on',
        type: 'text',
        text: ''
    };
    let lv;
    let limit = limitArr[0];
    switch (true) {
        case /^help$/i.test(mainMsg[1]) || !mainMsg[1]:
            rply.text = await this.getHelpMessage();
            (rply as any).quotes = true;
            return rply;
        case /^add$/i.test(mainMsg[1]) && /^\S+$/ig.test(mainMsg[2]):
            //增加阻擋用關鍵字
            //if (!mainMsg[2]) return;
            if (!groupid) {
                rply.text = '此功能必須在群組中使用'
                return rply;
            }
            if (mainMsg[2].length <= 1 || /bk/ig.test(mainMsg[2])) {
                rply.text = '至少兩個字，及不可以阻擋bk'
                return rply;
            }
            lv = await VIP.viplevelCheckGroup(groupid);
            limit = limitArr[lv];
            var findVIP = (save as any).save.find(function (item: any) {
    return item._doc.groupid;
});
            if (findVIP)
                if (findVIP._doc.blockfunction.length >= limit) {
                    rply.text = '關鍵字上限' + limit + '個\n支援及解鎖上限 https://www.patreon.com/HKTRPG\n';
                    return rply;
                }
            if (mainMsg[2] && userrole >= 2) {
                let temp = {
                    groupid: groupid,
                    blockfunction: mainMsg[2]
                }
                records.pushblockfunction('block', temp, () => {
                    records.get('block', (msgs: any) => {
                        (save as any).save = msgs;
                    })

                })
                rply.text = '新增成功: ' + mainMsg[2]
            } else {
                rply.text = '新增失敗.'
                if (!mainMsg[2])
                    rply.text += '沒有關鍵字. '
                if (!groupid)
                    rply.text += '此功能必須在群組中使用. '
                if (groupid && userrole < 2)
                    rply.text += '只有GM以上才可新增. '
            }
            return rply;

        case /^del$/i.test(mainMsg[1]) && /^all$/i.test(mainMsg[2]):
            //刪除阻擋用關鍵字
            if (groupid && mainMsg[2] && (save as any).save && userrole >= 2) {
                for (let i = 0; i < (save as any).save.length; i++) {
                    if ((save as any).save[i].groupid == groupid) {
                        let temp = (save as any).save[i];
                        temp.blockfunction = []
                        records.set('block', temp, () => {
                            records.get('block', (msgs: any) => {
                                (save as any).save = msgs;
                            })
                        })
                        rply.text = '刪除所有關鍵字'
                    }
                }
            } else {
                rply.text = '刪除失敗.'
                if (!groupid)
                    rply.text += '此功能必須在群組中使用. '
                if (groupid && userrole < 2)
                    rply.text += '只有GM以上才可刪除. '
            }

            return rply;
        case /^del$/i.test(mainMsg[1]) && /^\d+$/i.test(mainMsg[2]):
            //刪除阻擋用關鍵字
            if (groupid && mainMsg[2] && (save as any).save && userrole >= 2) {
                for (let i = 0; i < (save as any).save.length; i++) {
                    if ((save as any).save[i].groupid == groupid && mainMsg[2] < (save as any).save[i].blockfunction.length && mainMsg[2] >= 0) {
                        let temp = (save as any).save[i];
                        temp.blockfunction.splice(mainMsg[2], 1)
                        records.set('block', temp, () => {
                            records.get('block', (msgs: any) => {
                                (save as any).save = msgs;
                            })
                        })

                    }
                    rply.text = '刪除成功: ' + mainMsg[2]
                }
            } else {
                rply.text = '刪除失敗.'
                if (!mainMsg[2])
                    rply.text += '沒有關鍵字. '
                if (!groupid)
                    rply.text += '此功能必須在群組中使用. '
                if (groupid && userrole < 2)
                    rply.text += '只有DM以上才可刪除. '
            }
            return rply;

        case /^show$/i.test(mainMsg[1]):
            records.get('block', (msgs: any) => {
                (save as any).save = msgs;
            })
            if (groupid) {
                let temp = 0;
                for (let i = 0; i < (save as any).save.length; i++) {
                    if ((save as any).save[i].groupid == groupid) {
                        rply.text += '阻擋用關鍵字列表:'
                        for (let a = 0; a < (save as any).save[i].blockfunction.length; a++) {
                            temp = 1
                            rply.text += ("\n") + a + '. ' + (save as any).save[i].blockfunction[a];
                        }
                    }
                }
                if (temp == 0) rply.text = '沒有阻擋用關鍵字. '
            } else {
                rply.text = '不在群組. '
            }
            //顯示阻擋用關鍵字
            return rply;
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