import { useState, useEffect, useMemo } from 'react'
import { fetchCustomerRewards, getAllTransactions } from './services/api'
import { getUniquePeriods } from './utils/rewardsCalculator'
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
  const transactions = useMemo(() => getAllTransactions(customers), [customers])

  const periodOptions = useMemo(
    () => periods.map((period) => ({ label: period.label, value: period.key, key: period.key })),
    [periods],
  )

  const filteredRewards = useMemo(() => {
    if (!rewards || !searchTerm) return rewards
    const normalizedSearch = searchTerm.toLowerCase()
    return Object.entries(rewards).reduce((acc, [id, data]) => {
      if (data.name.toLowerCase().includes(normalizedSearch)) {
        acc[id] = data
      }
      return acc
    }, {})
  }, [rewards, searchTerm])

  const filteredTransactions = useMemo(() => {
    if (!transactions) return []
    const normalizedSearch = searchTerm.toLowerCase()
    return transactions.filter((transaction) => {
      const matchesPeriod = selectedPeriod === 'all' || `${transaction.year}-${transaction.month}` === selectedPeriod
      const matchesSearch = !searchTerm || transaction.customerName.toLowerCase().includes(normalizedSearch)
      return matchesPeriod && matchesSearch
    })
  }, [transactions, selectedPeriod, searchTerm])

  const selectedPeriods = useMemo(() => {
    if (selectedPeriod === 'all') {
      return periods
    }

    return periods.filter((period) => period.key === selectedPeriod)
  }, [periods, selectedPeriod])

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
            />

            <MonthlyRewardsTable rewards={filteredRewards || rewards} periods={selectedPeriods} />
            <TotalRewardsTable rewards={filteredRewards || rewards} />
            <TransactionsTable transactions={filteredTransactions} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Customer Rewards Program</p>
      </footer>
    </div>
  )
}

export default App

