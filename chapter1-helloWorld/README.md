# 概要

本記事では、Reactの最初の一歩として、Hello Worldプログラムを書いていきます。

## ゴール

Reactが動く環境をつくり、Hello Worldがどんな仕組みで実現されているのか、 大まかに理解することを目指します。

## 用語整理

初めて触れるものは用語の意味を押さえておくと、ぐっと理解が深まります。 全体の雰囲気を掴むために・理解が曖昧になったときに戻ってこられるように、ここで最初にまとめておきます。

* React: UIを構築するためのJavaScriptライブラリ
* Component: UI(ボタン・フォーム・一覧など)をJavaScript上で表現したもの
* JSX(JavaScript XML): UIの見た目部分を表現するのに有用なJavaScriptの拡張記法
* React element: JSXがブラウザなどでも解釈できるようJavaScriptのオブジェクトへ変換された結果


## 何はともあれHello World

Hello WorldでReactの最初の一歩を踏み出します。 コード量は多くありませんが、いくつかReactのお作法をなぞる箇所があるので、後ほど補足していきます。
まずは全体像を掴むためにも、コードから見てみましょう。

```TypeScript
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

コードを眺めることで全体の大まかな形は見えてきましたが、流れを掴むのは難しそうです。 迷子にならないよう、最初に簡単に押さえておきましょう。 上のコードの流れを箇条書きで整理してみると以下のようになります。

* Reactを動かすためのモジュールをimport
* UI(画面)を表現するための要素としてコンポーネントを作成
* コンポーネントでは、React elementの元となるJSXを返却
* ReactDOMモジュールでコンポーネントをDOMへ描画
* 処理結果として、HTMLへコンポーネントと対応するDOM要素が反映される

Reactを動かす準備を進め、Reactに描画して欲しいものを組み立てる。 そして、最後にReactへ実際の描画処理を依頼、といった感じです。

---

以降では、処理を「import文・コンポーネント・render関数」の3つの固まりに分け、それぞれの記述をもう少し詳しく追っていきます。 Reactの書き方を深く理解するためにも、順に見ていきましょう。

### import文

JSXの変換結果からReact elementをつくるためのReactパッケージ・それをDOMへ描画するためのReactDOMパッケージをimportしています。

#### ReactとReactDOMの違い

import文には、ReactとReactDOMがそれぞれ含まれています。 ReactはJavaScriptのライブラリですし、よしなにDOMを操作してくれそうなので、Reactだけで十分なように思えます。
にも関わらずモジュールが分けられているのは、なぜなのでしょうか。
これは、Reactが掲げる`Learn Once, Write Anywhere`の 考えにもとづいているようです。 後ほど触れていきますが、Reactモジュールによって描画対象は、React elementへ変換されます。その後の描画先をDOMに限定せず、スマホアプリなどにも拡張できるよう、レンダリング用のモジュールが分かれていったようです。

よって、DOM操作でReactの力を借りたいときは、React・ReactDOMそれぞれをimportする必要があります。

### コンポーネント

ReactでUIの単位となるコンポーネントは、主にJSXと呼ばれる記法で書かれます。 なぜJSXでブラウザにHTMLを表示できるのかなど、気になるところはいくつかありますが、中の動きは一度全体を見た後で戻ってくることにします。
ここでは、コンポーネントを表現するための記法の大枠を押さえておきましょう。 現在主流となっている関数コンポーネントは、次のような構造を持っています。

```TypeScript
// ※ propsは次回以降で扱っていきます
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

この他にもいくつか記法はありますが、この場で一気に紹介しても疲れてしまいますので、 都度触れていくことにします。 現時点では、HTMLタグっぽいものをJavaScriptでも書けるんだな〜、ぐらいの理解で大丈夫です。

### renderメソッド

最後の要素として、`ReactDOM.render()`メソッドを見ていきます。

