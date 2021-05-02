module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', 'eslint:recommended'],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'indent': ['error', 4],
        'comma-dangle': ['error', 'only-multiline'],
        'newline-after-var': ['error', 'never'],
        'no-param-reassign': ['off'],
        'prefer-destructuring': ['error', { object: false, array: false }],
        'function-paren-newline': ['error', 'multiline'],
        'function-call-argument-newline': ['error', 'never'],
        'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],
        //'operator-linebreak': ['error', 'before'],
        'quotes': ['error', 'single', { avoidEscape: true }],
        'quote-props': ['error', 'consistent'],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'radix': ['error', 'as-needed'],
        'class-methods-use-this': 0,
        'import/no-extraneous-dependencies': 0,
        'object-shorthand': ['error', 'consistent'], //-as-needed
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
            ],
            env: {
                jest: true,
            },
        },
    ],
};
