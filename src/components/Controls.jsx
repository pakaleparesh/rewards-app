import PropTypes from 'prop-types'

export const Controls = ({ periods, selectedPeriod, onPeriodChange, searchTerm, onSearchChange }) => (
  <section className="controls-panel">
    <div className="controls-row">
      <label className="controls-label">
        View period
        <select
          className="controls-select"
          value={selectedPeriod}
          onChange={(event) => onPeriodChange(event.target.value)}
        >
          <option value="all">All periods</option>
          {periods.map((period) => (
            <option key={period.key} value={period.key}>
              {period.label}
            </option>
          ))}
        </select>
      </label>

      <label className="controls-label">
        Search customer
        <input
          className="controls-input"
          type="search"
          value={searchTerm}
          placeholder="Search by name"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
    </div>
  </section>
)

Controls.propTypes = {
  periods: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number,
      month: PropTypes.string,
      label: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,
  selectedPeriod: PropTypes.string.isRequired,
  onPeriodChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
}
