import { mockCustomers } from '../data/mockData'
import { getAllTransactions as buildTransactions, processAllCustomers } from '../utils/rewardsCalculator'

/**
 * Simulates an asynchronous API call to fetch customer rewards data
 * This mimics a real API call without using setTimeout
 * @returns {Promise} Resolves with processed customer rewards
 */
export const fetchCustomerRewards = () => {
  return Promise.resolve().then(() => {
    const rewards = processAllCustomers(mockCustomers)

    return {
      data: rewards,
      customers: mockCustomers,
      success: true,
    }
  })
}

/**
 * Get all transactions from all customers
 * @param {Array} customers - Array of customer objects
 * @returns {Array} Flattened array of all transactions with reward points
 */
export const getAllTransactions = (customers) => {
  return buildTransactions(customers)
}
