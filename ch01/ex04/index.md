### 開発者ツールを開いた状態のタブで HTML を開く場合

- {answer: 42}→展開するとanswer:0
- {answer: 0}→展開するとanswer:0

### HTML を開いた状態のタブで開発者ツールを開く場合

- Object→展開するとanswer:0
- Object→展開するとanswer:0

### 表示を統一する方法

1. console.dir()に変更し、展開するまで中身を隠す(実用性があるとは思えないが)
2. lifeをディープコピーする
