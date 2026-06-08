import { mockCustomers } from '../data/mockData'
import { getAllTransactions as buildTransactions, processAllCustomers } from '../utils/rewardsCalculator'

/**
 * Simulates an asynchronous API call to fetch customer rewards data
 * This mimics a real API call without using setTimeout
 * @returns {Promise} Resolves with processed customer rewards
 */
export const fetchCustomerRewards = () => {
  return Promise.resolve()
    .then(() => {
      const rewards = processAllCustomers(mockCustomers)

      return {
        data: rewards,
        customers: mockCustomers,
        success: true,
      }
    })
    .catch((err) => {
      // Fallback: return an empty dataset and a helpful message
      // This prevents the app from crashing on unexpected errors
      // and allows UI to render a friendly error state.
      // eslint-disable-next-line no-console
      console.error('fetchCustomerRewards failed:', err)
      return {
        data: {},
        customers: [],
        success: false,
        error: 'Failed to load rewards data. Showing empty results.',
      }
    })
}

/**
 * Get all transactions from all customers
 * @param {Array} customers - Array of customer objects
 * @returns {Array} Flattened array of all transactions with reward points
 */
export const getAllTransactions = (customers) => {
  try {
    return buildTransactions(customers)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getAllTransactions failed:', err)
    return []
  }
}
