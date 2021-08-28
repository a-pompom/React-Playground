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
