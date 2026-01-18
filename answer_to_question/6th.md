> 無限ジェネレータはスプレッド演算子で使うと、無限ループとなりメモリ枯渇し、プログラムが異常終了する。
> しかし、for/ofループでは使えるし、take()ジェネレータと使うとさらに便利。
> とのことで、無限ジェネレータは一般的に使われるものだという認識ですが、提供されたAPIなどが無限につづくイテラブルなのか否かは使う側ですぐわかるものなのでしょうか？

APIがドキュメントを整備すれば分かるが、型などの関数の情報からは分からない。そのため、for...ofやtake()などの消費制御ができる方法で使うのが無難。

> 実務では、無限ジェネレータに限らず通常のジェネレータから値を取り出す際も、
> for/of ループや take()のように、必要な範囲で値を制御しながら扱う方が一般的でしょうか。
> 例ではスプレッド演算子もよく使われていますが、値の規模がそこまで大きくなければ、スプレッド演算子を使うことも多いのでしょうか。
> 使い分けや注意点を知りたいです。

明らかに有限で小さいことが事前に分かっている場合はスプレッド演算子を使うこともあるが、基本的にはfor...ofやtake()などで制御する方が安全。

> yield は値を返すだけでなく、next()でジェネレータに値を渡せると書いてありますが、具体的にどういう場面で使いますか？

next()で値を渡すのは、ジェネレータの外部から内部の状態を変更したい場合に使う。例えば、ジェネレータが計算を行う際に、その計算のパラメータを動的に変更したい場合などが考えられる。
チャットボット型の対話システムで、ユーザーの入力に応じてジェネレータの動作を変える場合などもある。

ただ実際につかう場面は少ない。

> 「ジェネレータを使えば、プログラムの非同期部分を隠すことができます」という記述がよくわかりませんでした。こちらについて具体例等で説明いただきたいです。

yieldを使って非同期処理の完了を待つことができるため、非同期コードを同期的なコードのように書くことができる。例えば、Promiseを返す非同期関数をジェネレータ内で呼び出し、その結果をyieldで受け取ることで、非同期処理の完了を待つことができる。
ただ、async/awaitが登場してからは、あまり使われなくなった。

> 「JavaScriptプログラム自身を非同期にするような機能はコア言語には含まれていません」とありますが、コア言語に含むというのはどのような意味でしょうか？
> Promiseの仕組みはコア言語に含まれている（p.380 13.2 の1段落目）と書いてはあります。
> これは「JavaScriptプログラム自身を非同期にする」こととは違うことなのでしょうか？（9/17 19:50 修正）

JSはPromiseの構文をサポートしているが、Promiseを実際に動かすためのイベントループや非同期I/Oの仕組みはランタイム環境（ブラウザやNode.js）が提供している。
つまり、言語仕様としてPromiseはあるが、その非同期処理を実行するための基盤は言語の外にあるということ。

> 業務のコードでたまに Promise チェーンを見かけます。await, async が使えるのにわざわざ Promise チェーンで実装するケースはありますか？

レガシーコードであることを除いても、fetch->簡単なデータ取り出し->エラーハンドリングくらいでは使うことが多い。
awaitを使うと中間操作のためだけの変数がたくさん必要になり、却って冗長になる場合がある。

```javascript
export async function getSpaceDetail(spaceId: string) {
  const url = `${config.apiUri}/v1.0/spaces/${spaceId}`;
  try {
    const response = await axios.get<SpaceDetail>(url, { withCredentials: true });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getSpaceDetail(spaceId: string) {
  const url = `${config.apiUri}/v1.0/spaces/${spaceId}`;
  return axios
    .get<SpaceDetail>(url, { withCredentials: true })
    .then(res => res.data)
    .catch(handleError);
}
```

