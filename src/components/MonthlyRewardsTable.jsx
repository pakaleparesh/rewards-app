import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { getMonthIndex, getMonthKey } from '../utils/rewardsCalculator'

export const MonthlyRewardsTable = ({ rewards, periods }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' })
  const selectedKeys = new Set(periods.map((period) => period.key))

  const rows = Object.values(rewards)
    .flatMap((customer) =>
      customer.monthly.map((monthly) => ({
        customerId: customer.id,
        customerName: customer.name,
        ...monthly,
        periodKey: getMonthKey(monthly.year, monthly.month),
      })),
    )
    .filter((entry) => selectedKeys.has(entry.periodKey))

  const sortedRows = useMemo(() => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1
    return [...rows].sort((first, second) => {
      switch (sortConfig.key) {
        case 'customerId':
          return first.customerId.localeCompare(second.customerId) * direction
        case 'customerName':
          return first.customerName.localeCompare(second.customerName) * direction
        case 'points':
          return (first.points - second.points) * direction
        case 'year':
          return (first.year - second.year) * direction
        default:
          if (first.year !== second.year) {
            return (first.year - second.year) * direction
          }
          return (getMonthIndex(first.month) - getMonthIndex(second.month)) * direction
      }
    })
  }, [rows, sortConfig])

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

  if (!sortedRows.length) {
    return <div className="table-empty">No monthly reward data matches the selected filter.</div>
  }

  const sortIndicator = (key) => (sortConfig.key === key ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : '')

  return (
    <section className="data-section">
      <h2>Customer Monthly Rewards</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleSort('customerId')}>
              Customer ID{sortIndicator('customerId')}
            </th>
            <th className="sortable" onClick={() => handleSort('customerName')}>
              Customer Name{sortIndicator('customerName')}
            </th>
            <th className="sortable" onClick={() => handleSort('date')}>
              Month{sortIndicator('date')}
            </th>
            <th className="sortable" onClick={() => handleSort('year')}>
              Year{sortIndicator('year')}
            </th>
            <th className="sortable" onClick={() => handleSort('points')}>
              Reward Points{sortIndicator('points')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={`${row.customerId}-${row.periodKey}`}>
              <td>{row.customerId}</td>
              <td>{row.customerName}</td>
              <td>{row.month}</td>
              <td>{row.year}</td>
              <td>{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

MonthlyRewardsTable.propTypes = {
  rewards: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      monthly: PropTypes.arrayOf(
        PropTypes.shape({
          year: PropTypes.number,
          month: PropTypes.string,
          points: PropTypes.number,
        }),
      ),
      total: PropTypes.number,
    }),
  ).isRequired,
  periods: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number,
      month: PropTypes.string,
      key: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
}
