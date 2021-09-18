import React from 'react';

import { UsernameField, useUsernameField } from 'src/useUsernameField';
import { PasswordField, usePasswordField } from 'src/usePasswordField';
import { ButtonState, useButton } from 'src/useButton';
import { message } from 'src/message';

type Props = UsernameField & PasswordField & ButtonState;

/**
 * ユーザ登録フォーム描画部分
 *
 * @param username ユーザ名フィールド
 * @param changeUsername ユーザ名変更イベントハンドラ
 * @param password パスワードフィールド
 * @param changePassword パスワード変更イベントハンドラ
 *
 * @param button ボタン要素
 * @param handleClick ボタンクリックイベントハンドラ
 */
export const SignUpFormView: React.FC<Props> = (
    { username, changeUsername, password, changePassword, button, handleClick}
) => (

    <form>
        {/* ユーザ名 */}
        <label htmlFor="username">UserName</label>
        <input
            id="username"
            type="text"
            name="username"
            onChange={changeUsername}
            aria-describedby="usernameDescription"
            placeholder="username"
            value={username.value} />
        <span
            id="usernameDescription"
            role="status"
            aria-label={`Username: ${message.validation.password}`}
        >
            {message.validation.username} {username.isValid ? '☑︎' : '□'}
        </span>

        {/* パスワード */}
        <label htmlFor="password">Password</label>
        <input
            id="password"
            type="password"
            name="password"
            onChange={changePassword}
            aria-describedby="passwordDescription"
            placeholder="password"
            value={password.value} />
        <span
            id="passwordDescription"
            role="status"
            aria-label={`Password: ${message.validation.password}`}
        >
            {message.validation.password} {password.isValid ? '☑︎' : '□'}
        </span>

        {/* 登録ボタン */}
        <button
            type="button"
            aria-label="登録ボタン"
            disabled={! username.isValid || ! password.isValid}
            onClick={handleClick}
        >
            Register
        </button>

        <label
            aria-label="ウェルカムメッセージ"
            aria-disabled={! button.clicked}
        >
            {button.clicked ? `ようこそ、${username.value}さん。` : ''}
        </label>
    </form>
);


/**
 * ユーザ登録フォームのコンテナ
 */
export const SignUpForm: React.FC = () => {

    // フィールドオブジェクトをフックから取得
    const [username, changeUsername] = useUsernameField();
    const [password, changePassword] = usePasswordField();

    const [button, handleClick] = useButton();

    return (
        <SignUpFormView
            username={username}
            changeUsername={changeUsername}
            password={password}
            changePassword={changePassword}
            button={button}
            handleClick={handleClick}
        />
    );
};
