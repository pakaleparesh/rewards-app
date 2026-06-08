import { useState, useEffect, useMemo } from 'react'
import { fetchCustomerRewards, getAllTransactions } from './services/api'
import { getMonthIndex, getMonthKey, getUniquePeriods, processAllCustomers } from './utils/rewardsCalculator'
import { LoadingSpinner } from './components/LoadingSpinner.jsx'
import { MonthlyRewardsTable } from './components/MonthlyRewardsTable.jsx'
import { TotalRewardsTable } from './components/TotalRewardsTable.jsx'
import { TransactionsTable } from './components/TransactionsTable.jsx'
import { Controls } from './components/Controls.jsx'
import './App.css'

function App() {
  const [rewards, setRewards] = useState(null)
  const [customers, setCustomers] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadInitialRewards = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetchCustomerRewards()
        if (!response || response.success === false) {
          setRewards({})
          setCustomers(response?.customers || [])
          setError(response?.error || 'Failed to load rewards data. Please try again later.')
          return
        }

        setRewards(response.data)
        setCustomers(response.customers)
      } catch (e) {
        setError(e?.message || 'Failed to load rewards data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    void loadInitialRewards()
  }, [])

  const periods = useMemo(() => getUniquePeriods(customers), [customers])

  const periodOptions = useMemo(
    () => periods.map((period) => ({ label: period.label, value: period.key, key: period.key })),
    [periods],
  )

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredCustomers = useMemo(() => {
    const startDate = rangeStart ? new Date(rangeStart) : null
    const endDate = rangeEnd ? new Date(rangeEnd) : null

    return customers
      .map((customer) => {
        const customerSearchMatch = normalizedSearch && customer.name.toLowerCase().includes(normalizedSearch)

        const filteredTransactions = customer.transactions
          .map((transaction) => ({
            ...transaction,
            dateObject: transaction.date ? new Date(transaction.date) : null,
          }))
          .filter((transaction) => {
            const periodKey = transaction.dateObject
              ? getMonthKey(transaction.dateObject.getFullYear(), transaction.dateObject.getMonth() + 1)
              : null

            if (selectedPeriod !== 'all' && periodKey !== selectedPeriod) {
              return false
            }

            if (startDate && transaction.dateObject && transaction.dateObject < startDate) {
              return false
            }

            if (endDate && transaction.dateObject && transaction.dateObject > endDate) {
              return false
            }

            if (!normalizedSearch) {
              return true
            }

            return (
              customerSearchMatch ||
              transaction.id.toLowerCase().includes(normalizedSearch) ||
              transaction.product.toLowerCase().includes(normalizedSearch)
            )
          })

        return { ...customer, transactions: filteredTransactions }
      })
      .filter((customer) => customer.transactions.length > 0)
  }, [customers, selectedPeriod, normalizedSearch, rangeStart, rangeEnd])

  const filteredRewards = useMemo(() => processAllCustomers(filteredCustomers), [filteredCustomers])
  const filteredPeriods = useMemo(() => getUniquePeriods(filteredCustomers), [filteredCustomers])
  const filteredTransactions = useMemo(() => getAllTransactions(filteredCustomers), [filteredCustomers])

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Customer Rewards Program</h1>
          <p>Track and manage customer loyalty rewards over time.</p>
        </div>
      </header>

      <main className="app-main">
        {loading && <LoadingSpinner />}

        {error && <div className="error-message">{error}</div>}

        {!loading && rewards && (
          <>
            <Controls
              periods={periodOptions}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onRangeStartChange={setRangeStart}
              onRangeEndChange={setRangeEnd}
            />

            <MonthlyRewardsTable rewards={filteredRewards} periods={filteredPeriods} />
            <TotalRewardsTable rewards={filteredRewards} />
            <TransactionsTable transactions={filteredTransactions} />
          </>
        )}
      </main>

    </div>
  )
}

export default App
