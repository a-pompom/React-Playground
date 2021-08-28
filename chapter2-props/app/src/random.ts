/**
 * 0始まりのランダムな数値を生成
 *
 * @param max 生成対象の最大値
 * @return ランダムに生成された数値
 */
export const generateRandomFloorNumber = (max: number): number => {
    return Math.floor(Math.random() * max);
}
