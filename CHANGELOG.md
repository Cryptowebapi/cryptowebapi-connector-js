# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2025-07-01

### Added
- **🔑 New `recoverFromMnemonic` function** - Offline wallet recovery from BIP-39 mnemonic phrases
  - Supports Ethereum, Bitcoin, BNB Smart Chain, and Tron
  - Fully offline operation (no API calls required)
  - Returns comprehensive wallet data (address, publicKey, privateKey, path)
- **📊 New `getBlockchainMeta` endpoint** - Unified blockchain metadata
  - Combines fee data, gas limits, chain ID, nonce, and balance in single call
  - Replaces separate `getFeeData` and `getAccountNonce` endpoints
- **✨ Full ES Module support** - Native ES module compatibility
- **🏗️ Modular service architecture** - Factory pattern for blockchain services

### Changed
- **⚡ Performance improvements** - Dynamic imports for better tree-shaking
- **📝 Updated TypeScript definitions** - Better type safety and IntelliSense
- **🔧 Modernized build system** - ES modules as primary format

### Deprecated
- `generateAddressFromMnemonic` - Use `recoverFromMnemonic` instead (more comprehensive)
- `getFeeData` - Use `getBlockchainMeta` instead (unified endpoint)  
- `getAccountNonce` - Use `getBlockchainMeta` instead (unified endpoint)

### Removed
- Legacy CommonJS-only exports (ES modules now supported)

### Fixed
- ES module import/export compatibility issues
- TypeScript strict mode compliance
- Bundle size optimization

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
