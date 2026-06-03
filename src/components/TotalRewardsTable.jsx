import PropTypes from 'prop-types'

export const TotalRewardsTable = ({ rewards }) => {
  const rows = Object.values(rewards).sort((first, second) => second.total - first.total)

  if (!rows.length) {
    return <div className="table-empty">No reward summary is available.</div>
  }

  return (
    <section className="data-section">
      <div className="table-header-row">
        <h2>Total Rewards</h2>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Total Reward Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
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
