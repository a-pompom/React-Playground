import React, { useState } from 'react';

// 型宣言
type Button = {
    clicked: boolean
};
type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type Hook = () => [Button, ClickHandler];

export type ButtonState = {
    button: Button,
    handleClick: ClickHandler
};


/**
 * ボタンの状態(クリック済み)・クリックハンドラを提供するフック
 */
export const useButton: Hook = () => {

    const [button, setButton] = useState<Button>({clicked: false});

    /**
     * クリックハンドラ クリック状態を有効化
     *
     * @param event クリックイベント
     */
    const handleClick: ClickHandler = (event) => {
        if (button.clicked) {
            return;
        }

        setButton((prev) => ({clicked: true}));
    };

    return [button, handleClick];
};
