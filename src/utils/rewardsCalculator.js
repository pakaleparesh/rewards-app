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

const parseDate = (value) => {
  if (!value) return null
  if (value instanceof Date) {
    return isNaN(value) ? null : value
  }
  const d = new Date(value)
  return isNaN(d) ? null : d
}

export const getMonthIndex = (monthName) => MONTH_NAMES.findIndex((month) => month === monthName)

export const getMonthKey = (year, monthIndex) => {
  const monthNumber = typeof monthIndex === 'number' && monthIndex >= 1 && monthIndex <= 12 ? String(monthIndex).padStart(2, '0') : '00'
  return `${year}-${monthNumber}`
}

export const formatMonthYear = (dateObj) => `${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getFullYear()}`

export const calculateTransactionPoints = (amount) => {
  const normalizedAmount = Number(amount)

  if (!isFinite(normalizedAmount) || isNaN(normalizedAmount) || normalizedAmount <= 0) {
    return 0
  }

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
  return first.monthIndex - second.monthIndex
}

export const getUniquePeriods = (customers) => {
  const periodMap = new Map()

  customers.forEach((customer) => {
    customer.transactions.forEach((transaction) => {
      const dateObj = parseDate(transaction.date)
      if (!dateObj) return

      const year = dateObj.getFullYear()
      const monthIndex = dateObj.getMonth() + 1
      const key = getMonthKey(year, monthIndex)

      if (!periodMap.has(key)) {
        periodMap.set(key, {
          year,
          month: MONTH_NAMES[monthIndex - 1],
          monthIndex,
          label: formatMonthYear(dateObj),
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
      try {
        const amount = Number(transaction.amount)
        if (!isFinite(amount) || isNaN(amount) || amount <= 0) return sum

        const dateObj = parseDate(transaction.date)
        if (!dateObj) return sum

        const year = dateObj.getFullYear()
        const monthIndex = dateObj.getMonth() + 1
        const entryKey = getMonthKey(year, monthIndex)

        const points = calculateTransactionPoints(amount)

        const existingEntry = monthlyPoints.get(entryKey) || {
          year,
          month: MONTH_NAMES[monthIndex - 1],
          monthIndex,
          points: 0,
        }

        monthlyPoints.set(entryKey, {
          ...existingEntry,
          points: existingEntry.points + points,
        })

        return sum + points
      } catch (e) {
        return sum
      }
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
      customer.transactions
        .map((transaction) => {
          try {
            const dateObject = parseDate(transaction.date)
            const amount = Number(transaction.amount)
            const points = calculateTransactionPoints(amount)

            return {
              ...transaction,
              customerId: customer.id,
              customerName: customer.name,
              points,
              dateObject,
            }
          } catch (e) {
            return {
              ...transaction,
              customerId: customer.id,
              customerName: customer.name,
              points: 0,
              dateObject: null,
            }
          }
        })
        .filter(Boolean),
    )
    .sort((left, right) => {
      const l = left.dateObject ? left.dateObject.valueOf() : 0
      const r = right.dateObject ? right.dateObject.valueOf() : 0
      return l - r
    })
}
