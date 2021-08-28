import React from 'react';

import { tellFortune } from 'src/fortune';
import { FortuneTelling } from 'src/FortuneTelling';

/**
 * おみくじを描画
 */
export const App:React.FC = () => {

    // 運勢
    const fortune = tellFortune(new Date());

    return (
        <div>
            <FortuneTelling today={fortune.today} fortuneResult={fortune.fortuneResult} />
        </div>
    );
    // return (
    //     <div>
    //         <FortuneTelling {...fortune} />
    //     </div>
    // );
};