# 概要

本章では、Reactの最初の一歩として、Hello Worldプログラムを書いていきます。

## 本章のゴール

Reactが動く環境をつくり、Hello Worldがどんな仕組みで実現されているのか、
ざっくりとでも理解することを目指します。


## 環境づくり

今回は、Reactを使わない生のDOM操作も試したいので、webpackで環境をつくります。
環境構築は別途記事でまとめているので、良ければそちらを見てみてください。
[TODO 記事へのリンク]()

環境構築が面倒だという方は、appディレクトリ配下のファイルをダウンロードし、`npm install`コマンドを
実行してしまいましょう。

以降の実践でも、本章でつくった環境をベースとしていきます。


## 用語整理

初めて触れるものは、用語の意味を押さえておくと、ぐっと理解が深まります。
全体の雰囲気を掴むために・理解が曖昧になったときに戻ってこられるように、ここで最初にまとめておきます。

* React: UIを構築するためのJavaScriptライブラリ
* Component: UI(ボタン・フォーム・一覧など)をJavaScript上で表現したもの
* JSX(JavaScript XML): UIの見た目部分を表現するのに有用なJavaScriptの拡張記法
* React element: JSXがブラウザなどでも解釈できるようJavaScriptのオブジェクトへ変換された結果


## 何はともあれHello World

Hello WorldでReactの最初の一歩を踏み出します。
コードは長くありませんが、いくつかReactのお作法をなぞる箇所があるので、
後ほど補足していきます。

まずは全体像を掴むためにも、コードを見てみましょう。

```JavaScript
// index.tsx

// 必要なモジュールをimport
import React from 'react';
import ReactDOM from 'react-dom';

// コンポーネント定義
export const App: React.FC = () => {
    return (
        <h1>
            Hello, React!!
        </h1>
    );
};

// DOMへ描画
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
```

### ざっくり処理フロー

コードを眺めることで全体の大まかな形は見えてきましたが、流れを掴むのは難しそうです。
迷子にならないよう、最初に簡単に押さえておきましょう。
上のコードの流れを箇条書きで整理してみると、

* Reactが動作するために必要なモジュールをimport
  
* UI(画面)を表現するための要素としてコンポーネントを作成
* コンポーネントでは、React elementの元となるJSXを返却
  
* ReactDOMモジュールでコンポーネントをDOMへ描画
  
* 処理結果として、HTMLへコンポーネントと対応するDOM要素が反映される

となります。
Reactを利用する準備を進め、Reactに描画して欲しいものを組み立てる。
そして、最後にReactへ実際の描画処理を依頼、といった感じでしょうか。

---

以降では、処理を3つの固まりに分け、それぞれの記述をもう少し詳しく追っていきます。
Reactの書き方を深く理解するためにも、順にたどっていきます。

### import文

JSXの変換結果からReact elementをつくるためのReactパッケージ・それをDOMへ描画するためのReactDOMパッケージを
importしています。

#### ReactとReactDOMの違い

import文には、ReactとReactDOMがそれぞれ含まれています。
ReactはJavaScriptのライブラリですし、よしなにDOMを操作してくれそうなので、Reactだけで
十分なように思えます。

にも関わらずモジュールが分けられているのは、なぜなのでしょうか。
これは、Reactが掲げる「Learn Once, Write Anywhere」の 考えにもとづいているようです。
後ほど触れていきますが、Reactモジュールによって描画対象は、React elementへ変換されます。
その後の描画先をDOMに限定せず、スマホアプリなどにも拡張できるよう、レンダリング用のモジュールが
分かれていったようです。

よって、DOM操作でReactの力を借りたいときは、React・ReactDOMそれぞれをimportする必要があります。

#### 余談: importで読み込まれるものは何か

importするときに何が起こっているのか、ふと疑問に思いました。
ESModules・CommonJS間の橋渡しや実際に読み込まれるものなど、個人的に調べていて興味深いところでしたが、
「Reactの書き方を理解する」本筋から逸れてしまうので、補足に書くことにします。

