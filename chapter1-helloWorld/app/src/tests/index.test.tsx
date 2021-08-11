import React from 'react';
import { App } from '../App';
import { render, screen } from '@testing-library/react';

describe('Hello Worldレンダリングの検証', () => {

    test('h1タグが描画されること', () => {

        // WHEN
        render(<App />);
        const actual = screen.getByText('Hello, React!!');
        // THEN
        screen.debug();
        expect(actual).toBeInTheDocument();
    });
});