import { generateRandomFloorNumber } from 'src/random';

export const fortune = ['大吉', '中吉', '小吉', '凶'] as const;
export type FortuneResult = typeof fortune[number];
export type Fortune = {
    /**
     * yyyy年MM月dd日形式の日付
     */
    today: string,
    /**
     * おみくじ結果
     */
    fortuneResult: FortuneResult,
};


/**
 * 運勢を取得
 *
 * @param dateOfToday 今日の日付
 * @return 今日の日付・運勢からなるオブジェクト
 */
export const tellFortune = (dateOfToday: Date): Fortune => {

    // 今日の日付
    const monthOfToday = ('0' + (dateOfToday.getMonth() + 1)).slice(-2);
    const dayOfToday = ('0' + dateOfToday.getDate()).slice(-2);
    const today = `${dateOfToday.getFullYear()}年${monthOfToday}月${dayOfToday}日`;
    // 今日の運勢
    const fortuneResult = fortune[generateRandomFloorNumber(fortune.length)];

    return {
        today,
        fortuneResult,
    };
};