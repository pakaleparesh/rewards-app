/**
 * Unit tests for API service
 */
/* eslint-env jest */
import { fetchCustomerRewards, getAllTransactions } from './api';

describe('API Service', () => {
  describe('fetchCustomerRewards', () => {
    test('should return customer rewards data', async () => {
      const response = await fetchCustomerRewards();

      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.customers).toBeDefined();
      expect(typeof response.data).toBe('object');
      expect(Array.isArray(response.customers)).toBe(true);
    });

    test('should return data with customer information', async () => {
      const response = await fetchCustomerRewards();
      const { data } = response;

      expect(Object.keys(data).length).toBeGreaterThan(0);

      // Check structure of customer reward
      const firstCustomer = Object.values(data)[0];
      expect(firstCustomer.id).toBeDefined();
      expect(firstCustomer.name).toBeDefined();
      expect(firstCustomer.monthly).toBeDefined();
      expect(typeof firstCustomer.total).toBe('number');
    });

    test('should handle promises correctly', async () => {
      const promise = fetchCustomerRewards();
      expect(promise).toBeInstanceOf(Promise);

      const result = await promise;
      expect(result).toBeDefined();
    });
  });

  describe('getAllTransactions', () => {
    test('should flatten all customer transactions', () => {
      const customers = [
        {
          id: 'C1',
          name: 'Customer 1',
          transactions: [
            { id: 'T1', amount: 100 },
            { id: 'T2', amount: 50 },
          ],
        },
        {
          id: 'C2',
          name: 'Customer 2',
          transactions: [{ id: 'T3', amount: 200 }],
        },
      ];

      const result = getAllTransactions(customers);

      expect(result.length).toBe(3);
      expect(result[0].customerId).toBe('C1');
      expect(result[0].customerName).toBe('Customer 1');
      expect(result[2].customerId).toBe('C2');
    });

    test('should return empty array for no customers', () => {
      expect(getAllTransactions([])).toEqual([]);
    });

    test('should include customer information with each transaction', () => {
      const customers = [
        {
          id: 'C1',
          name: 'John Doe',
          transactions: [{ id: 'T1', amount: 100 }],
        },
      ];

      const result = getAllTransactions(customers);

      expect(result[0].customerId).toBe('C1');
      expect(result[0].customerName).toBe('John Doe');
      expect(result[0].id).toBe('T1');
      expect(result[0].amount).toBe(100);
    });
  });
});
