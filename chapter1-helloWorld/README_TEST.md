# 概要

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

## まとめ

さて、React Testing Libraryを導入することで、

* コンポーネントがDOMへ描画されたか
* DOMの描画結果はどのようなものか

見ることができるようになりました。
React Testing Libraryと組み合わせることで、Reactの動作・Reactのテストコードの書き方を
習得できるよう頑張っていきましょう。
