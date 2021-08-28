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
