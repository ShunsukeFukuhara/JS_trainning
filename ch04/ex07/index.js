function set42(key) {
  eval(`${key} = 42;`);
}

// システムに負荷を与える
set42("while (true) console.log('あああああ'); const a");

// セキュリティの問題となる挙動を取る
set42(
  `(async () => {
    const zip = '1000001';
    const url = \`https://zipcloud.ibsnet.co.jp/api/search?zipcode=\${zip}\`;

    // 悪意のあるサイトにアクセス
    fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.results) {
        const result = data.results[0];
        console.log(\`\${result.address1} \${result.address2} \${result.address3}\`);
        } else {
        console.log('該当なし:', data.message);
        }
    })
})(); const a`
);