<details>
<summary>補足: import文で何が読み込まれるのか</summary>

ここでは、importで読み込まれるReactの実体が何であるのか、確かめていきます。
より具体的には、TypeScriptを書くときに読み込まれるもの・コンパイル後のJavaScriptで
処理されるときに読み込まれるものを見ることで、明らかにしていきます。

## 先にざっくり結論

補足事項ではありますが、あちこち調べまわったため、さまざまな要素を見ることになります。
個々を探っていく中で迷子にならないよう、最初に全体図を見ておきましょう。
大まかな流れは以下の通りです。

* TypeScriptで書かれた`import React from 'react'`は型定義ファイルを参照
* 型定義ファイルから、`React.FC`のような型や、`React.createElement()`のシグニチャが参照できるようになる

* JavaScriptへコンパイルされた後は、モジュール読み込みがCommonJS形式へ変換される
* 実体を読み込むときは、`node_modules/react`を参照

そして、一点押さえておいて頂きたいのは、React本体がnpmモジュールであり、JavaScriptで書かれたものである、
ということです。

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

</details>


### コンポーネント

ReactでUIの単位となるコンポーネントは、主にJSXと呼ばれる記法で書かれます。
なぜJSXでブラウザにHTMLを表示できるのかなど、気になるところはいくつかありますが、中の動きは
一度全体を見た後で戻ってくることにします。

ここでは、コンポーネントを表現するための記法の大枠を押さえておきましょう。
現在主流となっている関数コンポーネントは、次のような構造を持っています。

```JavaScript
// ※ propsは次章以降で扱っていきます
const ComponentName = () => {
    return (
        <tag>Child</tag>
    );
};

// ロジックを書かず、コンポーネントを返却することのみ表現したい場合は、以下の記法も使う
const ComponentName = () => (
    <tag>Child</tag>
);
```

この他にもいくつか記法はありますが、この場で一気に紹介しても疲れてしまいますので、
必要になったタイミングで都度触れていくことにします。

現時点では、HTMLタグっぽいものをJavaScriptでも書けるんだな〜、ぐらいの理解で大丈夫です。


### renderメソッド

最後の要素として、`ReactDOM.render()`メソッドを見ていきます。

> 書式: `ReactDOM.render(element, container[, callback])`

