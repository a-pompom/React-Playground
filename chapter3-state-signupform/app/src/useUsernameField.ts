import React, { useState } from 'react';
import { validateField } from 'src/fieldValidator';

// 型宣言
type UserName = {
    value: string,
    isValid: boolean,
}
type ChangeUsernameEvent = (event: React.ChangeEvent<HTMLInputElement>) => void;
type Hook = () => [UserName, ChangeUsernameEvent];

// ユーザ名フィールド型
export type UsernameField = {
    username: UserName,
    changeUsername: ChangeUsernameEvent
}


/**
 * ユーザ名フィールドを利用するためのフック
 *
 * @return ユーザ名の状態・イベントハンドラ
 */
export const useUsernameField: Hook = () => {

    const [username, setUsername] = useState<UserName>({value: '', isValid: false});

    /**
     * ユーザ名変更イベント バリデーション後、stateを入力値で更新
     *
     * @param event イベントオブジェクト
     */
    const changeUsernameEvent: ChangeUsernameEvent = (event) => {

        const inputValue = event.target.value;
        const {isValid, message} = validateField(inputValue);

        setUsername((prev) => ({value: inputValue, isValid}));
    };

    return [username, changeUsernameEvent];
};
