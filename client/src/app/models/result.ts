export interface Result {
    answered: number,
    total: number,
    right: number,
    reason: 'all' | 'timeout'
}