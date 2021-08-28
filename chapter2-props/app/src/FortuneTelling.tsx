import React from 'react';
import { Fortune } from 'src/fortune';

type Props = Fortune;

/**
 * 今日の運勢を表示
 *
 * @param props 日付・運勢を格納
 */
export const FortuneTelling: React.FC<Props> = (props) => (
    <div>
        <h1>{props.today}の運勢は、{props.fortuneResult}です!!</h1>
    </div>
);

// export const FortuneTelling: React.FC<Props> = ({ today, fortuneResult }) => (
//     <div>
//         <h1>{today}の運勢は、{fortuneResult}です!!</h1>
//     </div>
// );
