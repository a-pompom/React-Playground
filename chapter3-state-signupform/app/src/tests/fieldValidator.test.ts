import { Errors, DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from 'src/validator';
import { validateField } from 'src/fieldValidator';
import {ValidationResult} from '../types';


describe('フィールドバリデーション', () => {

    test.each`
    value | expected | testType
    ${'Pompomuser1234'} | ${{isValid: true, message: ''}} | ${'正常系'}
    ${''}               | ${{isValid: false, message: Errors.empty}} | ${'空値'}
    ${'山田太郎'}        | ${{isValid: false, message: Errors.invalidCharacterType}} | ${'文字種'}
    ${'short'}          | ${{isValid: false, message: Errors.underMinLengthTag(DEFAULT_MIN_LENGTH)}} | ${'最小長'}
    ${'toolongusernameforovermaxlengthconstraint'} | ${{isValid: false, message: Errors.overMaxLengthTag(DEFAULT_MAX_LENGTH)}} | ${'最大長'}
    `('[$testType] フィールド値', (params: {value: string, expected: ValidationResult, testType: string}) => {

        // WHEN
        const actual = validateField(params.value);
        // THEN
        expect(actual).toMatchObject(params.expected);
    });
});
