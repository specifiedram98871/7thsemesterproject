# Use Cypress official image (includes Node + browsers + Cypress)
FROM cypress/included:12.17.3

# Set working directory
WORKDIR /e2e

# Copy package.json and package-lock.json (if you have test dependencies)
COPY package*.json ./

# Install dependencies (like chai, mocha, etc.)
RUN npm install

# Copy your Cypress tests
COPY . .

# Run Cypress tests by default
CMD ["cypress", "run"]
