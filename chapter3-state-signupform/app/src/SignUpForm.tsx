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
            aria-label="Username"
            placeholder="username"
            value={username.value} />
        <label id="usernameValidationMessage">{message.validation.username} {username.isValid ? '☑︎' : '□'}</label>

        {/* パスワード */}
        <label htmlFor="password">Password</label>
        <input
            id="password"
            type="password"
            name="password"
            onChange={changePassword}
            aria-label="Password"
            placeholder="password"
            value={password.value} />
        <label id="passwordValidationMessage">{message.validation.password} {password.isValid ? '☑︎' : '□'}</label>

        <button
            type="button"
            aria-label="Register"
            disabled={! username.isValid || ! password.isValid}
            onClick={handleClick}
        >
            Register
        </button>
        <label>
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
