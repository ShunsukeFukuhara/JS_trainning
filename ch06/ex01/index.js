// p.141 では、文字列から値へのマッピングの構造として、「ハッシュ」や「ハッシュテーブル」の記載がある。
// 文字列をハッシュ値（数値）に変換するハッシュ関数と、
// ハッシュ関数を用いて文字列から値へのマッピングを行うハッシュテーブル オブジェクトを実装しなさい。

const hash = (str) => {
  // キーは文字列であることを前提とする
  if (typeof str !== "string") {
    throw new TypeError("Key must be a string");
  }
  let hash = 0x811c9dc5; // FNV1a 32-bit 標準
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i); // 文字列の各文字のコードポイントをハッシュ値に XOR
    hash = Math.imul(hash, 0x01000193); // ハッシュ値を FNV1a 32-bit の定数で乗算
    hash >>>= 0; // 符号なし整数に変換
  }
  return hash;
};

// ハッシュテーブルは下記のコードを参考に、以下の要件を満たすようにしなさい。

// - マッピングの追加、取得、削除を行うメソッドおよびマッピング数を示すプロパティをもつこと。
// - ハッシュテーブルは生成時に配列のサイズを受け取り、固定長の配列にマッピング情報を保持する
// - 配列のインデックスとして利用できるよう、ハッシュ値をサイズに合わせて変換すること（ハッシュ値に対して配列サイズの剰余を用いる）
// - 異なる key でハッシュ値を変換したインデックスが衝突した場合は、リンクリスト形式で複数のマッピングを保持すること。
// - 例えば、capacity が 3 のハッシュテーブルに "key1": "value1" , "key2": "value2" , "key3": "value3" という順にマッピングを追加し、
//   key1 のハッシュ値を変換したインデックスが 0 、key2 と key3 のインデックスが 1 だった場合、entries の値は以下と等しくなる。

// [
//   { key: "key1", value: "value1", next: undefined },
//   { key: "key2", value: "value2", next: { key: "key3", value: "value3", next: undefined } },
//   undefined,
// ];

// リハッシュ/リサイズについては考慮しなくてよいものとする。

// ハッシュキーを配列のインデックスに変換する
const convertKeyToHashIndex = (key, capacity) => hash(key) % capacity;

export const newHashTable = (capacity) => {
  return {
    size: 0,
    entries: new Array(capacity),
    get(key) {
      //
      // keyにマップされた値を取得する
      const index = convertKeyToHashIndex(key);
      let current = this.entries[index];
      while (current) {
        if (current.key === key) {
          return current.value; // キーが見つかった場合、その値を返す
        }
        current = current.next; // 次のエントリへ移動
      }
      return undefined; // キーが見つからなかった
    },
    put(key, value) {
      // key, valueのマッピングを追加する(keyが存在する場合はvalueを上書きする)
      const index = convertKeyToHashIndex(key);
      const entry = { key, value, next: undefined };
      if (!this.entries[index]) {
        // インデックスが空の場合、新しいエントリを追加
        this.entries[index] = entry;
      } else {
        // インデックスが既に存在する場合、リンクリストを辿って追加
        let current = this.entries[index];
        while (current) {
          if (current.key === key) {
            current.value = value; // 既存のキーが見つかった場合、その値を更新して修了
            return;
          }
          if (!current.next) {
            current.next = entry; // リンクリストの末尾に新しいエントリを追加
            break;
          }
          current = current.next; // 次のエントリへ移動
        }
      }
      this.size++; // マッピング数を増やす
    },
    remove(key) {
      // keyのマッピングを削除する
      const index = convertKeyToHashIndex(key);
      let current = this.entries[index];
      let previous = null;
      while (current) {
        if (current.key === key) {
          if (previous) {
            previous.next = current.next; // 前のエントリがあれば、リンクを更新
          } else {
            this.entries[index] = current.next; // 最初のエントリを削除
          }
          this.size--; // マッピング数を減らす
          return;
        }
        previous = current; // 現在のエントリを前のエントリとして保存
        current = current.next; // 次のエントリへ移動
      }
      return undefined; // キーが見つからなかった
    },
  };
};

const sample = () => {
  const hashTable = newHashTable(10);
  hashTable.put("key1", "value1");
  hashTable.put("key2", { value: "value2" });

  console.log(`size=${hashTable.size}`); // => size=2
  console.log(`key1=${hashTable.get("key1")}`); // => key1=value1
  console.log(`key2=${JSON.stringify(hashTable.get("key2"))}`); // => key2={"value":"value2"}

  hashTable.put("key2", "new value");

  console.log(`key2=${hashTable.get("key2")}`); // => key2=new value

  hashTable.remove("key2");

  console.log(`key2=${hashTable.get("key2")}`); // => key2=undefined
  console.log(`size=${hashTable.size}`); // => size=1
};

sample();
