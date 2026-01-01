## 問題

1. 標準入力、標準出力、標準エラー出力、リダイレクト、パイプという単語について調べなさい
2. 以下のコードを cat.mjs というファイルに保存し、後述する実験の結果を予測し、実際に実験しなさい

   ```js
   import fs from "fs";

   if (process.argv.length > 2) {
     // node cat.js foo.txt といった形式ならばファイルを読み込み標準出力に出力する
     fs.createReadStream(process.argv[2]).pipe(process.stdout);
   } else {
     // そうでなければ標準入力を標準出力に出力する
     process.stdin.pipe(process.stdout);
   }
   ```

   実験: file は適当なファイルとし invalid-file は存在しないファイルとしなさい

   1. node cat.mjs
   2. echo FOO | node cat.mjs
   3. node cat.mjs > output.txt
   4. node cat.mjs file
   5. node cat.mjs file > output.txt
   6. node cat.mjs invalid-file > output.txt
   7. node cat.mjs invalid-file 2> error.txt

## 解答

1.  - **標準入力**: プログラムが外部からデータを受け取るためのデフォルトの入力ストリーム。通常はキーボードからの入力が割り当てられる(リダイレクトやパイプによって他の入力ソースに変更可能)。

    - **標準出力**: プログラムが外部にデータを出力するためのデフォルトの出力ストリーム。通常はコンソールやターミナルに表示される(同上)。

    - **標準エラー出力**: プログラムがエラーメッセージを出力するためのストリーム。標準出力とは別に扱われ、通常はコンソールに表示される(同上)。

    - **リダイレクト**: コマンドラインで、標準入力、標準出力、または標準エラー出力をファイルや他のストリームに変更する操作。例えば、`>` を使って標準出力をファイルに書き込むことができる。

    - **パイプ**: 一つのコマンドの出力を別のコマンドの入力として渡す操作。`|` を使って複数のコマンドを連結し、データを流すことができる。

2.  実験の予測と結果:
    コマンド | 予測される結果 | 実際の結果 |
    ------- | -------------- | --------------|
    node cat.mjs | コンソール入力が出来、その入力をそのままコンソール出力する | 同左 |
    echo FOO \| node cat.mjs | FOOがそのまま出力される | 同左 |
    node cat.mjs > output.txt | コンソール入力が出来、その入力をoutput.txtに書き込む | 同左 |
    node cat.mjs file | fileの内容をコンソール出力する | 同左 |
    node cat.mjs file > output.txt | fileの内容をoutput.txtに書き込む | 同左 |
    node cat.mjs invalid-file > output.txt | コンソールでエラーが発生する。output.txtは何も起こらない | 同左 |
    node cat.mjs invalid-file 2> error.txt | コンソールでエラーが発生する。error.txtにエラー内容を書き込む | コンソールでエラーが発生**しない**。error.txtにエラー内容を書き込む。プログラムは終了する |