> 書式: `ReactDOM.render(element, container[, callback])`
[参考](https://reactjs.org/docs/react-dom.html#render)

elementは[React element](https://reactjs.org/docs/rendering-elements.html)と呼ばれるオブジェクトと対応しています。普段書く分には、描画対象となるコンポーネントを指定する、と捉えても問題ないと思います。containerには、Reactコンポーネントを描画するDOM要素を指定します。callbackは省略可能で普段もあまり使うことはないので、割愛します。
今回の例に当てはめると、「h1タグを表現するReactコンポーネントをIDがrootのDOM要素へ描画してね」といった表現になります。 このように書くことで、これまで意識することのなかったDOM操作をReactがよしなに肩代わりしてくれます。そして、コンポーネントがHTMLに描画された結果が得られるようになります。

![image](https://user-images.githubusercontent.com/43694794/128664753-0459f1a9-11c0-450d-9e91-4c71577881f3.png)

めでたく、Reactへあいさつすることができました。

---

### JSXの裏側

さて、コードが動くことも大事ですが、それ以上に、どのような仕組みで動いていたのか知ることが重要です。 ここでは、「なぜJSXがHTMLへ描画されるようになったのか」明らかにしていきます。

#### JSXと対応する表現

実は、[公式](https://reactjs.org/docs/react-without-jsx.html)にてJSXを書かずにReactを利用するための記法が紹介されています。
JSXは内部で`React.createElement()`関数呼び出しに変換されることで、ブラウザでも解釈できるようになります。 これだけではイメージしづらいと思いますので、実際にHello Worldを書き換えた例を見てみましょう。

```TypeScript
// h1タグと対応する要素を生成
const RawApp: React.FC = () => React.createElement('h1', null, 'Hello, raw React!!');

// DOMへ描画
ReactDOM.render(
    // <App />は裏側でReact.createElement()へ変換されるので、Appではなく、<App />と記述
    React.createElement(RawApp, null, null),
    document.getElementById('root')
);
```

分かってしまえば、そうなんだ〜と思えてきます。 ただ、これはとてもありがたいことなのです。 つまり、なんだか複雑そうなJSXの記述も最終的にはオブジェクトを返却する関数呼び出しに変換されるので、変数に格納したり、 JavaScriptの式として扱ったりと、柔軟な表現が可能となるのです。
JSXは、ぱっと見ではとっつきづらいですが、裏側が見えてくると仲良くなれる気がしてくるのではないかと思います。

---

## 生DOMを触ってみる

さて、Reactに入門できたのも大きな一歩ではありますが、よりReactの良さを体感するために、同じ処理を生のDOM操作で書いてみましょう。
初めから便利なものを使っていくのも楽しいですが、Reactがどんな問題に挑んできたのか知り、 ありがたみを感じていくのも、楽しいものです。 DOM操作はJavaScriptの勉強にもなりますし、肩慣らしがてら頑張っていきましょう。

※ DOM自体の知識を復習しておきたい方には、[JavaScript TUTORIAL](https://www.javascripttutorial.net/javascript-dom/)がおすすめです。

### DOM操作API

DOMを操作するということは、DOM操作APIをJavaScriptから呼び出してHTML要素をつくったり消したりする、ということです。
ですので、ここでは、Reactに頑張ってもらった「h1タグ要素をHTMLへ埋め込む処理」をDOM操作APIでどのように実現するのか理解することを目指します。
コードは10行に満たないシンプルなものなので、最初に確認しておきましょう。

```JavaScript
// h1タグ要素の作成
const h1Element = document.createElement('h1');
h1Element.textContent = 'Hello, Vanilla!!';

// root要素配下へh1を追加
const rootDom = document.getElementById('root');
rootDom?.appendChild(h1Element);
```

それぞれのAPIが何をしているか理解できれば、コードを理解したと言えそうです。 1つ1つ読み解いていきましょう。

#### [document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)

> 書式: `document.createElement(tagName[, options])`

引数に指定したHTMLタグ名と対応するElementオブジェクトを生成してくれます。`ReactDOM.render()`も内部ではこの処理を呼び出すことでReact elementをElementオブジェクトへマッピングしているはずです。

#### [Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

> 書式: `someNode.textContent = string`

Nodeオブジェクトのテキスト要素を取得/設定します。NodeオブジェクトはElementオブジェクトの親に相当するものなので、つくったElementオブジェクトから参照することができます。

#### [document.getElementById](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)

> 書式: `document.getElementById(id)`

ID属性で対応するElementオブジェクトを取得します。`ReactDOM.render()`の第二引数にも登場していました。

#### [Node.appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)

> 書式: `element.appendChild(aChild)`

Elementオブジェクトの子要素としてNodeを追加します。DOM操作APIで動的に生成されたオブジェクトをHTMLを表現するDOMツリーへ反映させることができます。

---

APIの概要が理解できたところで、改めてコードの流れを整理してみましょう。

* `document.createElement()`で動的に挿入したい要素(今回はh1要素)を生成
* `Node.textContent`プロパティを操作することでElementオブジェクトのテキスト要素を設定
* `document.getElementById()`で新たに作成したElementオブジェクトの描画先Elementを取得
* `Node.appendChild()`で描画先Elementへ要素を追加
* 以上の処理にて、Reactと同様、h1タグ要素がHTMLへ描画される

![image](https://user-images.githubusercontent.com/43694794/128856570-5e81626d-4633-4d32-8bcc-311d6096ccac.png)

Reactと同じように動的に生成されたh1タグが描画されました。 シンプルな処理ではありますが、生のDOMを操作してみることで、少しでもReactの裏側が掴めていたらうれしいです。


## まとめ

本章では、ReactのHello Worldの流れを追っていきました。少し遠回りな道のりに見えましたが、大事なところなので、しっかりと押さえていきましょう。