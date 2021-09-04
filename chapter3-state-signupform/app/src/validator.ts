import { ValidationResult } from './types';

const regExpForCharacterType = /^[\w\d-]+$/;
export const DEFAULT_MAX_LENGTH = 30;
export const DEFAULT_MIN_LENGTH = 10;

/**
 * 空値判定
 *
 * @param value 対象
 * @return 空値でない -> true, 空値-> false
 */
export const isNotEmpty = (value: string) => value.length !== 0;
/**
 * 文字種(半角英数と-_)判定
 *
 * @param value 対象
 * @return 該当の文字種のみ -> true, 該当の文字種以外を含む -> false
 */
export const isValidCharacterType = (value: string) => regExpForCharacterType.test(value);


/**
 * 最大長判定
 *
 * @param value 対象
 * @param maxLength 最大長
 *
 * @return 最大長文字以下 -> true 最大長文字超過 -> false
 */
export const isUnderMaxLength = (value: string, maxLength: number) => value.length <= maxLength;


/**
 * 最小長判定
 *
 * @param value 対象
 * @param minLength 最小長
 *
 * @return 最小文字以上 -> true 未満 -> false
 */
export const isOverMinLength = (value: string, minLength: number) => value.length >= minLength;


/**
 * 文字数超過メッセージ組み立てタグ
 *
 * @param strings テンプレート文字列
 * @param maxLength 最大長
 *
 * @return 文字数超過を表すエラーメッセージ
 */
const tagForOverMaxLength = (strings: TemplateStringsArray, maxLength: number): string => `${maxLength}${strings.join('')}`;


/**
 * 文字数不足メッセージ組み立てタグ
 *
 * @param strings テンプレート文字列
 * @param minLength 最小長
 */
const tagForUnderMinLength = (strings: TemplateStringsArray, minLength: number): string => `${minLength}${strings.join('')}`;


// エラーメッセージ
export const Errors = {
    empty: '入力してください。',
    invalidCharacterType: '半角英数と-_のみ使用できます。',
    overMaxLengthTag: (maxLength: number) => tagForOverMaxLength`${maxLength}文字以下で入力してください。`,
    underMinLengthTag: (minLength: number) => tagForUnderMinLength`${minLength}文字以上で入力してください。`,
};


/**
 * バリデーション結果オブジェクトを生成
 *
 * @param isValid 成否
 * @param message エラーメッセージ
 *
 * @return バリデーション成否・エラーメッセージを格納したオブジェクト
 */
export const makeResult = (isValid: boolean, message: string): ValidationResult => ({ isValid, message});
