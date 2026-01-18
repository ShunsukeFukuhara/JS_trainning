## 問題

実際のサービスの通信をデベロッパーツールなどで眺めて CORS の設定を確認しなさい。
(金融系の認証ページなどで CORS の設定がされていることが多い)

## 解答

- [三菱UFJ銀行](https://directg.s.bk.mufg.jp/APL/LGP_P_01/RU/LG_0001/LG_0001_PC05)

```
# このオリジンからのJavaScriptによるレスポンスの取得を許可
Access-Control-Allow-Origin: https://directg.s.bk.mufg.jp
# Cookie などの認証情報を含むリクエストを許可
Access-Control-Allow-Credentials: true
# 許可するメソッド
Access-Control-Allow-Methods: POST
# 許可するヘッダー
Access-Control-Allow-Headers: User-Agent,Cache-Control,Pragma,CSRF-Token,Content-Type,X-Screen-ID,X-Screen-Event-ID,Remote-Addr,True-Client-IP,X-Trusteer-Rapport
# プリフライトリクエストの結果をキャッシュする時間(秒)
Access-Control-Max-Age: 600
```
