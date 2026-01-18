// 以下の各関数を指示に従って修正しなさい

import { wait } from "../wait.js";

// eslint-disable-next-line no-unused-vars
function g1() {
  // TODO: then のネストを無くしなさい
  //   return wait(1000).then(() => {
  //     console.log("A");
  //     return wait(2000).then(() => {
  //       console.log("B");
  //       return wait(3000).then(() => {
  //         console.log("C");
  //       });
  //     });
  //   });

  return wait(1000)
    .then(() => {
      console.log("A");
      return wait(2000);
    })
    .then(() => {
      console.log("B");
      return wait(3000);
    })
    .then(() => {
      console.log("C");
    });
}

// g1();

// eslint-disable-next-line no-unused-vars
function g2() {
  // TODO: new Promise を使わないように書き換えなさい
  //   return new Promise((resolve, reject) => {
  //     wait(1000)
  //       .then(() => console.log("A"))
  //       .then(() => wait(2000))
  //       .then(() => console.log("B"))
  //       .then(() => wait(3000))
  //       .then(() => console.log("C"))
  //       .then(resolve, reject);
  //   });

  return wait(1000)
    .then(() => console.log("A"))
    .then(() => wait(2000))
    .then(() => console.log("B"))
    .then(() => wait(3000))
    .then(() => console.log("C"));
}

// g2();

// eslint-disable-next-line no-unused-vars
function g3() {
  // 以下2つの関数が存在するとします (中身は適当)
  function fetchUser() {
    return Promise.resolve({ id: 42, name: "John" });
  }
  // eslint-disable-next-line no-unused-vars
  function fetchUserFriends(user) {
    return Promise.resolve([
      { name: "Sam", id: 100 },
      { name: "Bob", id: 1 },
    ]);
  }

  // TODO: var, let, const による変数宣言を無くしなさい。async/awaitは使用しないこと。
  //   let temp = 0;
  //   return fetchUser()
  //     .then((user) => {
  //       temp = user;
  //       return fetchUserFriends(user);
  //     })
  //     .then((friends) => {
  //       console.log(`${temp.name} has ${friends.length} friends!`);
  //     });

  return fetchUser().then((user) => {
    return fetchUserFriends(user).then((friends) => {
      console.log(`${user.name} has ${friends.length} friends!`);
    });
  });
}

// g3();

// eslint-disable-next-line no-unused-vars
function g4() {
  function someFunction() {
    return 42;
  }

  // NOTE: この関数 g4 は Promise を返す必要があるものとする
  // (利用しているフレームワークはライブラリがそういう関数を要求するとでも思って下さい)
  // TODO: new Promise を使わないように書き換えなさい。async/awaitは使用しないこと。
  // eslint-disable-next-line no-unused-vars
  //   return new Promise((resolve) => {
  //     const value = someFunction();
  //     return value;
  //   });

  return Promise.resolve(someFunction());
}
