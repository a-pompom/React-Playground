# 概要

本章は、React/DOM操作でつくったおみくじアプリのテストコードを書いていきます。
おみくじの運勢にはいくつか種類があり、ランダム要素も絡んでくるので、パラメータ化テスト・モックを
取り入れていきます。

## テスト方針

おみくじアプリでは、運勢を表示する部分・導き出す部分を分離することで、独立してテストできるようになりました。
これはつまり、運勢が期待通りに導出されているかは、DOMやReactコンポーネントに関与することなく、関数の戻り値を調べるだけで
確かめられるのです。

今日の運勢の関数・DOM操作・Reactでの表示といった順でテストコードを書いていきたいと思います。

## おみくじ関数

今日の運勢を弾き出す処理を調べることから始めます。
運勢は、日付と`大吉・小吉`のような文字列の組からなります。
日付にはフォーマット・運勢の文字列にはランダム処理が関わっているので、それぞれが動作しているのか
確認していきます。

まずはテストコードから雰囲気を掴んでいきましょう。

```TypeScript
// src/tests/fortune.test.ts

import * as randomFunction from 'src/random';
import { tellFortune, fortune, Fortune } from 'src/fortune';

describe('今日の運勢の検証', () => {

    test.each`
    dateParameter   | expected
    ${'2021-08-01'} | ${'2021年08月01日'}
    ${'2021-12-30'} | ${'2021年12月30日'}
    `('指定した日付をyyyy年MM月dd日フォーマットへ変換したオブジェクトが得られること', (params: {dateParameter: string, expected: string}) => {
        // WHEN
        const actual = tellFortune(new Date(params.dateParameter)).today;
        // THEN
        expect(actual).toBe(params.expected);
    });


    type FortuneParams = {
        date: string,
        index: number,
        fortune: string,
        expected: Fortune
    };
    test.each`
    date            | index | fortune       | expected
    ${'2021-01-01'} | ${0}  | ${fortune[0]} | ${{today: '2021年01月01日', fortuneResult: fortune[0]}}
    ${'2021-01-01'} | ${1}  | ${fortune[1]} | ${{today: '2021年01月01日', fortuneResult: fortune[1]}}
    ${'2021-01-01'} | ${2}  | ${fortune[2]} | ${{today: '2021年01月01日', fortuneResult: fortune[2]}}
    ${'2021-01-01'} | ${3}  | ${fortune[3]} | ${{today: '2021年01月01日', fortuneResult: fortune[3]}}
    `('運勢生成元と対応する$fortuneの運勢オブジェクトが得られること', (params: FortuneParams) => {

        // GIVEN
        // ランダム生成値のmock化
        jest.spyOn(randomFunction, 'generateRandomFloorNumber').mockReturnValue(params.index);
        // WHEN
        const actual = tellFortune(new Date(params.date));
        // THEN
        expect(actual).toMatchObject(params.expected);
    });
});
```

このテストコードを理解するには、「何を・どこまでテストしたいか」、「ランダム処理のモック化」について、
明らかにしなければなりません。
順に読み解いていきましょう。

### 期待通りの運勢オブジェクトが得られるか

テストケースは2つあり、いずれも関数から得られる運勢オブジェクトを検証しています。
`jest.each()`がやや複雑に見えますが、タグ付きテンプレートリテラルと組み合わせながら、
パラメータ化テストを書きやすくしてくれるものと思ってください。
jest自体の解説はまた別の機会に任せることにします。

