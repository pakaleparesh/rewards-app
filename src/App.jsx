import { useState, useEffect, useMemo } from 'react'
import { fetchCustomerRewards, getAllTransactions } from './services/api'
import {
  getMonthIndex,
  getMonthKey,
  getUniquePeriods,
  processAllCustomers,
} from './utils/rewardsCalculator'
import { LoadingSpinner } from './components/LoadingSpinner'
import { MonthlyRewardsTable } from './components/MonthlyRewardsTable'
import { TotalRewardsTable } from './components/TotalRewardsTable'
import { TransactionsTable } from './components/TransactionsTable'
import { Controls } from './components/Controls'
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
        const { data, customers: customerData } = await fetchCustomerRewards()
        setRewards(data)
        setCustomers(customerData)
      } catch {
        setError('Failed to load rewards data. Please try again later.')
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
            dateObject: new Date(transaction.year, getMonthIndex(transaction.month), transaction.date),
          }))
          .filter((transaction) => {
            if (selectedPeriod !== 'all' && getMonthKey(transaction.year, transaction.month) !== selectedPeriod) {
              return false
            }

            if (startDate && transaction.dateObject < startDate) {
              return false
            }

            if (endDate && transaction.dateObject > endDate) {
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

