const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const getMonthIndex = (monthName) => MONTH_NAMES.findIndex((month) => month === monthName)

export const getMonthKey = (year, month) => {
  const monthIndex = getMonthIndex(month)
  const monthNumber = monthIndex >= 0 ? String(monthIndex + 1).padStart(2, '0') : '00'
  return `${year}-${monthNumber}`
}

export const formatMonthYear = (year, month) => `${month} ${year}`

export const calculateTransactionPoints = (amount) => {
  const normalizedAmount = Number(amount) || 0
  if (normalizedAmount <= 50) {
    return 0
  }

  const eligibleBetween50And100 = Math.max(Math.min(normalizedAmount, 100) - 50, 0)
  const eligibleOver100 = Math.max(normalizedAmount - 100, 0)
  return Math.floor(eligibleBetween50And100 + eligibleOver100 * 2)
}

export const sortPeriodEntries = (first, second) => {
  if (first.year !== second.year) {
    return first.year - second.year
  }

  return getMonthIndex(first.month) - getMonthIndex(second.month)
}

export const getUniquePeriods = (customers) => {
  const periodMap = new Map()

  customers.forEach((customer) => {
    customer.transactions.forEach((transaction) => {
      const key = getMonthKey(transaction.year, transaction.month)

      if (!periodMap.has(key)) {
        periodMap.set(key, {
          year: transaction.year,
          month: transaction.month,
          label: formatMonthYear(transaction.year, transaction.month),
          key,
        })
      }
    })
  })

  return Array.from(periodMap.values()).sort(sortPeriodEntries)
}

export const processAllCustomers = (customers) => {
  return customers.reduce((acc, customer) => {
    const monthlyPoints = new Map()
    const totalPoints = customer.transactions.reduce((sum, transaction) => {
      const points = calculateTransactionPoints(transaction.amount)
      const entryKey = getMonthKey(transaction.year, transaction.month)
      const existingEntry = monthlyPoints.get(entryKey) || {
        year: transaction.year,
        month: transaction.month,
        points: 0,
      }

      monthlyPoints.set(entryKey, {
        ...existingEntry,
        points: existingEntry.points + points,
      })

      return sum + points
    }, 0)

    acc[customer.id] = {
      id: customer.id,
      name: customer.name,
      monthly: Array.from(monthlyPoints.values()).sort(sortPeriodEntries),
      total: totalPoints,
    }

    return acc
  }, {})
}

export const getAllTransactions = (customers) => {
  return customers
    .flatMap((customer) =>
      customer.transactions.map((transaction) => ({
        ...transaction,
        customerId: customer.id,
        customerName: customer.name,
        points: calculateTransactionPoints(transaction.amount),
        dateObject: new Date(transaction.year, getMonthIndex(transaction.month), transaction.date),
      })),
    )
    .sort((left, right) => left.dateObject - right.dateObject)
}