[jest参考](https://jestjs.io/docs/api#2-testeachtablename-fn-timeout)
[タグ付きテンプレートリテラル参考](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

---

テスト対象はJavaScriptのオブジェクトなので、プロパティにアクセスしたり、
期待結果のオブジェクトをあらかじめつくっておくことで、処理の妥当性を検証することができます。
そして、運勢オブジェクトは、「日付が期待通りにフォーマットされるか・運勢が特定のリストから選択されるか」が
確認できれば、問題なく動作していると言えそうです。

日付は、外部から引数でDateオブジェクトを渡すことで、さまざまなパターンでのフォーマットを容易に
検証できています。

### ランダム性の検証

色々と難しそうなランダム要素を見ていきましょう。
実行する度に結果が変わるものを確かめるには、取り得る値の領域を妥当な範囲で
網羅すると良さそうです。

#### ランダム値の範囲

今回はシンプルな話なので、具体的な例で考えてみることにしましょう。
運勢は、`大吉・中吉・小吉・凶`のいずれかからランダムに選択されます。
話を簡単にするため、本章の例では、どの結果が選択されても同じメッセージのパターンが表示されるようになっています。
ですが、運勢に応じて、 「今日はいいことありそう!!」とか「明日があるさ...」など、メッセージが変わるような機能も考えられるでしょう。

#### 検証方針

まとめると、確かめたいのは、「各パターンで期待通りのメッセージが得られるか」ということです。
ランダム値の範囲も4つしかないので、パラメータ化テストで全範囲を網羅してしまえば、運勢ごとにメッセージを
変えるような機能追加にも難なく対応できることでしょう。
もしランダム値の範囲が増えても、網羅したい分岐を押さえられる程度を検証してしまえば、対処できるはずです。

---

ランダム値のテストは、それ単体でも十分に奥が深い話なので、踏み込むのはこのぐらいにしておきます。

`jest.spyOn()`は補足で簡単に触れる程度にしておきましょう。

#### 補足: なぜ`jest.mock()`ではなく、`jest.spyOn()`なのか

ランダム値を返す関数を、固定値を返す関数に差し替えたいときには、モック化が先に頭に浮かぶかと思います。
しかし、jestでは、あるモジュールの特定の関数をモック化したいときは、`jest.spyOn()`の方が
楽に書けることから、スパイを採用することにしました。

テストコードにおいて、スパイは実際の関数呼び出しがどのような形式だったか知るために使われることが多いようですが、
jestではモックの機能も備えているようです。
この辺りのjestの思想について、言及されている文書が見つけられなかったので、
詳しい方がいらっしゃいましたら、Issueなどで指摘頂けるとうれしいです。

[参考](https://jestjs.io/docs/jest-object#jestspyonobject-methodname)

---

## DOM操作の検証

運勢を導く関数はざっくりと検証できたので、DOM操作も見ていきましょう。
DOM操作という表現だけでは何を調べるのかイメージしづらいので、見たい処理をリストアップしてみます。

* 運勢オブジェクトからおみくじのメッセージが得られるか
* おみくじのメッセージがDOMへ描画されるか

ここで、Reactのpropsを掘り下げるため、おみくじのメッセージを組み立てる処理は、描画部分に組み込んでいました。
しかし、実際は、メッセージを描画とは独立して組み立てることができます。
ですので、メッセージの組み立ても更に関数に分離し、検証した方が扱いやすくなりそうです。

それぞれの動きを確かめていきたいと思います。

### おみくじのメッセージ

メッセージを組み立てる処理は、オブジェクトを入力に受け取り、文字列を出力として返却する
純粋な関数です。
外部への依存も無いので、指定した入力から期待した出力が得られるか確認するだけで安心が手に入ります。

検証の様子をテストコードで見てみましょう。

```TypeScript
// srcVanilla/tests/index.test.ts

import { getFortuneTellingMessage, render } from 'srcVanilla/index';
import {fortune, FortuneResult} from 'src/fortune';
import * as randomFunction from 'src/random';

// おみくじメッセージを検証するときのテストパラメータ型
type FortuneMessageParams = {
    today: string,
    fortune: FortuneResult,
    expected: string
};

describe('今日の運勢メッセージ取得処理の検証', () => {

    test.each`
    today              | fortune       | expected
    ${'2021年01月01日'} | ${fortune[0]} | ${'2021年01月01日の運勢は、大吉です!!'}
    ${'2021年01月30日'} | ${fortune[1]} | ${'2021年01月30日の運勢は、中吉です!!'}
    ${'2021年12月12日'} | ${fortune[2]} | ${'2021年12月12日の運勢は、小吉です!!'}
    ${'2021年06月30日'} | ${fortune[3]} | ${'2021年06月30日の運勢は、凶です!!'}
    `('おみくじの運勢を表すメッセージが$fortuneであること', (params: FortuneMessageParams) => {

        // WHEN
        const actual = getFortuneTellingMessage({today: params.today, fortuneResult: params.fortune});
        // THEN
        expect(actual).toBe(params.expected);
    });
});
```

入力・期待される出力をパラメータで定義しておき、関数の呼び出し結果へassertionを適用しています。
関数への切り出しは、実装の段階では少し手間ですが、テストコードを書くときに良さが見えてくるのではないかと思います。

### DOMへの描画

続いて、DOMへ期待した要素が描画されるか検証していきます。
早速テストコードを見てみましょう。

```TypeScript
// srcVanilla/tests/index.test.ts

// ※ describeブロックの中に記述されています

type FortuneParams = {
    today: string,
    index: number,
    fortune: FortuneResult,
    expected: string
};

describe('今日の運勢表示処理の検証', () => {

    beforeEach(() => {

        // DOMツリーを擬似的に再現
        document.body.innerHTML = `
        <div id="root"></div>
        `;
    });

    test.each`
    today              | index | fortune       | expected
    ${'2021-01-01'} | ${0}  | ${fortune[0]} | ${'2021年01月01日の運勢は、大吉です!!'}
    `('おみくじメッセージが画面に表示されること', (params: FortuneParams) => {

        // GIVEN
        // ランダム生成値のmock化
        jest.spyOn(randomFunction, 'generateRandomFloorNumber').mockReturnValue(params.index);
        // WHEN
        render(new Date(params.today));
        // THEN
        expect(document.getElementById('root')).toContainHTML(params.expected);
    });
});
```

DOMの検証をシンプルに書けるようにするため、React Testing Libraryと同系列の[DOM Testing Library](https://github.com/testing-library/dom-testing-library)を
導入しています。
それ以外はHello Worldと同様、`render()`でDOMへ期待した文字列が描画されるか検証しています。

DOMツリー全体を厳密に調べなくてよいのか・Hello Worldと似ているなら共通化を考えた方がよいのではないか、
など色々と考えが浮かんでくるところではあります。
しかし、これらの疑問は、DOM操作イベントを扱うときに改めて掘り下げた方が理解が深まると思いますので、
一旦置いておきます。

---

とりあえず、DOM操作のテストコードは問題なく動作したことを確認できました。

最後に、Reactコンポーネントの動きも確かめておきましょう。

## Reactの検証

Reactコンポーネントも、Hello Worldと変わりなく動きを確かめることができます。
復習のため、テストの流れを書き出しておきましょう。

* テストしたいコンポーネント・コンポーネントへ渡すパラメータを用意
* ReactTestingLibraryを利用し、コンポーネントをDOMツリーへレンダリング
* レンダリング結果を踏み込み過ぎない範囲で検証

やることはDOM操作のテストとほとんど変わらないので、テストコードを確認してみましょう。

```JSX
// src/tests/FortuneTelling.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';

import { FortuneTelling } from 'src/FortuneTelling';
import * as randomFunction from 'src/random';
import {fortune, FortuneResult} from 'src/fortune';

describe('おみくじレンダリングの検証', () => {

    type FortuneParams = {
        today: string,
        index: number,
        fortune: FortuneResult,
        expected: string
    };
    test.each`
    today              | index | fortune       | expected
    ${'2021年01月01日'} | ${0}  | ${fortune[0]} | ${'2021年01月01日の運勢は、大吉です!!'}
    ${'2021年01月30日'} | ${1}  | ${fortune[1]} | ${'2021年01月30日の運勢は、中吉です!!'}
    ${'2021年12月12日'} | ${2}  | ${fortune[2]} | ${'2021年12月12日の運勢は、小吉です!!'}
    ${'2021年06月30日'} | ${3}  | ${fortune[3]} | ${'2021年06月30日の運勢は、凶です!!'}
    `('おみくじの運勢が$fortuneと表示されること', (params: FortuneParams) => {

        // GIVEN
        // ランダム生成値のmock化
        jest.spyOn(randomFunction, 'generateRandomFloorNumber').mockReturnValue(params.index);
        // WHEN
        render(<FortuneTelling today={params.today} fortuneResult={params.fortune} />);
        const actual = screen.getByText(params.expected);
        // THEN
        screen.debug();
        expect(actual).toBeInTheDocument();
    });
});
```

流れが掴めていれば、propsとhello worldの知識で理解できるかと思います。

---

## まとめ

本章は、おみくじアプリと称して、propsを扱う処理を検証してきました。
まだDOM操作とReactに大きな違いは見られませんが、次章でイベントを扱うようになると差が見えてくるはずです。
