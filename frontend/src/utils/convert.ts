export function formatCurrency(value: number | undefined | null) {
    if (value === undefined || value === null) {
        return '0₫';
    }
    return value.toLocaleString('vi-VN') + '₫'
}
