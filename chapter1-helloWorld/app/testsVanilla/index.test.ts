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
        const actual = rootElement?.childNodes[0].nodeName.toLowerCase();
        // THEN
        expect(actual).toBe('h1');
    });

    test('h1タグのテキストがHello, Vanilla!!であること', () => {

        // GIVEN
        const rootElement = document.getElementById('root');
        // WHEN
        render();
        const actual = rootElement?.childNodes[0].textContent;
        // THEN
        expect(actual).toBe('Hello, Vanilla!!');
    });
});
