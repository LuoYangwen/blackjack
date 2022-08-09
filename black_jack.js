//遊戲邏輯：ＪＱＫ皆視為１０點，Ａ可以當作１點或１１點，在２１點之內分數高者勝
var counter = 0 //發牌次數，用於計算抽取牌庫的第幾張牌
var winner = "" //紀錄獲勝玩家，player1為電腦 player2為玩家
var hastood = false //標記玩家是否不要牌了

//club:梅花 diamond菱形 heart愛心 spade黑桃
var cards = [
    "club01", "club02", "club03", "club04", "club05", "club06", "club07",
    "club08", "club09", "club10", "club11", "club12", "club13", "diamond01",
    "diamond02", "diamond03", "diamond04", "diamond05", "diamond06", "diamond07",
    "diamond08", "diamond09", "diamond10", "diamond11", "diamond12", "diamond13",
    "heart01", "heart02", "heart03", "heart04", "heart05", "heart06", "heart07",
    "heart08", "heart09", "heart10", "heart11", "heart12", "heart13",
    "spade01", "spade02", "spade03", "spade04", "spade05", "spade06", "spade07",
    "spade08", "spade09", "spade10", "spade11", "spade12", "spade13"
];

//生成亂數
var getrand = function(begin, end) {
    return Math.floor(Math.random() * (end - begin)) + begin;
}


//洗牌
var rand, tmp;
for (var i = 0; i < 1000; i++) {
    rand = getrand(1, 52);
    tmp = cards[0];
    cards[0] = cards[rand];
    cards[rand] = tmp;
}

//玩家手牌
var cards1 = [getNewCard(), getNewCard()]; //電腦獲取兩張手牌
var cards2 = [getNewCard(), getNewCard()]; //玩家獲取兩張手牌

//將牌組顯示在畫面中
var table = document.getElementById('tableboard');
table.rows[0].cells[1].innerHTML = '<img src="resource\\cardback.png">'; //電腦第一張牌為蓋牌狀態
table.rows[0].cells[2].innerHTML = '<img src="resource\\' + cards1[1] + '.jpg ">';
table.rows[1].cells[1].innerHTML = '<img src="resource\\' + cards2[0] + '.jpg ">';
table.rows[1].cells[2].innerHTML = '<img src="resource\\' + cards2[1] + '.jpg ">';
showScore();

//獲取一張手牌
function getNewCard(player) {
    var card = cards[counter++]; //抽取的卡為牌堆中第(發牌次數加1)張卡
    if (player == 'player1') { //電腦抽卡
        var len = cards1.length;
        cards1[len] = card;
        table.rows[0].cells[len + 1].innerHTML = '<img src="resource\\' + cards1[len] + '.jpg ">';
    } else if (player == 'player2') { //玩家抽卡
        var len = cards2.length;
        cards2[len] = card;
        table.rows[1].cells[len + 1].innerHTML = '<img src="resource\\' + cards2[len] + '.jpg ">';
    }
    return card;
}
//玩家抽牌(按下hit按鈕)
function hit() {
    getNewCard('player2');
    if (checkBust('player2')) {
        document.getElementById('bulletin').innerHTML = '你爆了';
        document.getElementById('hit').disabled = true;
        document.getElementById('stand').disabled = true;
        winner = 'player1';
    }
    showScore();
}
//計算是否爆牌
function checkBust(player) {
    var result = 0;
    if (player == 'player1') {
        for (var i = 0; i < cards1.length; i++) {
            var c = parseInt(cards1[i].substring(cards1[i].length - 2), '10');
            if (c > 10) {
                c = 10;
            }
            result += c;
        }
        if (result > 21) {
            return true;
        } else {
            return false;
        }
    } else if (player == 'player2') {
        for (var i = 0; i < cards2.length; i++) {
            var c = parseInt(cards2[i].substring(cards2[i].length - 2), '10');
            if (c > 10) {
                c = 10;
            }
            result += c;
        }
        if (result > 21) {
            return true;
        } else {
            return false;
        }
    }
}
//計算分數
function calcResult(player) {
    var result = 0; //用於計算分數
    var countofA = 0; //用於計算有幾張A

    if (player == 'player1') {
        for (var i = 0; i < cards1.length; i++) {
            var c = parseInt(cards1[i].substring(cards1[i].length - 2), '10');
            if (c > 10) {
                c = 10;
            } else if (c == 1) { //當牌為A的時候，將countofA加1
                countofA++;
            }
            result += c;
        }
        for (var i = 0; i < countofA; i++) {
            if (result + 10 <= 21) { //判斷將A當作11時是否小於等於21，是的話則當作11用
                result += 10;
            } else {
                break;
            }
        }
    } else if (player == 'player2') {
        for (var i = 0; i < cards2.length; i++) {
            var c = parseInt(cards2[i].substring(cards2[i].length - 2), '10');
            if (c > 10) {
                c = 10;
            } else if (c == 1) {
                countofA++;
            }
            result += c;
        }
        for (var i = 0; i < countofA; i++) {
            if (result + 10 <= 21) {
                result += 10;
            } else {
                break;
            }
        }
    }
    return result;
}

