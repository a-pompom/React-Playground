# 概要

本章では、コンポーネントで受け渡しされるpropsを使って、簡単なおみくじアプリをつくってみます。

## 本章のゴール

propsとは何か・どのように受け渡しするのか理解することを目指します。 あわせて、JSXで式を展開する記法も触っていきます。
理解のアウトプットとして、今日の運勢をpropsとしたおみくじアプリをつくります。

## 用語整理

本章で登場する用語について、最初に定義をざっくりと押さえておきましょう。

* props Propertiesの略 コンポーネントへ渡す値は、`React.createElement()`にてオブジェクト形式で渡されることから、このような名前となったと思われる
* コンポーネントタグ `<App />`のようなJSX上で書かれたコンポーネントを表すタグ propsはコンポーネントタグに記述することで渡すことができる

## つくりたいもの

おみくじアプリのイメージを固めておきましょう。
ユーザの入力を受け付けたりするのは次章へ譲ることにして、本章ではJavaScriptで計算した値を
コンポーネントを通じて表示する程度に留めておきます。

現在日付とランダムな運勢を表示するシンプルなものなので、動作イメージを見ていただければ、雰囲気が掴めるかと思います。

![image](https://user-images.githubusercontent.com/43694794/129008634-3de41df6-1b5f-4652-9789-aaa58ca87af1.png)


## Let's おみくじ

それでは早速、おみくじアプリをつくっていきましょう。
まずは、実装手順を整理します。
実現したいものをベースに、Reactの記法へどう当てはめるか考えながら、ざっくりと処理を分解していきます。
分解した手順を以下にまとめておきます。

* 現在日付/運勢を格納したオブジェクトを生成する関数を実装
* propsから運勢オブジェクトを受け取り、表示するコンポーネントを実装
* 運勢オブジェクトをpropsとして渡すコンポーネントを実装

それぞれの機能を順につくっていきたいと思います。

### おみくじ関数

今日の運勢を導き出す関数をつくります。コンポーネントの中にまとめて書くこともできますが、
描画部分と描画に必要なものを制御する部分は分けた方が見通しがよくなるので、別ファイルの関数に切り出しておきます。
これは、後々Reactが用意している仕組みを最大限活用するのに必要となるので、簡単な処理のうちから習慣づけておきましょう。

どこに書くかが決まれば、何を書くかはシンプルなものなので、いきなりコードを見てしまいます。

```TypeScript
// src/fortune.ts

// import対象モジュールは、下に載せます
import { generateRandomFloorNumber } from 'src/random';

// 運勢
export const fortune = ['大吉', '中吉', '小吉', '凶'] as const;
export type FortuneResult = typeof fortune[number];
export type Fortune = {
    /**
     * yyyy年MM月dd日形式の日付
     */
    today: string,
    /**
     * おみくじ結果
     */
    fortuneResult: FortuneResult,
};


/**
 * 運勢を取得
 *
 * @param dateOfToday 今日の日付
 * @return 今日の日付・運勢からなるオブジェクト
 */
export const tellFortune = (dateOfToday: Date): Fortune => {

    // 今日の日付
    const monthOfToday = ('0' + (dateOfToday.getMonth() + 1)).slice(-2);
    const dayOfToday = ('0' + dateOfToday.getDate()).slice(-2);
    const today = `${dateOfToday.getFullYear()}年${monthOfToday}月${dayOfToday}日`;
    // 今日の運勢
    const fortuneResult = fortune[generateRandomFloorNumber(fortune.length)];

    return {
        today,
        fortuneResult,
    };
};
```

```TypeScript
// src/random.ts
/**
 * 0始まりのランダムな数値を生成
 *
 * @param max 生成対象の最大値
 * @return ランダムに生成された数値
 */
export const generateRandomFloorNumber = (max: number): number => {
    return Math.floor(Math.random() * max);
}
```

今日の日付・今日の運勢をさっくり計算して、オブジェクト形式で返却しているだけのシンプルな処理です。
関数で返却されるオブジェクトがpropsとして、どのように受け渡されるのか見ていきましょう。

#### 補足: なぜランダム処理を別モジュールへ切り出したか

ランダムな値を扱うような処理は、そのままではテストコードで検証するのが困難です。
これを「ランダム値を返すことのみを責務に持つ関数」へ切り出すことで、
テスト用に固定値を返す関数へ差し替えるのが容易になります。

今回の場合は、ランダム値の範囲が小規模なので、パラメータ化テストで
固定値をもとに、すべての運勢の候補を検証できるようになります。

---

### propsの受け取り先

まずは、受け取り先を考えていきます。
実際に使う側で受け取り方を決めておいた方が、渡す側をつくるときに手戻りが少なくて済むので、
受け取り先から立ち向かいます。

コード量もさほど多くないので、まずはコードから全体の様子を見ておきます。

```JSX
// src/FortuneTelling.test.tsx

import React from 'react';
import { Fortune } from 'src/fortune';

type Props = Fortune;

/**
 * 今日の運勢を表示
 *
 * @param props 日付・運勢を格納
 */
export const FortuneTelling: React.FC<Props> = (props) => (
    <div>
        <h1>{props.today}の運勢は、{props.fortuneResult}です!!</h1>
    </div>
);
```

ここでは、新しく3つの要素が登場したので、1つずつたどっていきましょう。

#### 型の恩恵

`React.FC<Props>`のように、FC(FunctionComponent)型の総称型部分へ特定の型を指定すると、後述する引数のpropsの
型が決定されます。
これにより、`props.<プロパティ名>`と書くとき、補完や型チェックの恩恵が受けられるようになります。
この辺りは公式ドキュメントなども無さそうでしたので、興味がありましたら、GitHubリポジトリを覗いてみてください。

[参考](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)

※ 参考リンクでは、「type FC, interface FunctionComponent, type PropsWithChildren」でページ内検索してみると、
目的のものが見つかるはずです。

#### 引数props

値をマッピングするのは呼び出し元の仕事なので、受け取り先では、総称型に指定した型のオブジェクトがもらえるんだな〜、
ぐらいに思っておいて大丈夫です。
厳密には、propsにはchildrenというプロパティも追加されていますが、その辺りは実際に参照するようになってから補足します。

#### 式の埋め込み

propsにより、ランダムに変わる運勢が手に入るようになりました。となると、JSXでよしなに表現する記法が欲しくなります。
そんなときのために、JSXでは、`{}`で囲んだものを式として展開する機能を持っています。
時折複雑な記述をすることもありますが、そのときは都度補足していきます。

[参考](https://reactjs.org/docs/introducing-jsx.html#embedding-expressions-in-jsx)

---

### propsの受け渡し元

propsの受け取り方が見えてきたので、今度は対になる処理として、propsを渡す側を見てみましょう。
こちらも短い処理なので、コードを見ることから始めていきます。

※ テストコードの都合から、レンダリング処理とコンポーネント定義を分離するようにしています。

```JSX
// src/App.tsx

import React from 'react';

import { tellFortune } from 'src/fortune';
import { FortuneTelling } from 'src/FortuneTelling';

export const App:React.FC = () => {

    const fortune = tellFortune(new Date());

    return (
        <div>
            <FortuneTelling today={fortune.today} fortuneResult={fortune.fortuneResult} />
        </div>
    );
};
```

ここでは、コンポーネントタグへどのようにpropsオブジェクトを渡すか、理解することが重要です。
コンポーネントタグの属性に相当する箇所へ、`key={value}`形式で記述すると、
`props.key = value`のようにマッピングされます。

今回の例では、`today={fortune.today}`と書いておくことで、`fortune.today`がpropsオブジェクトのtodayプロパティへ追加される
ようになります。

[参考](https://reactjs.org/docs/jsx-in-depth.html#props-in-jsx)


---

### 別の書き方

ここまでなら、「propsを渡すときはコンポーネントタグの属性へkey-value形式で書き、値を`{}`で囲む。propsを受け取るときは総称型と引数を組み合わせる。」
というシンプルな形で理解できます。

ただ、propsの受け渡しには別の書き方があり、入門したての頃は、混乱しやすい難所となっています。
それぞれの記法をJSXレベルで考えていると迷いやすくなってしまうので、裏側の`React.createElement()`を思い浮かべながら、
立ち向かっていきましょう。

#### 分割代入-ばらして受け取る

propsは、あくまでJavaScriptのオブジェクトなので、受け取るときに分割代入で記述することもできます。
コード例で見た方が分かりやすいかと思います。

```JSX
// src/FortuneTelling.tsx

export const FortuneTelling: React.FC<Props> = ({ today, fortuneResult }) => (
    <div>
        <h1>{today}の運勢は、{fortuneResult}です!!</h1>
    </div>
);
```

分割代入により、`props.<プロパティ名>`と記述する手間が無くなり、見やすくなりました。
後述する呼び出し元の記法も組み合わせると、`{}`がさまざまな意味を持つようになり、迷子になりやすいところですが、
「受け取るときはシンプルなオブジェクトになる。」ということを意識しておけば迷わずにいられるのではないかと思います。

[参考](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

#### spread演算子-専用の省略記法

オブジェクトの中身をすべてpropsとして渡したいとき、毎回`key={value}`と書くのは面倒です。
そんなときのために、コンポーネントタグでは、`{...object}`と記述することで、propsへよしなにマッピングする
機能が備わっています。

便利な機能ではありますが、個人的に一番混乱しやすいところなので、じっくりと見ていきます。
まずは、実際の記法をコードで確認します。

```JSX
// src/App.tsx

// 下の記法と等価
return (
    <div>
        <FortuneTelling {...fortune} />
    </div>
);
// 比較用
return (
    <div>
        <FortuneTelling today={fortune.today} fortuneResult={fortune.fortuneResult} />
    </div>
);
```

コードを眺めていると、`key=value`がspread演算子ですっきり書けるんだな〜、と思えてきます。
しかし、裏側の動きを考えてみると、それぞれの処理を繋げるのが難しく感じてしまいます。

これは、JSXだけで考えていると、「何か素敵なロジックで`{...fortune}`がpropsオブジェクトへマッピングされたのかな」
以上のことを追うのが困難になってしまうことによります。
もっとシンプルに考えたいときは、`React.createElement()`呼び出しに立ち返るのがおすすめです。

とはいえ、spread演算子があって、第二引数にオブジェクトを書いて、受け取るときのpropsが...とか考えていると、
頭がパンクしてしまうので、[大いなる力](https://babeljs.io/repl/)を借りることにしましょう。

ありがたいことに、BabelというJavaScriptのトランスパイラが、ブラウザ上でJSXの変換を実験できるツールを用意してくれています。
こちらに頼りながら、オブジェクトの様子を覗いてみましょう。
具体的には、おみくじのJSXの変換前後を比べることで仕組みを読み解いていきます。

```JSX
// 変換前

const FortuneTelling = (props) => {
  return <div>{props.today} of fortune is {props.fortuneResult}</div>
};

const fortune = {
    today: '2021-08-31',
    fortuneResult: 'good',
};

function App() {
  
  return <FortuneTelling today={fortune.today} fortuneResult={fortune.fortuneResult} />;
}

function AppSpread() {
  
  return <FortuneTelling {...fortune} />;
}

// spread演算子と通常のマッピングの組み合わせ オブジェクトが合成されるだけですが、
// 変換結果が中々複雑になるので、興味のある方は試してみてください
//function AppSpreadAndOthers() {
//  return <App {...fortune} value={'another value'} />
//}
```

変換結果を順にみていきます。

#### 受け取り先

```JavaScript
// 第3引数以降がHTMLに印字される文字列となる
const FortuneTelling = props => {
  return /*#__PURE__*/React.createElement("div", null, props.today, " of fortune is ", props.fortuneResult);
};
```

第3引数以降は、可変長引数となっており、childrenと呼ばれます。
詳細は次章以降で触れていきますが、ここでは、childrenを合体させてHTMLに表示する文字列をつくっているんだな〜、
と理解できれば十分です。

#### いつもの渡し方

```JavaScript
// 通常のマッピング key-value形式の記述から新たなオブジェクトを作成
function App() {
  return /*#__PURE__*/React.createElement(FortuneTelling, {
    today: fortune.today,
    fortuneResult: fortune.fortuneResult
  });
}
```

key-value形式でマッピングする場合、元のオブジェクトのすべてのプロパティがマッピングされるとは限りません。
ですので、key-value形式の記述をもとに、propsとして渡すオブジェクトを新たに作成しています。
こう考えていくと、spread演算子の動きも見えてきそうです。

#### spread演算子

```JavaScript
// spread演算子を利用したマッピング オブジェクトをそのままpropsとして利用
function AppSpread() {
  return /*#__PURE__*/React.createElement(FortuneTelling, fortune);
}
```

spread演算子でオブジェクトを指定すると、すべてのプロパティがpropsへマッピングされることから、
元のオブジェクトがそのままpropsとして渡されます。

これはつまり、JSXでのspread演算子がJavaScriptの文法として特別な処理をしていたのではなく、
JSXを解釈する処理がよしなに受け渡しを手助けしていたということです。
先ほどのBabelのツールで`{...fortune}`ではなく、`{fortune}`と書くと、Babel側のSyntaxErrorとなることからも、
JSX側の解釈のための記法であることが分かります。

---

少し長くなりましたが、`React.createElement()`に立ち返り、JavaScriptのオブジェクトの世界で考えてみると、
シンプルにまとまったのではないかと思います。

ちなみに、spread演算子の記法は、予期しないプロパティまでコンポーネントに渡される可能性があることから、
公式では程々に使うべきである旨が書かれていたりします。
[参考](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes)

ただ、他の方が書いたコードや、将来の自分のコードでspread演算子が使われていたとき、JavaScriptのオブジェクトの世界の視点を持っているのと
いないのとでは、理解度が大きく変わってきます。
処理の流れをより深く理解するためにも、ぜひ習得してみてください。


---

## 生DOMの世界

Hello Worldのときと同じように、DOM操作でもおみくじをつくってみます。

### おみくじコード

やるべきことは、おみくじのメッセージをHello Worldのときと同じように描画するだけです。
Hello Worldとの違いを意識しながら、コードを確認してみましょう。

```TypeScript
// srcVanilla/index.ts

import { tellFortune, Fortune } from 'src/fortune';


/**
 * 運勢表示用メッセージを取得
 *
 * @param fortune 運勢オブジェクト
 * @return 今日の運勢を表す文字列
 */
export const getFortuneTellingMessage = (fortune: Fortune) => {

    return `${fortune.today}の運勢は、${fortune.fortuneResult}です!!`
};

/**
 * DOM要素へ今日の運勢を描画
 */
export const render = (dateOfToday: Date) => {

    // 今日の運勢
    const h1 = document.createElement('h1');
    h1.textContent = getFortuneTellingMessage(tellFortune(dateOfToday));

    // 描画対象DOM
    const root = document.getElementById('root');
    root?.appendChild(h1);
};


render(new Date());
```

propsの受け渡しが無い分、シンプルになりました。
ただ、次章以降、ユーザの入力に応じて描画を変化させるようにしていくと、Reactの便利さが見えてくるのではないかと思います。


## まとめ

本章では、おみくじアプリをつくってきました。
propsはコンポーネントの描画に大きく関わる重要なところなので、しっかりと記法を押さえておきましょう。

次章は少し実践を意識して、ユーザの入力を新たに加えた例を見ていきたいと思います。