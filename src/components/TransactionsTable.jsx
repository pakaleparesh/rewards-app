import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export const TransactionsTable = ({ transactions }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' })

  const sortedTransactions = useMemo(() => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1

    return [...transactions].sort((first, second) => {
      switch (sortConfig.key) {
        case 'transactionId':
          return first.id.localeCompare(second.id) * direction
        case 'customerName':
          return first.customerName.localeCompare(second.customerName) * direction
        case 'product':
          return first.product.localeCompare(second.product) * direction
        case 'amount':
          return (first.amount - second.amount) * direction
        case 'points':
          return (first.points - second.points) * direction
        default:
          return (first.dateObject?.valueOf() - second.dateObject?.valueOf()) * direction
      }
    })
  }, [transactions, sortConfig])

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { key, direction: 'asc' }
    })
  }

  if (!sortedTransactions.length) {
    return <div className="table-empty">No transactions match the selected filters.</div>
  }

  const sortIndicator = (key) => (sortConfig.key === key ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : '')

  return (
    <section className="data-section">
      <h2>Transactions</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleSort('transactionId')}>
              Transaction ID{sortIndicator('transactionId')}
            </th>
            <th className="sortable" onClick={() => handleSort('customerName')}>
              Customer Name{sortIndicator('customerName')}
            </th>
            <th className="sortable" onClick={() => handleSort('date')}>
              Purchase Date{sortIndicator('date')}
            </th>
            <th className="sortable" onClick={() => handleSort('product')}>
              Product{sortIndicator('product')}
            </th>
            <th className="sortable" onClick={() => handleSort('amount')}>
              Price{sortIndicator('amount')}
            </th>
            <th className="sortable" onClick={() => handleSort('points')}>
              Reward Points{sortIndicator('points')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.customerName}</td>
              <td>
                {transaction.dateObject
                  ? transaction.dateObject.toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    })
                  : transaction.date}
              </td>
              <td>{transaction.product}</td>
              <td>{currencyFormatter.format(transaction.amount)}</td>
              <td>{transaction.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

TransactionsTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      customerName: PropTypes.string,
      product: PropTypes.string,
      amount: PropTypes.number,
      points: PropTypes.number,
      dateObject: PropTypes.instanceOf(Date),
      date: PropTypes.string,
    }),
  ).isRequired,
}
