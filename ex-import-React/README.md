# 概要

`import React from 'react'`で読み込まれるものは何か、明らかにしていきます。

## ゴール

import文で読み込まれるReactの実体が何か理解することを目指します。


## 前置き

importするときに何が起こっているのか、ふと疑問に思いました。
調べているとESModules・CommonJS間の橋渡しや実際に読み込まれるものなど、色々と興味深いものがあったので、記事にまとめることにします。

以降では、TypeScriptを書くときに読み込まれるもの・コンパイル後のJavaScriptで処理されるときに読み込まれるものを見ていきます。

## 先にざっくり結論

個々を探っていく中で迷子にならないよう、最初に全体図を見ておきましょう。 大まかな流れは以下の通りです。

* TypeScriptで書かれた`import React from 'react'`は型定義ファイルを参照
* 型定義ファイルから、`React.FC`のような型や、`React.createElement()`のシグニチャが参照できるようになる

* JavaScriptへコンパイルされた後は、モジュール読み込みがCommonJS形式へ変換される
* 実体を読み込むときは、`node_modules/react`を参照

そして、一点押さえておいて頂きたいのは、React本体がnpmモジュールであり、JavaScriptで書かれたものである、 ということです。

---

以降では、TypeScript・JavaScriptそれぞれの視点から、どんなモジュールがどのように読み込まれるのか
追っていきます。

### TypeScriptの視点

TypeScriptには、JavaScriptファイルに型情報を補うための「型定義ファイル」と呼ばれるものが存在します。
TypeScriptでモジュールを読み込むときには、型定義ファイルがモジュール本体のJavaScriptファイルよりも
優先されるようになっています。

[参考](https://www.typescriptlang.org/docs/handbook/module-resolution.html#how-typescript-resolves-modules)

Reactの場合は、[DefinitelyTyped](https://definitelytyped.org/)というプロジェクトがつくった
型定義ファイルを参照します。
これは、TypeScriptにより、@types(DefinitelyTypedのnpmリポジトリ)に関連するディレクトリが
型定義として扱われることにより実現されます。

[参考](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html#library-file-layout)

少し込み入った話になってしまいましたので、要点だけ抜き出していきましょう。
TypeScriptで書かれた`import React from 'react'`は、Reactモジュール本体を
直接参照するのではなく、@typesが管理する型定義ファイルを参照します。

※ 型定義ファイルの実体は、`node_modules/@types/`ディレクトリ配下に存在します。

型定義ファイルでは関数などの型が書かれているので、importした後は、React本体がJavaScriptで書かれていても、
型の恩恵にあずかることができます。

イメージを掴みやすくするため、実際の型定義ファイルを一部抜粋して載せておきます。

```TypeScript
// node_modules/@types/react/index.d.ts
// namespaceがexportされる namespaceはReact.[型 | 関数]のように表記することが可能となる記法
export = React;
// 参考: https://www.typescriptlang.org/docs/handbook/modules.html#umd-modules
export as namespace React;

// namespace参考: https://www.typescriptlang.org/docs/handbook/namespaces.html
// 名前空間により、React.FCや、React.createElement()のように書ける
declare namespace React {
    // 中略...
    function createElement(
        type: "input",
        props?: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement> | null,
        ...children: ReactNode[]): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
}
```


### JavaScriptの視点-npmモジュールとしてのReact

TypeScriptがコンパイルされた後は、通常、モジュール読み込みはCommonJS形式へと変換されます。
これにより、Reactモジュールを読み込む処理は、React本体が格納されているnode_modulesディレクトリを
探しに行くことになります。
そして、パッケージ名(react)で読み込むときは、package.jsonのmainプロパティに書かれたファイルを起点とします。

つまり、`node_modules/react/index.js`がReactとして読み込まれます。
[参考](https://nodejs.org/api/modules.html)

React本体はとても複雑なものではありますが、イメージを掴むためにも、少しだけ中を覗いてみましょう。

```JavaScript
// node_modules/react/index.js
'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/react.production.min.js');
} else {
    module.exports = require('./cjs/react.development.js');
}

```

ここで重要なのは、Reactモジュールを参照すると、関数などを格納したモジュールオブジェクトが得られます。
モジュールのプロパティに`createElement()`が存在することで、`React.createElement()`のように
書くことができるのです。

---

さて、TypeScript・JavaScriptそれぞれの視点でReactを読み込むときの挙動を追っていきました。
ただ、個々を見ていくだけでは全体の繋がりが見えづらくなってしまいます。

そこで、復習がてら簡単なサンプルを試してみましょう。

### シンプルな例で試す

モジュールを読み込むときの流れをよりシンプルな形で理解できるよう、例を見てみます。
実験用に、以下のファイル構成を持つディレクトリをつくります。

```
playground
├── moduleObject.d.ts
├── moduleObject.js
├── playground.js
└── playground.ts
```

`moduleObject.js`がReactと同じく、JavaScriptファイル・型定義ファイルで構成されています。
`playground.ts`でモジュールを読み込んだときの様子から、本当に型定義ファイルが読み込まれたのか検証します。
そして、コンパイル結果の.jsファイルから、CommonJS形式でモジュールが読み込まれているのか確認します。

#### moduleObject

なんてことはない、関数と定数をexportしているだけのモジュールです。
のちほど、.tsファイルで型定義ファイルが読み込まれたことを検証するため、
型定義ファイルには定数定義を含めないでおきます。

```JavaScript
// moduleObject.js
function createElement() {
    return 'Created';
};
const hiddenConstant = 'HIDDEN...';
exports.createElement = createElement;
exports.hiddenConstant = hiddenConstant;
```

```TypeScript
// moduleObject.d.ts
export = Riakuto;
// Reactにあわせ、名前空間をexport
declare namespace Riakuto {
    function createElement(): string;
}
```

#### playground.ts

npmパッケージではありませんが、JavaScriptファイル・同名の型定義ファイルが存在する状態で
対象モジュールをimportすることで、同じような状況を作り出せるはずです。

```JavaScript
// playground.ts
import Riakuto from './moduleObject';

Riakuto.createElement();
```

JavaScriptファイル本体に存在はしますが、型定義ファイルにはない定数を参照してみましょう。
すると、型チェックに引っかかりました。

![image](https://user-images.githubusercontent.com/43694794/128698704-e4f72c82-a7df-4ead-b4cb-68d517c6fb49.png)

ここから、TypeScriptでは、JavaScriptファイル本体ではなく、型定義ファイルが読み込まれていたことが
分かります。

#### playground.js

最後に、コンパイル結果も覗いておきます。
複雑そうなことが書いてありますが、大事なのは、`require("./moduleObject")`と書かれていることです。

つまり、コンパイル後は、CommonJS形式でモジュールを読み込んでいることが分かります。


```JavaScript
// playground.js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// requireでモジュールを読み込んでいる
var moduleObject_1 = __importDefault(require("./moduleObject"));
moduleObject_1["default"].createElement();
```

---

さて、簡単なサンプルを例に動きを見てみましたが、Reactの場合も大筋は同じような流れとなっているはずです。
けっこうな寄り道となりましたが、import周りの仕組みは混乱しやすいところなので、この機会に復習してみるのも
よいかもしれません。
