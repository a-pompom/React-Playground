import {
    isNotEmpty,
    isOverMinLength,
    isUnderMaxLength,
    isValidCharacterType,
    makeResult,
    Errors,
    DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH
} from 'src/validator';
import {ValidationResult} from '../types';

describe('基本バリデーションメソッド', () => {

    // 空値
    test.each`
    value          | expected
    ${''}          | ${false}
    ${' '}         | ${true}
    ${'not empty'} | ${true}
    `('[$value] 空値判定', (params: {value: string, expected: boolean}) => {

        // WHEN
        const actual = isNotEmpty(params.value);
        // THEN
        expect(actual).toBe(params.expected);
    });

    // 文字種
    test.each`
    value             | expected
    ${'validText'}    | ${true}
    ${'o-k_text'}     | ${true}
    ${'invalid text'} | ${false}
    ${'不正な文字列'}   | ${false}
    `('[$value] 文字種判定', (params: {value: string, expected: boolean}) => {

        // WHEN
        const actual = isValidCharacterType(params.value);
        // THEN
        expect(actual).toBe(params.expected);
    });

    // 最大長
    test.each`
    value                                  | maxLength             | expected
    ${'valid'}                             | ${5}                  | ${true}
    ${'ok'}                                | ${10}                 | ${true}
    ${'invalid text'}                      | ${5}                  | ${false}
    ${'under default max length'}          | ${DEFAULT_MAX_LENGTH} | ${true}
    ${'over default max length strings'}   | ${DEFAULT_MAX_LENGTH} | ${false}
    `('[$value] 最大長判定', (params: {value: string, maxLength: number, expected: boolean}) => {

        // WHEN
        const actual = isUnderMaxLength(params.value, params.maxLength);
        // THEN
        expect(actual).toBe(params.expected);

    });

    // 最小長
    test.each`
    value                         | minLength             | expected
    ${'valid'}                    | ${5}                  | ${true}
    ${'ok'}                       | ${1}                  | ${true}
    ${'invalid text'}             | ${100}                | ${false}
    ${'over default min length'}  | ${DEFAULT_MIN_LENGTH} | ${true}
    ${'too short'}                | ${DEFAULT_MIN_LENGTH} | ${false}
    `('[$value] 最小長判定', (params: {value: string, minLength: number, expected: boolean}) => {

        // WHEN
        const actual = isOverMinLength(params.value, params.minLength);
        // THEN
        expect(actual).toBe(params.expected);
    });
});


describe('エラーメッセージタグ', () => {

    test('最大長超過',  () => {

        // GIVEN
        const maxLength = 10;
        // WHEN
        const actual = Errors.overMaxLengthTag(maxLength);
        // THEN
        expect(actual).toBe('10文字以下で入力してください。')
    });

    test('最小長不足',  () => {

        // GIVEN
        const minLength = 15;
        // WHEN
        const actual = Errors.underMinLengthTag(minLength);
        // THEN
        expect(actual).toBe('15文字以上で入力してください。')
    });
});


describe('バリデーションオブジェクト', () => {

    test('バリデーション成功', () => {

        // GIVEN
        const expected: ValidationResult = {isValid: true, message: ''};
        // WHEN
        const actual = makeResult(true, '');
        // THEN
        expect(actual).toMatchObject(expected);
    });
    test('バリデーション失敗', () => {

        // GIVEN
        const expected: ValidationResult = {isValid: false, message: Errors.empty};
        // WHEN
        const actual = makeResult(false, Errors.empty);
        // THEN
        expect(actual).toMatchObject(expected);
    });
});
