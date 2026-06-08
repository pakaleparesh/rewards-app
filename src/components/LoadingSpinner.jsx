import React from 'react'

export const LoadingSpinner = () => (
  <div className="loading-wrapper" role="status" aria-live="polite">
    <div className="spinner" />
    <p>Loading rewards data...</p>
  </div>
)
