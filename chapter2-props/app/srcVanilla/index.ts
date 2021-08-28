import { tellFortune, Fortune } from 'src/fortune';


/**
 * 運勢表示用メッセージを取得
 *
 * @param fortune 運勢オブジェクト
 * @return 今日の運勢を表す文字列
 */
export const getFortuneTellingMessage = (fortune: Fortune) => {

    return `${fortune.today}の運勢は、${fortune.fortuneResult}です!!`
};

/**
 * DOM要素へ今日の運勢を描画
 */
export const render = (dateOfToday: Date) => {

    // 今日の運勢
    const h1 = document.createElement('h1');
    h1.textContent = getFortuneTellingMessage(tellFortune(dateOfToday));

    // 描画対象DOM
    const root = document.getElementById('root');
    root?.appendChild(h1);
};


render(new Date());
