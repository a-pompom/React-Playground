import { ValidateField } from 'src/types';
import {
    isNotEmpty,
    isOverMinLength,
    isUnderMaxLength,
    isValidCharacterType,
    makeResult,
    Errors,
    DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH
} from 'src/validator';

/**
 * 入力フィールド値をバリデーション
 *
 * @param value フィールド値
 * @return バリデーション結果オブジェクト
 */
export const validateField: ValidateField = (value) => {

    return (
        (! isNotEmpty(value) && makeResult(false, Errors.empty)) ||
        (! isValidCharacterType(value) && makeResult(false, Errors.invalidCharacterType)) ||
        (! isUnderMaxLength(value, DEFAULT_MAX_LENGTH) && makeResult(false, Errors.overMaxLengthTag(DEFAULT_MAX_LENGTH))) ||
        (! isOverMinLength(value, DEFAULT_MIN_LENGTH) && makeResult(false, Errors.underMinLengthTag(DEFAULT_MIN_LENGTH))) ||

        makeResult(true, '')
    );
};