```javascript
// Promiseチェーンのみを使用
export async function fetch() {
  return axios
    .get(`route/users/me`)
    .then((userResponse) => {
      const user = userResponse.data;
      return axios
        .get(`route/users/${user.id}/posts`)
        .then((postsResponse) => {
          const posts = postsResponse.data;
          return axios
            .get(`route/posts/${posts[0].id}/comments`)
            .then((commentsResponse) => {
              const comments = commentsResponse.data;
              return { user, posts, comments };
            })
            .catch(handleCommentsError);
        })
        .catch(handlePostsError);
    })
    .catch(handleUserError);
}

// async/awaitのみを使用
export async function fetch() {
  let user, posts, comments;

  try {
    const userResponse = await axios.get(`route/users/me`);
    user = userResponse.data;
  } catch (err) {
    console.error(`Error fetching user: ${err.message}`);
    throw err;
  }

  try {
    const postsResponse = await axios.get(`route/users/${user.id}/posts`);
    posts = postsResponse.data;
  } catch (err) {
    console.error(`Error fetching posts for user ${user.id}: ${err.message}`);
    throw err;
  }

  try {
    const commentsResponse = await axios.get(
      `route/posts/${posts[0].id}/comments`
    );
    comments = commentsResponse.data;
  } catch (err) {
    console.error(
      `Error fetching comments for post ${posts[0].id}: ${err.message}`
    );
    throw err;
  }

  return { user, posts, comments };
}

// async/awaitとPromiseチェーンを組み合わせ
export async function fetch() {
  const user = await axios
    .get(`route/users/me`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Error fetching user: ${err.message}`);
      throw err;
    });

  const posts = await axios
    .get(`route/users/${user.id}/posts`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Error fetching posts for user ${user.id}: ${err.message}`);
      throw err;
    });

  const comments = await axios
    .get(`route/posts/${posts[0].id}/comments`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(
        `Error fetching comments for post ${posts[0].id}: ${err.message}`
      );
      throw err;
    });

  return { user, posts, comments };
}
```

チェーン地獄にならない程度に1回のthenくらいなら使った方がスッキリする場合があると思う。

> 最初に満たされたPromiseの値にしか興味がない場合、Promise.race()を使用するとありますが、具体的にどのような場面なのかイメージが湧かなかったため、教えていただきたいです。

タイムアウト処理（一定時間で打ち切り）
複数候補から最速の結果を採用
ユーザー操作やイベントと競合させる

> "非効率的で同期的なコードと同じくらいに、非同期的なコードが読みやすくなり、コードの動きを分かりやすくしています”と記載があるように、
> await/asyncに関してメリットがずっと記載されているように思います。await/asyncには何かデメリットは無いのでしょうか？

エラーハンドリングではtry/catchが必要になるため、非同期関数そのものをハンドリングするという明示性が低くなる。また、連続でawaitしているときにtry/catchが冗長になる場合がある。
また、awaitした結果を中間結果として変数に保持すると、その変数のスコープが関数全体になるため、可読性が低下する場合がある。
ただ、Promiseチェーンとawaitを上手く組み合わせて使うのがベストプラクティスだと思う。

> 「awaitキーワードは、プログラムをプロック(ブロック？)せず、Promiseが完了するまで文字通り何もしません」とありますが、ここでのプログラムというのはawaitを呼び出しているプログラムを指しているのでしょうか？
> async関数内のawait以降のコードはブロックされていると感じました。

メインスレッドのことをプログラムと指しているのだと思われる。
async関数内のawait以降のコードは、そのasync関数の中ではブロックされているが、メインスレッド全体はブロックされない。つまり、awaitはそのasync関数の実行を一時停止するが、他のコードは引き続き実行される。
逆に、for文での半無限ループやwhiなど、メインスレッド全体をブロックするコードは、他のすべてのコードの実行を停止させる。

> Promise.allで一度に処理可能な非同期処理の数は、（処理自体の負荷レベル・環境のメモリ・CPU性能などによって変わるため一概には言えないと思いますが、）平均的に何件くらいなのでしょうか。PromisePoolの実装を行うかどうかの目安を知りたいと思いました。

何件とまでは言えなかった。PromisePoolを使うかどうかは予期される最大同時実行数や一回の重さを考えて明らかに多いと感じたら使うのが良いと思う。
