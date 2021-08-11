import React from 'react';
import ReactDOM from 'react-dom';

// コンポーネント定義
export const App: React.FC = () => {
    return (
        <h1>
            Hello, React!!
        </h1>
    );
};

// DOMへ描画
ReactDOM.render(
   <App />,
   document.getElementById('root')
);

// const RawApp: React.FC = () => React.createElement('h1', null, 'Hello, raw React!!');
// ReactDOM.render(
//     React.createElement(RawApp, null, null),
//     document.getElementById('root')
// );
