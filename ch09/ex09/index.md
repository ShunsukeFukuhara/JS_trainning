## 問題

「SOLID 原則」とは、オブジェクト指向の設計原則として従うべき 5 つの原則である。

- 単一責任の原則 (single-responsibility principle)
- 開放閉鎖の原則（open/closed principle）
- リスコフの置換原則（Liskov substitution principle）
- インターフェース分離の原則 (Interface segregation principle)
- 依存性逆転の原則（dependency inversion principle）

これら 5 つの原則についてそれぞれ説明しなさい

## 回答

### 単一責任の原則 (Single Responsibility Principle, SRP)

単一責任の原則は、クラスやモジュールは単一の責任を持つべきであり、その責任に関連する機能のみを持つべきであるという原則である。

従っていないコード

```javascript
class Util {
  static calculateAreaOfCircle(radius) {
    return Math.PI * radius * radius;
  }

  static logMessage(message) {
    console.log(message);
  }
}
```

このコードでは、`Util` クラスが円の面積を計算する機能とメッセージをログに出力する機能の両方を持っているため、単一責任の原則に違反している。
原則に従うなら、それぞれの機能を別のクラスに分割する必要がある。

```javascript
class CircleUtil {
  static calculateArea(radius) {
    return Math.PI * radius * radius;
  }
}

class Logger {
  static log(message) {
    console.log(message);
  }
}
```

### 開放閉鎖の原則 (Open/Closed Principle, OCP)

開放閉鎖の原則は、クラスやモジュールは拡張に対して開かれているが、変更に対して閉じているべきであるという原則である。
つまり、既存のコードを変更せずに新しい機能を追加できるように設計する必要がある。

従っていないコード

```javascript
class Shape {
  constructor(type) {
    this.type = type;
  }

  area() {
    if (this.type === "circle") {
      return Math.PI * this.radius * this.radius;
    } else if (this.type === "rectangle") {
      return this.width * this.height;
    }
    throw new Error("Unknown shape type");
  }
}
```

このコードでは、`Shape` クラスが新しい形状を追加するたびに変更が必要であり、開放閉鎖の原則に違反している。
原則に従うなら、形状ごとに異なるクラスを作成し、共通のインターフェースを持たせる必要がある。

```javascript
class Shape {
  area() {
    throw new Error("area()は未実装");
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}

class Square extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}
```

### リスコフの置換原則 (Liskov Substitution Principle, LSP)

リスコフの置換原則は、サブクラスはその親クラスの代わりに使用できるべきであり、親クラスの機能を拡張または変更することなく、同じ振る舞いを提供するべきであるという原則である。

従っていないコード

```javascript
class Bird {
  fly() {
    console.log("Flying");
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguins cannot fly");
  }
}
```

このコードでは、`Penguin` クラスが `Bird` クラスのサブクラスであるが、`fly` メソッドをオーバーライドして飛ぶことができないため、リスコフの置換原則に違反している。
原則に従うなら、`Bird` クラスを飛ぶことができる鳥と飛べない鳥に分ける必要がある。

```javascript
class Bird {
  fly() {
    throw new Error("This bird cannot fly");
  }
}

class FlyingBird extends Bird {
  fly() {
    console.log("Flying");
  }
}

class Penguin extends Bird {
  // ペンギンは飛べないので、flyメソッドはオーバーライドしない
}
```

### インターフェース分離の原則 (Interface Segregation Principle, ISP)

インターフェース分離の原則は、クライアントは使用しないメソッドに依存してはならないという原則である。
つまり、クライアントが必要とするメソッドのみを持つ小さなインターフェースを作成するべきである。

従っていないコード

```javascript
class Machine {
  print() {
    console.log("Printing");
  }

  scan() {
    console.log("Scanning");
  }

  fax() {
    console.log("Faxing");
  }
}
```

このコードでは、`Machine` クラスが印刷、スキャン、ファックスの機能を持っているが、クライアントが必要としない機能も含まれているため、インターフェース分離の原則に違反している。
原則に従うなら、各機能ごとに異なるインターフェースを作成する必要がある。

```javascript
class Printer {
  print() {
    console.log("Printing");
  }
}

class Scanner {
  scan() {
    console.log("Scanning");
  }
}

class Fax {
  fax() {
    console.log("Faxing");
  }
}
```

### 依存性逆転の原則 (Dependency Inversion Principle, DIP)

依存性逆転の原則は、高レベルのモジュールは低レベルのモジュールに依存してはならず、両者は抽象に依存するべきであるという原則である。
つまり、具体的な実装ではなく、インターフェースや抽象クラスに依存するように設計する必要がある。
**コード例はindex.jsに記載されている。**
