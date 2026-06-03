import PropTypes from 'prop-types'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export const TransactionsTable = ({ transactions }) => {
  if (!transactions.length) {
    return <div className="table-empty">No transactions match the selected filters.</div>
  }

  return (
    <section className="data-section">
      <h2>Transactions</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Customer Name</th>
            <th>Purchase Date</th>
            <th>Product</th>
            <th>Price</th>
            <th>Reward Points</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
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
                  : `${transaction.month} ${transaction.date}, ${transaction.year}`}
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
      month: PropTypes.string,
      year: PropTypes.number,
      date: PropTypes.number,
    }),
  ).isRequired,
}
