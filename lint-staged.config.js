module.exports = {
    '*.{ts,tsx}': [
        () => 'pnpm lint:fix',
        () => 'pnpm ts:check'
    ]
};
