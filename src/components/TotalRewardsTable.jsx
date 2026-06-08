import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

export const TotalRewardsTable = ({ rewards }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'desc' })
  const rows = Object.values(rewards)

  const sortedRows = useMemo(() => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1
    return [...rows].sort((first, second) => {
      if (sortConfig.key === 'customerName') {
        return first.name.localeCompare(second.name) * direction
      }
      return (first.total - second.total) * direction
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
    return <div className="table-empty">No reward summary is available.</div>
  }

  const sortIndicator = (key) => (sortConfig.key === key ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : '')

  return (
    <section className="data-section">
      <div className="table-header-row">
        <h2>Total Rewards</h2>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleSort('customerName')}>
              Customer Name{sortIndicator('customerName')}
            </th>
            <th className="sortable" onClick={() => handleSort('total')}>
              Total Reward Points{sortIndicator('total')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

TotalRewardsTable.propTypes = {
  rewards: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      monthly: PropTypes.array,
      total: PropTypes.number,
    }),
  ).isRequired,
}
