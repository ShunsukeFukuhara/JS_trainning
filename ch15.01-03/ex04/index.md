## 問題

グローバルオブジェクトを参照する方法を、ブラウザ内、node 内、ブラウザ node 問わずの３種記しなさい。
また、ブラウザと node のグローバルオブジェクトのプロパティやメソッドを比較し、ブラウザ独自のものを 10 程度記しなさい。
最後に、グローバルオブジェクトに undefined が定義されていることを確認し、過去の ES 仕様でどのような問題が発生していたかを記しなさい。

## 回答

- ブラウザ内: windowのプロパティとして参照可能
- node内: globalのプロパティとして参照可能
- ブラウザ node 問わず: globalThisのプロパティとして参照可能

- ブラウザ独自のもの
  - document
  - navigator
  - location
  - alert
  - confirm
  - prompt
  - fetch
  - XMLHttpRequest
  - localStorage
  - sessionStorage
  - setTimeout
  - setInterval
  - clearTimeout
  - clearInterval

グローバルオブジェクトに undefined が定義されていたことで、過去のES仕様ではundefinedが書き換え可能な変数として扱われていたため、
開発者が意図せずにundefinedの値を変更してしまう可能性があった。
