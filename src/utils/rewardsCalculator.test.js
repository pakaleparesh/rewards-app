/* eslint-env jest */
import {
  calculateTransactionPoints,
  getAllTransactions,
  getMonthKey,
  getUniquePeriods,
  processAllCustomers,
} from './rewardsCalculator'

const sampleCustomers = [
  {
    id: 'C1',
    name: 'Test User',
    transactions: [
      { id: 'T1', month: 'December', year: 2023, date: 10, amount: 120 },
      { id: 'T2', month: 'January', year: 2024, date: 5, amount: 75.5 },
    ],
  },
]

describe('rewardsCalculator', () => {
  test('calculateTransactionPoints returns 0 for under 50 dollars', () => {
    expect(calculateTransactionPoints(30)).toBe(0)
    expect(calculateTransactionPoints(50)).toBe(0)
  })

  test('calculateTransactionPoints handles decimal values correctly', () => {
    expect(calculateTransactionPoints(75.5)).toBe(25)
    expect(calculateTransactionPoints(100.2)).toBe(50)
    expect(calculateTransactionPoints(100.4)).toBe(50)
    expect(calculateTransactionPoints(120)).toBe(90)
  })

  test('getMonthKey returns a stable ISO-style key string', () => {
    expect(getMonthKey(2024, 'January')).toBe('2024-01')
    expect(getMonthKey(2023, 'December')).toBe('2023-12')
  })

  test('getUniquePeriods returns all unique periods in order', () => {
    const periods = getUniquePeriods(sampleCustomers)
    expect(periods).toHaveLength(2)
    expect(periods[0].key).toBe('2023-12')
    expect(periods[1].key).toBe('2024-01')
  })

  test('processAllCustomers aggregates monthly and total reward points', () => {
    const rewards = processAllCustomers(sampleCustomers)
    expect(rewards.C1).toBeDefined()
    expect(rewards.C1.total).toBe(115)
    expect(rewards.C1.monthly).toEqual([
      { year: 2023, month: 'December', points: 90 },
      { year: 2024, month: 'January', points: 25 },
    ])
  })

  test('getAllTransactions returns transaction points and sorts by date', () => {
    const transactions = getAllTransactions(sampleCustomers)
    expect(transactions).toHaveLength(2)
    expect(transactions[0].id).toBe('T1')
    expect(transactions[0].points).toBe(90)
    expect(transactions[1].points).toBe(25)
  })
})
