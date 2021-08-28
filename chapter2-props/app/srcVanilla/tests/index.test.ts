import { getFortuneTellingMessage, render } from 'srcVanilla/index';
import {fortune, FortuneResult} from 'src/fortune';
import * as randomFunction from 'src/random';

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
