export const render = () => {

    // h1タグ要素の作成
        const h1Element = document.createElement('h1');
        h1Element.textContent = 'Hello, Vanilla!!';

    // root要素配下へh1を追加
        const rootDom = document.getElementById('root');
        rootDom?.appendChild(h1Element);
};

render();

