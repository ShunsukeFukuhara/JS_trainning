## 問題

jQuery Deferred について調べ Promise との関係性について説明しなさい。

## 解答

jQuery Deferredは、jQueryライブラリで提供される非同期処理の管理を容易にするためのオブジェクトである。
resolve、reject、notifyの3つの状態を持ち、非同期処理の成功、失敗、進行状況を管理できる。
また、Promiseとは異なり、Deferredオブジェクトは状態の変更が可能であり、外部から状態を操作できる点が特徴である。

jQuery Deferred はPromiseよりも前に登場した概念であり、その後ECMAScript 2015 (ES6)で標準化されたPromiseが登場した。
現在では、Promiseが標準的な非同期処理の方法として広く採用されており、jQuery Deferredは新しいプロジェクトではあまり使用されていない。
