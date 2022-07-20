# DNSWATCHとは

DNSのレコードを監視し、更新されていたら Google Chat へ通知する GAS スクリプトです。  

Aレコード、TXTレコード、MXレコードなどに対応しています。  

テストはしていませんが NS レコードや CNAME なども対応できるはずです。 

GAS とは Google Apps Script の略です。  

## 使い方

通知するための Google Chat スペースを作成し、WEBHOOK URL を取得しておきます。  

空の Google スプレッドシートを用意します。  

用意した Google スプレッドシートのコードとして code.gs の中身を貼り付けます。  

const fqdn の値を DNS 問い合わせしたい FQDN またはドメイン名に変更します。  

const type の値を DNS 問い合わせしたいレコードタイプに変更します。  

GAS の環境変数 で WEBHOOK_URL を作成し、Google Chat の WEBHOOK URL を値に貼り付けます。  

GAS のトリガーで1時間ごとに myFunction を実行します。  

https://user-images.githubusercontent.com/12945672/179905910-1c7acf21-8f3d-45da-b8d5-41438d47eb87.png

## バージョン情報

2022/07/20 1.0 First Release
