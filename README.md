# Check My Tickets Smart Contracts

## Setup

```bash
# Install dependencies
npm install
# Copy Env example file
cp .env.example .env
```

After installing dependencies and copying the example environment, you will have to update your `.env` file with
at least you alchemy API KEY (`NODE_URI_ETHEREUM`).
<br/>
You can generate your API KEY in the [Alchemy site](https://www.alchemy.com).

---

## Tools

This repository includes:

- The resell marketplace smart contract
- The ticket smart contract

---

## Commands

### **Coverage**

```bash
npm run coverage
```

Runs solidity code coverage
<br/>

### **Fork**

```bash
npm run fork
```

Runs a mainnet fork via hardhat's node forking util.

```bash
npm run fork:script {path}
```

Runs the script in mainnet's fork.

```
npm run fork:test
```

Runs tests that should be run in mainnet's fork.
<br/>

### **Lint**

```bash
npm run lint:check
```

Runs solhint.
<br/>

### **Prettier (lint fix)**

```bash
npm run lint:fix
```

Runs prettier
<br/>

### **Release**

```bash
npm run release
```

Runs standard changelog, changes package.json version and modifies CHANGELOG.md accordingly.
<br/>

### **Test**

```bash
npm run test:all
```

Runs all solidity tests.
<br/>

```bash
npm run test:unit
```

Runs all solidity tests in folder [unit](./test/unit)
<br/>

```bash
npm run test:e2e
```

Runs all solidity tests in folder [e2e](./test/e2e)
<br/>

### **Gas report**

```bash
npm run test:gas
```

Runs all tests and report gas usage.

### **Deploy**

```bash
npm run deploy:goerli
```

Deploy ticket contract in goerli.
<br/>

```bash
npm run deploy:rinkeby
```

Deploy ticket contract in rinkeby.
