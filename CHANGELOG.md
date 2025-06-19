# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-06-19

### Added

- Initial release of CryptoWebAPI Connector JS
- TypeScript support with full type definitions
- Automatic retry logic for failed requests
- Comprehensive error handling with specific error types
- Rate limiting detection and handling
- Configurable client with flexible options
- Support for multiple cryptocurrency data endpoints
- Health check functionality
- Search functionality for cryptocurrencies
- Market data retrieval
- Individual and bulk price fetching
- Jest testing framework setup
- ESLint and Prettier configuration
- Comprehensive documentation
- Example usage files
- MIT License

### Features

- `CryptoWebApiClient` main client class
- `getPrices()` method for bulk price fetching
- `getPrice()` method for single cryptocurrency price
- `getMarketData()` method for market overview
- `getCurrencies()` method for cryptocurrency listings
- `getCurrency()` method for individual cryptocurrency details
- `searchCurrencies()` method for searching cryptocurrencies
- `healthCheck()` method for API status verification
- `updateConfig()` and `getConfig()` for configuration management
- Custom error types: `CryptoApiError`, `NetworkError`, `AuthenticationError`, `RateLimitError`, `ValidationError`, `NotFoundError`
- Automatic request/response interceptors
- TypeScript interfaces for all data types
- Comprehensive test coverage
