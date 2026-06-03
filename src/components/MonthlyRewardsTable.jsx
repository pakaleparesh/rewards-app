import PropTypes from 'prop-types'
import { getMonthIndex, getMonthKey } from '../utils/rewardsCalculator'

export const MonthlyRewardsTable = ({ rewards, periods }) => {
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
    .sort((first, second) => {
      if (first.year !== second.year) {
        return first.year - second.year
      }

      return getMonthIndex(first.month) - getMonthIndex(second.month)
    })

  if (!rows.length) {
    return <div className="table-empty">No monthly reward data matches the selected filter.</div>
  }

  return (
    <section className="data-section">
      <h2>Customer Monthly Rewards</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Month</th>
            <th>Year</th>
            <th>Reward Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
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
