import PropTypes from 'prop-types'

export const Controls = ({
  periods,
  selectedPeriod,
  onPeriodChange,
  searchTerm,
  onSearchChange,
  rangeStart,
  rangeEnd,
  onRangeStartChange,
  onRangeEndChange,
}) => (
  <section className="controls-panel">
    <div className="controls-row">
      <label className="controls-label">
        Search customers
        <input
          className="controls-input"
          type="search"
          value={searchTerm}
          placeholder="Search by name, ID, or product"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className="controls-label">
        Date range start
        <input
          className="controls-input"
          type="date"
          value={rangeStart}
          onChange={(event) => onRangeStartChange(event.target.value)}
        />
      </label>

      <label className="controls-label">
        Date range end
        <input
          className="controls-input"
          type="date"
          value={rangeEnd}
          onChange={(event) => onRangeEndChange(event.target.value)}
        />
      </label>

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
  rangeStart: PropTypes.string.isRequired,
  rangeEnd: PropTypes.string.isRequired,
  onRangeStartChange: PropTypes.func.isRequired,
  onRangeEndChange: PropTypes.func.isRequired,
}
