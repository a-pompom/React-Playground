// バリデーション関連型
export type ValidationResult = {
    isValid: boolean,
    message: string,
};

export type ValidateField = (value: string) => ValidationResult;