export function formatMoney(amount: number | string) {
    const formatter = new Intl.NumberFormat('vi-VN');
    return formatter.format(Number(amount));
}