function showScore() {
    var result1 = calcResult('player1');
    var result2 = calcResult('player2');
    document.getElementById('score').innerHTML = 'Computer：You = ' + (hastood == true ? result1 : '?') + '：' + result2;
    //hastood == true成立時顯示result1，否則顯示?
    //於發牌、抽牌、無人爆牌、清空牌桌階段皆須呼喚showScore()
}

//玩家選擇不要了
function stand() {
    hastood = true;
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    table.rows[0].cells[1].innerHTML = '<img src="resource\\' + cards1[0] + '.jpg ">'; //翻開電腦的底牌
    //電腦抽牌
    while (calcResult('player1') < getrand(16, 20)) {
        getNewCard('player1');
        if (checkBust('player1')) {
            document.getElementById('bulletin').innerHTML = '電腦爆牌,你贏了'
            winner = 'player2';
        }
    }
    //當電腦跟玩家都沒有爆牌時，計算誰分數高
    if (winner == '') {
        var result1 = calcResult('player1');
        var result2 = calcResult('player2');
        if (result1 == result2) {
            document.getElementById('bulletin').innerHTML = '平局'
        } else if (result1 > result2) {
            document.getElementById('bulletin').innerHTML = '你輸了'
        } else if (result1 < result2) {
            document.getElementById('bulletin').innerHTML = '你贏了'
        }
    }
    showScore();
}

function restart() {
    document.getElementById('hit').disabled = false;
    document.getElementById('stand').disabled = false;
    counter = 0 //發牌次數，用於計算抽取牌庫的第幾張牌
    winner = "" //紀錄獲勝玩家，player1為電腦 player2為玩家
    hastood = false //標記玩家是否不要牌了
        //club:梅花 diamond菱形 heart愛心 spade黑桃
    cards = [
        "club01", "club02", "club03", "club04", "club05", "club06", "club07",
        "club08", "club09", "club10", "club11", "club12", "club13", "diamond01",
        "diamond02", "diamond03", "diamond04", "diamond05", "diamond06", "diamond07",
        "diamond08", "diamond09", "diamond10", "diamond11", "diamond12", "diamond13",
        "heart01", "heart02", "heart03", "heart04", "heart05", "heart06", "heart07",
        "heart08", "heart09", "heart10", "heart11", "heart12", "heart13",
        "spade01", "spade02", "spade03", "spade04", "spade05", "spade06", "spade07",
        "spade08", "spade09", "spade10", "spade11", "spade12", "spade13"
    ];
    //洗牌
    var rand, tmp;
    for (var i = 0; i < 1000; i++) {
        rand = getrand(1, 52);
        tmp = cards[0];
        cards[0] = cards[rand];
        cards[rand] = tmp;
    }
    //玩家重新抽手牌
    cards1 = [getNewCard(), getNewCard()]; //電腦獲取兩張手牌
    cards2 = [getNewCard(), getNewCard()]; //玩家獲取兩張手牌
    //將牌組顯示在畫面中
    table = document.getElementById('tableboard');
    table.rows[0].cells[1].innerHTML = '<img src="resource\\cardback.png">'; //電腦第一張牌為蓋牌狀態
    table.rows[0].cells[2].innerHTML = '<img src="resource\\' + cards1[1] + '.jpg ">';
    table.rows[1].cells[1].innerHTML = '<img src="resource\\' + cards2[0] + '.jpg ">';
    table.rows[1].cells[2].innerHTML = '<img src="resource\\' + cards2[1] + '.jpg ">';
    showScore();
    //清空牌桌
    for (var i = 3; i < table.rows[0].cells.length; i++) {
        table.rows[0].cells[i].innerHTML = '';
        table.rows[1].cells[i].innerHTML = '';
    }
    document.getElementById('bulletin').innerHTML = '請做出選擇';
}