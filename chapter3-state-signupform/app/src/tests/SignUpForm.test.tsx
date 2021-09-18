import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SignUpForm } from 'src/SignUpForm';
import { message } from 'src/message';


describe('初期表示', () => {

    test('バリデーションフィールド-ユーザ名', () => {

        // WHEN
        render(<SignUpForm />);
        const validationFieldForUsername = screen.getByRole('status', {name: `Username: ${message.validation.username}`});

        // THEN
        expect(validationFieldForUsername.textContent).toBe(`${message.validation.username} □`);
    });
    test('バリデーションフィールド-パスワード', () => {

        // WHEN
        render(<SignUpForm />);
        const validationFieldForPassword = screen.getByRole('status', {name: `Password: ${message.validation.password}`});

        // THEN
        expect(validationFieldForPassword.textContent).toBe(`${message.validation.password} □`);
    });

    test('登録ボタン-非活性', () => {

        // WHEN
        const renderResult = render(<SignUpForm />);
        const button = screen.getByRole('button', {name: '登録ボタン'});

        // THEN
        expect(button).toBeDisabled();
    });
    test('ウェルカムメッセージ-非表示', () => {

        // WHEN
        const renderResult = render(<SignUpForm />);
        const welcomeMessage = screen.getByLabelText('ウェルカムメッセージ');

        // THEN
        expect(welcomeMessage).toHaveTextContent('');
    });
});

describe('ユーザ名', () => {

    test.each`
    username
    ${'a-pompom1234'}
    ${'johnDoe_9876'}
    ${'Yamada_Tarou0'}
    `('[$username] 有効なユーザ名', (params: {username: string}) => {

        // WHEN
        render(<SignUpForm />);

        // HTML要素
        const usernameField = screen.getByRole('textbox', {name: 'UserName'});
        const validationFieldForUsername = screen.getByRole('status', {name: `Username: ${message.validation.username}`});

        // ユーザ名入力
        userEvent.type(usernameField, params.username);

        // THEN
        // ユーザ名フィールド・バリデーションメッセージ
        expect(usernameField).toHaveValue(params.username);
        expect(validationFieldForUsername).toHaveTextContent(`${message.validation.username} ☑︎`);
    });

    test.each`
    username
    ${'invalid'}
    ${'不正さん'}
    ${'<!invalidSymbol>'}
    ${'toolongcharacterisusedforinputfield'}
    `('[$username] 無効なユーザ名', (params: {username: string}) => {
        // WHEN
        render(<SignUpForm />);

        // HTML要素
        const usernameField = screen.getByRole('textbox', {name: 'UserName'});
        const validationFieldForUsername = screen.getByRole('status', {name: `Username: ${message.validation.username}`});

        // ユーザ名入力
        userEvent.type(usernameField, params.username);

        // THEN
        // ユーザ名フィールド・バリデーションメッセージ
        expect(usernameField).toHaveValue(params.username);
        expect(validationFieldForUsername).toHaveTextContent(`${message.validation.username} □`);
    });
});

describe('パスワード', () => {

    test.each`
    password
    ${'strongPassword'}
    ${'sugoi_tsuyoi-pasuwado'}
    ${'0123456789'}
    `('[$password] 有効なパスワード', (params: {password: string}) => {

        // WHEN
        render(<SignUpForm />);

        // HTML要素
        const passwordField = screen.getByLabelText(/password/i, {selector: 'input'});
        const validationFieldForPassword = screen.getByRole('status', {name: `Password: ${message.validation.password}`});

        // パスワード入力
        userEvent.type(passwordField, params.password);

        // THEN
        // パスワードフィールド・バリデーションメッセージ
        expect(passwordField).toHaveValue(params.password);
        expect(validationFieldForPassword).toHaveTextContent(`${message.validation.password} ☑︎`);
    });

    test.each`
    password
    ${'invalid'}
    ${'不正さん'}
    ${'<!invalidSymbol>'}
    ${'toolongcharacterisusedforinputfield'}
    `('[$password] 無効なパスワード', (params: {password: string}) => {
        // WHEN
        render(<SignUpForm />);

        // HTML要素
        const passwordField = screen.getByLabelText(/password/i, {selector: 'input'});
        const validationFieldForPassword = screen.getByRole('status', {name: `Password: ${message.validation.password}`});

        // パスワード入力
        userEvent.type(passwordField, params.password);

        // THEN
        // パスワードフィールド・バリデーションメッセージ
        expect(passwordField).toHaveValue(params.password);
        expect(validationFieldForPassword).toHaveTextContent(`${message.validation.password} □`);
    });
});


describe('登録ボタン', () => {

    test('ボタン活性化', () => {

        // GIVEN
        const username = 'awesomeUsername';
        const password = 'veryStrongPassword';
        // WHEN
        render(<SignUpForm />);

        // HTML要素
        const usernameField = screen.getByRole('textbox', {name: 'UserName'});
        const passwordField = screen.getByLabelText(/password/i, {selector: 'input'});

        // 入力
        userEvent.type(usernameField, username);
        userEvent.type(passwordField, password);

        const button = screen.getByRole('button', {name: '登録ボタン'});
        // THEN
        expect(button).not.toBeDisabled();
    });

    test('ウェルカムメッセージ', () => {

        // GIVEN
        const username = 'awesomeUsername';
        const password = 'veryStrongPassword';
        // WHEN
        render(<SignUpForm />);

        // HTML要素
        const usernameField = screen.getByRole('textbox', {name: 'UserName'});
        const passwordField = screen.getByLabelText(/password/i, {selector: 'input'});

        // 入力
        userEvent.type(usernameField, username);
        userEvent.type(passwordField, password);

        const button = screen.getByRole('button', {name: '登録ボタン'});
        userEvent.click(button);
        const welcomeMessage = screen.getByLabelText('ウェルカムメッセージ');

        // THEN
        expect(welcomeMessage).toHaveTextContent(`ようこそ、${username}さん。`)
    });
});