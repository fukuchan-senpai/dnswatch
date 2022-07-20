/**
 *  DNSレコードが変更になったら Google Chat へ通知する bot
 * 
 *    Usage: GAs のスケジュールで定期的に実行
*/
function myFunction() {

  // 対象ドメイン・ホスト(FQDN)
  const fqdn = "sample.com";

  // レコードタイプ
  const type = "A"
  //const type = "MX"
  //const type = "TXT"

  // Google Public DNS
  const queryUrl = "https://dns.google.com/resolve?name=" + fqdn + "&type=" + type

  // DoH で DNS クエリー実行
  var res = UrlFetchApp.fetch(queryUrl);

  // Google Public DNS からのレスポンスコード確認
  if (res.getResponseCode() == 200) {

    let json = JSON.parse(res);
    console.log(json["Status"]);

    // ステータス確認
    if (json["Status"] == 0) {

      // 現在開いているスプレッドシートを取得
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      // 現在開いているシートを取得
      var sheet = spreadsheet.getActiveSheet();

      // 前回と違いが無いかスプレッドシートのセルを検索
      json["Answer"].forEach((element, index) => {
        var textFinder = sheet.createTextFinder(element["data"]);
        var cells = textFinder.findAll();
        if (cells.length == 0) {
          // 一致するものがシートにない場合はレコードが変更になったと判断しメッセージ送信
          var msg = type + "レコードが変更になったようだ！\n" + fqdn + "\n" + element["data"];
          console.log(msg);
          sendChat(msg);
        }
      });

      // スプレッドシートを書き換える前にクリアする
      // A列全てをクリア
      var delRange = sheet.getRange("A1:A");
      delRange.clear();
      // B列全てをクリア
      var delRange = sheet.getRange("B1:B");
      delRange.clear();

      // スプレッドシートに今回確認したAレコードを書き込む
      json["Answer"].forEach((element, index) => {
        // A列 レコード値
        sheet.getRange(index + 1,1).setValue(element["data"]);
        // B列 日時
        sheet.getRange(index + 1,2).setValue(getYMDhms());
      });
    }
  } else {
    console.log("エラー発生 [code: " + res.getResponseCode() + "]");
  }

}

/**
 * Google Chat へメッセージ送信
 *
 * @param {string} input - 入力文字列
 * @return {boolean} true
 * @customfunction
*/
function sendChat(myText) {

  var WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty("WEBHOOK_URL");
  var data = {
    "text": myText
  };
  var options = {
    'method' : "POST",
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  var res = UrlFetchApp.fetch(WEBHOOK_URL, options);

  return true;

}

/**
 * 現在日時を返す
 *
 * @param {none} 無し
 * @return {string} 日時を表す文字列 (例 2022/04/27 14:36:30)
 * @customfunction
*/
function getYMDhms() {
  var date = new Date();

  now = date.getFullYear() + '/' 
    + ('0' + (date.getMonth() + 1)).slice(-2) + '/' 
    + ('0' + date.getDate()).slice(-2) + ' ' 
    + ('0' + date.getHours()).slice(-2) + ':' 
    + ('0' + date.getMinutes()).slice(-2) + ':' 
    + ('0' + date.getSeconds()).slice(-2);

  return now;

}