[参考](https://reactjs.org/docs/react-dom.html#render)

elementは[React element](https://reactjs.org/docs/rendering-elements.html)と呼ばれるオブジェクトと
対応しています。普段書く分には、描画対象となるコンポーネントを指定する、と捉えても問題ないと思います。
containerには、Reactコンポーネントを描画するDOM要素を指定します。
callbackは省略可能で、普段もあまり使うことはないので、割愛します。

今回の例に当てはめると、「h1タグを表現するReactコンポーネントをIDがrootのDOM要素へ描画してね」
といった表現になるでしょうか。
このように書くことで、これまで意識することのなかったDOM操作をReactがよしなに肩代わりし、
コンポーネントがHTMLに描画された結果が得られるようになります。

![image](https://user-images.githubusercontent.com/43694794/128664753-0459f1a9-11c0-450d-9e91-4c71577881f3.png)

めでたく、Reactへあいさつすることができました。

### JSXの裏側

さて、コードが動くことも大事ですが、それ以上に、どのような仕組みで動いていたのか知ることが重要です。
ここでは、「なぜJSXがHTMLへ描画されるようになったのか」明らかにしていきます。

#### JSXと対応する表現

実は、[公式](https://reactjs.org/docs/react-without-jsx.html)にてJSXを書かずにReactを利用するための
記法が紹介されています。

JSXは内部で`React.createElement()`関数呼び出しに変換されることで、ブラウザでも解釈できるようになります。
これだけではイメージしづらいと思いますので、実際にHello Worldを書き換えた例を見てみましょう。

```JavaScript
// h1タグと対応する要素を生成
const RawApp: React.FC = () => React.createElement('h1', null, 'Hello, raw React!!');

// DOMへ描画
ReactDOM.render(
    // <App />は裏側でReact.createElement()へ変換されるので、Appではなく、<App />と記述
    React.createElement(RawApp, null, null),
    document.getElementById('root')
);
```

分かってしまえば、そうなんだ〜と思えてきます。 ただ、これはとてもありがたいことなのです。
つまり、なんだか複雑そうなJSXの記述も最終的には、オブジェクトを返却する関数呼び出しに変換されるので、変数に格納したり、
JavaScriptの式として扱ったりと、柔軟な表現が可能となるのです。

JSXは、ぱっと見ではとっつきづらいですが、裏側が見えてくると、仲良くなれる気がしてくるのではないかと思います。

---

## 生DOMを触ってみる

さて、Reactに入門できたのも大きな一歩ではありますが、よりReactの良さを
体感するために、同じ処理を生のDOM操作で書いてみましょう。

初めから便利なものを使っていくのも楽しいですが、Reactがどんな問題に挑んできたのか知り、
ありがたみを感じていくのも、楽しいものです。
DOM操作はJavaScriptの勉強にもなりますし、肩慣らしがてら頑張っていきましょう。

※ DOM自体の知識を復習しておきたい方には、[JavaScript TUTORIAL](https://www.javascripttutorial.net/javascript-dom/)がおすすめです。

---

### DOM操作API

DOM操作をするということは、DOM操作APIをJavaScriptから呼び出してHTML要素を
つくったり消したりする、ということです。
ですので、ここでは、Reactに頑張ってもらった「h1タグ要素をHTMLへ埋め込む処理」を、
DOM操作APIでどのように実現するのか理解することを目指します。

コードは10行に満たないシンプルなものなので、最初に確認しておきましょう。

```JavaScript
// h1タグ要素の作成
const h1Element = document.createElement('h1');
h1Element.textContent = 'Hello, Vanilla!!';

// root要素配下へh1を追加
const rootDom = document.getElementById('root');
rootDom?.appendChild(h1Element);

```

それぞれのAPIが何をしているか理解できれば、コードを理解したと言えそうです。
1つ1つ読み解いていきましょう。

#### [document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)

> 書式: `document.createElement(tagName[, options])`

引数に指定したHTMLタグ名と対応するElementオブジェクトを生成してくれます。
`ReactDOM.render()`も内部ではこの処理を呼び出すことでReact elementをElementオブジェクトへ
マッピングしているはずです。

#### [Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

> 書式: `someNode.textContent = string`

Nodeオブジェクトのテキスト要素を取得/設定します。
NodeオブジェクトはElementオブジェクトの親に相当するものなので、つくったElementオブジェクトから
参照することができます。

#### [document.getElementById](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)

> 書式: `document.getElementById(id)`

ID属性で対応するElementオブジェクトを取得します。
`ReactDOM.render()`の第二引数にも登場していました。


#### [Node.appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)

> 書式: `element.appendChild(aChild)`

Elementオブジェクトの子要素として、Nodeを追加します。
DOM操作APIで動的に生成されたオブジェクトをHTMLを表現するDOMツリーへ反映させるために利用されます。

---

APIの概要が理解できたところで、改めてコードの流れを整理してみましょう。

* `document.createElement()`で動的に挿入したい要素(今回はh1要素)を生成
* `Node.textContent`プロパティを操作することでElementオブジェクトのテキスト要素を設定
* `document.getElementById()`で新たに作成したElementオブジェクトの描画先Elementを取得
* `Node.appendChild()`で描画先Elementへ要素を追加

* 以上の処理にて、Reactと同様、h1タグ要素がHTML上で描画される

![image](https://user-images.githubusercontent.com/43694794/128856570-5e81626d-4633-4d32-8bcc-311d6096ccac.png)

Reactと同じように動的に生成されたh1タグが描画されました。
シンプルな処理ではありますが、生のDOMを操作してみることで、少しでもReactの裏側が掴めていたらうれしいです。


---

以降では、補足としてテストコードを書いたものを残しておきます。
テストにも興味がありましたら、覗いてみてください。

<details>
<summary>Optional: テストコードを書いてみる</summary>

せっかくReactの書き方を学ぶのなら、テストコードの書き方もセットで身につけておきたいところです。
ですので、ここからはおまけとして、React・生DOM操作それぞれでテストコードを書いてみます。

テストコードでReactとの生活をより楽しくしていきましょう。
また、テストフレームワークには、jestを採用しています。

### まずは生DOMから

シンプルに書けそうなものから始めていきましょう。
jestはnpmパッケージとして公開されており、Node.js上で動作するので、そのままではDOMを扱うことができません。
と言うとなんだか難しそうですが、ありがたいことに、jestの設定値として、testEnvironmentに`jsdom`を指定するだけで、
後はよしなにやってくれます。

[参考](https://jestjs.io/docs/configuration#testenvironment-string)

#### テストコード

テストそのものの詳しい解説はまた別の機会に譲ることにして、今回は実際のテストコードから
ざっくりとした書き方・考え方を書いていく形にしようと思います。

ということで、以下にテストコードを抜粋したものを載せておきます。


```JavaScript
import { render } from '../index';

describe('DOM操作の検証', () => {

    beforeEach(() => {

        // DOMツリーを擬似的に再現
        document.body.innerHTML = `
        <div id="root"></div>
        `;
    });

    test('h1タグがID=root要素の配下に描画されていること', () => {

        // GIVEN
        const rootElement = document.getElementById('root');
        // WHEN
        render();
        // nodeNameがHTMLのタグ名と対応
        const actual = rootElement?.childNodes[0].nodeName.toLowerCase();
        // THEN
        expect(actual).toBe('h1');
    });
});
```

各々の記述は単純なもので、各処理のざっくりとした考え方を書くことで、テストの組み方を
たどっていくことにしたいと思います。

#### beforeEach

前処理では、ID属性がrootの要素を直接DOMツリーへ設定しています。
これは、元々`index.html`からJavaScriptを呼び出していた挙動を再現するためのものです。

こうすることで、処理する側は、DOMがHTMLでつくられたものなのか、手動でつくられたものなのか
意識することなく動作することができます。

#### 関数切り出し

これはDOM操作に限った話ではないですが、テストコードを書くときには、検証したい処理を
関数などに閉じ込めて、テストランナー側から呼び出せるようにしておくと便利です。

状態も引数に切り出しておき、外部から注入できるようにしておくと、なおいい感じですね。

---

![image](https://user-images.githubusercontent.com/43694794/128861563-ab1b1eba-8c05-48b2-b504-72d7de3114da.png)

テストコードを動かしてみると、問題なく動作していたことが確認できました。
続いては、生DOM操作の考えを発展させて、Reactで書いたコードも検証してみましょう。


### いざReactへ

Reactのテストコードでは、[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)の力を借りることにします。
こちらは、Create React Appでも推奨されているツールですので、安心して導入することができます。

#### React Testing Libraryがもたらしてくれるもの

何か新しくツールを加えるときは、それがどんな問題を解決してくれるのか、知っておくことが重要です。

React Testing Libraryは、コンポーネントがDOMへ描画された状態をつくり出し、テストを容易にするための
APIを提供してくれます。
これは、`react-dom`や、`react-dom/test-utils`の処理をラップし、検証したい出力だけに集中できるような環境をもたらしてくれます。

[参考](https://testing-library.com/docs/react-testing-library/intro/#this-solution)

テストコードは書き方を誤ると思わぬハマり方をすることから、安定した書き方が提供されているものに乗っかる方が心が折れずに済むかと思います。

---

テストコードを書いていく前に、React Testing Libraryをjestへ導入する上では、いくつか設定が必要になります。
各々で何をしているのかざっくりと把握するために、最初にこれからやることを書き出しておきます。

* jestでReact Testing Library用のassertionを有効にするための設定を導入
* コンポーネントとレンダリングを分離(後述)
* テストコードの作成
* assertionの検証

それぞれを見ていきましょう。

#### jestの設定

React Testing Libraryには、レンダリング結果のDOMに対する便利なassertion用APIも存在します。
ただ、これはjestのexpectによるassertionを拡張したものであり、恩恵を受けるには少し設定が要ります。

[公式](https://github.com/testing-library/jest-dom/#usage)の手順に従い、jestの設定用ファイルを作成します。

```JavaScript
// src/tests/jest-setup.ts
// assertion用APIをテストケースで利用できるよう設定
import '@testing-library/jest-dom'
```

つくった設定ファイルは、jestの設定値である`setupFilesAfterEnv`プロパティで参照することで利用できます。
さほど難しい記述でもないので、実際の書き方は、package.jsonを覗いてみてください。

[参考](https://jestjs.io/docs/configuration#setupfilesafterenv-array)

#### コンポーネントとレンダリングの分離

React Testing Libraryを利用するとき、描画対象コンポーネントと、`ReactDOM.render()`が同一ファイルに存在すると、
`Target container is not a DOM element`というエラーメッセージが表示されてしまいます。
色々と調べたのですが、詳しい原因にたどり着くのは難しそうでしたので、何かご存知の方がいらっしゃいましたら、Issueなどで
教えて頂けるとうれしいです。

この場で、暫定措置として、参考リンクを載せるに留めておきます。

[参考](https://stackoverflow.com/questions/39986178/testing-react-target-container-is-not-a-dom-element)

Reactコンポーネント上では、`App.tsx`というファイルでコンポーネントとレンダリングを分離することで、
React Testing Libraryの検証にも対応できるようにしています。

#### テストコード

React Testing Libraryがコンポーネント描画やDOMの探索をシンプルなAPIに閉じ込めてくれたおかげで、
テストコードはすっきりした形にまとめることができます。
コードを確認してみましょう。

```JavaScript
// src/tests/index.test.tsx
import React from 'react';
import { App } from '../App';
// React Testing Library
import { render, screen } from '@testing-library/react';

describe('Hello Worldレンダリングの検証', () => {

    test('h1タグが描画されること', () => {

        // WHEN
        // renderメソッドでコンポーネントをDOMへ描画
        render(<App />);
        // DOMの描画結果を探索
        const actual = screen.getByText('Hello, React!!');
        // THEN
        // DOMを表示
        screen.debug();
        expect(actual).toBeInTheDocument();
    });
});
```

`render()`メソッドの書式を確認しておきましょう。

```TypeScript
function render(
  ui: React.ReactElement<any>,
  options?: {
    /* You won't often use this, expand below for docs on options */
  },
): RenderResult
```

[参考](https://testing-library.com/docs/react-testing-library/api#render)

`ReactDOM.render()`の第二引数を省略したものと捉えれば、しっくり来るかと思います。
描画結果は、`document.body`配下のdivタグへ配置してくれます。

`screen.getByText()`は、描画されたDOM要素からテキスト要素を探索してくれます。
あとの細かいところは、テスト結果を見た方が理解できるでしょう。

![image](https://user-images.githubusercontent.com/43694794/128957397-cac5b0df-e3d2-40e5-a7ca-13d811439880.png)

`screen.debug()`により、実際のDOMツリーを見ることができます。

---

さて、React Testing Libraryを導入することで、

* コンポーネントがDOMへ描画されたか
* DOMの描画結果はどのようなものか

見ることができるようになりました。
React Testing Libraryと組み合わせることで、Reactの動作・Reactのテストコードの書き方を
習得できるよう頑張っていきましょう。

</details>
