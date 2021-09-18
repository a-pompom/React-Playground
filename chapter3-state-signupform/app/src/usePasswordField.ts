import React, { useState } from 'react';
import { validateField } from 'src/fieldValidator';

// 型宣言
type Password = {
    value: string,
    isValid: boolean
};
type ChangePasswordEvent = (event: React.ChangeEvent<HTMLInputElement>) => void;
type Hook = () => [Password, ChangePasswordEvent];

export type PasswordField = {
    password: Password,
    changePassword: ChangePasswordEvent
};


/**
 * パスワードフィールドを利用するためのフック
 *
 * @return パスワードの状態・イベントハンドラ
 */
export const usePasswordField: Hook = () => {

    const [password, setPassword] = useState<Password>({value: '', isValid: false});

    /**
     * パスワード変更イベント バリデーション後、stateを入力値で更新
     *
     * @param event イベントオブジェクト
     */
    const changePasswordEvent: ChangePasswordEvent = (event) => {

        const inputValue = event.target.value;
        const {isValid, message} = validateField(inputValue);

        setPassword((prev) => ({value: inputValue, isValid}));
    };

    return [password, changePasswordEvent];
};
