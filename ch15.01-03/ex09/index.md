## 問題

React, jQuery などの主要なフロントエンドフレームワークを選び、そのフレームワークを使っていればどのように XSS 対策がされるか、また使っていてもどのような XSS の危険が残るか記述しなさい。

## 解答

Angular:
[https://angular.jp/best-practices/security](https://angular.jp/best-practices/security)

Angularは、XSSのバグを体系的に阻止するために、すべての値をデフォルトで信頼されていないものとして扱う。
テンプレートバインディングや補間からDOMに値が挿入されると、Angularは信頼されていない値をサニタイズしてエスケープする。

```html
<h3>Binding innerHTML</h3>
<p>Bound value:</p>
<p class="e2e-inner-html-interpolated">{{ htmlSnippet }}</p>
<p>Result of binding to innerHTML:</p>
<p class="e2e-inner-html-bound" [innerHTML]="htmlSnippet"></p>
```

しかし、Angularのこの仕組みを用いても、bypassSecurityTrust...()メソッドを使用して信頼されていない値を信頼された値としてマークしたりすると、XSSの脆弱性が発生する可能性がある。
