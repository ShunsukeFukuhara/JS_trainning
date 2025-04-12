import { removeSemicolon } from "./index.js";

describe("removeSemicolon", () => {
  it("removeSemicolon(original) returns omitted", () => {
    const original = `let a = 1;
let b = 2;`;
    const omitted = `let a = 1
let b = 2`;
    expect(removeSemicolon(original)).toBe(omitted);
  });

  it("removeSemicolon(cannotOmitOrg) returns cannotOmitEx", () => {
    const cannotOmitOrg = `let a = 1, b = 2;
let x = 'foo';
let f = function(x) { return x };
let y = x + f;
(a+b).toString();`;
    const cannotOmitEx = `let a = 1, b = 2
let x = 'foo'
let f = function(x) { return x }
let y = x + f;
(a+b).toString()`;
    expect(removeSemicolon(cannotOmitOrg)).toBe(cannotOmitEx);
  });

  it("removeSemicolon(notJS) returns notJS", () => {
    const notJS = "This is not JavaScript;";
    expect(removeSemicolon(notJS)).toBe(notJS);
  });

  it("removeSemicolon(noSemicolon) returns noSemicolon", () => {
    const noSemicolon = `let x = 1, y = 2
let z = x + y
console.log(z)`;
    expect(removeSemicolon(noSemicolon)).toBe(noSemicolon);
  });

  it("removeSemicolon(spaceAfterSemicolonOrg) returns spaceAfterSemicolonEx", () => {
    const spaceAfterSemicolonOrg = `let x = 1, y = 2;
let z = x + y;
console.log(z);`;
    const spaceAfterSemicolonEx = `let x = 1, y = 2
let z = x + y
console.log(z)`;
    expect(removeSemicolon(spaceAfterSemicolonOrg)).toBe(spaceAfterSemicolonEx);
  });

  it("removeSemicolon(multiSemicolonsOrg) returns multiSemicolonsEx", () => {
    const multiSemicolonsOrg = `let x = 1; let y = 2;
let z = x + y;
console.log(z);`;
    const multiSemicolonsEx = `let x = 1; let y = 2
let z = x + y
console.log(z)`;
    expect(removeSemicolon(multiSemicolonsOrg)).toBe(multiSemicolonsEx);
  });

  it("removeSemicolon(templateLiteralOrg) returns templateLiteralEx", () => {
    const templateLiteralOrg = `const temp = \`
    \${(() => {
      const a = 1;
      const b = \`
      \${a};
      \`;
      return b;
    })()}hogehoge
    foo;
    \`;`;
    const templateLiteralEx = `const temp = \`
    \${(() => {
      const a = 1
      const b = \`
      \${a};
      \`
      return b
    })()}hogehoge
    foo;
    \``;

    expect(removeSemicolon(templateLiteralOrg)).toBe(templateLiteralEx);
  });

  const funcDecOrg = `function f() {
      let a = 1, b = 2;
      let x = 'foo';
      let f = function(x) { return x };
      let y = x + f;
      (a+b).toString();
      return y;
    }
    f();`;

  const funcDevEx = `function f() {
      let a = 1, b = 2
      let x = 'foo'
      let f = function(x) { return x }
      let y = x + f;
      (a+b).toString()
      return y
    }
    f()`;
  it("removeSemicolon(funcDecOrg) returns funcDevEx", () => {
    expect(removeSemicolon(funcDecOrg)).toBe(funcDevEx);
  });
});
