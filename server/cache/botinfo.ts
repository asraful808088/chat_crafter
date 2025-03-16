let botinfo = {
    "id": "e08e4493-be14-400a-b8c9-f111c1ba6df4",
    "name": "asd_asd_asd",
    "time": 1738579256429
};
function changeBotInfo(info){
    botinfo = info
}

function resetBotInfo(){
    botinfo = {}
}
function getActivityBot(){
    return botinfo
}

export { changeBotInfo ,resetBotInfo,botinfo,getActivityBot};
