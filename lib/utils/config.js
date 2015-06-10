'use strict'

var config = {
	db_uri: 'mongodb://' + (process.env.MONGO_HOST || 'localhost') + ':' + (process.env.MONGO_PORT || 27017) + '/' + (process.env.MONGO_DB || 'badblocks'),
	db_options: {
		server: {
			socketOptions: { keepAlive: 1 }
		},
		user: (process.env.MONGO_USER || null),
		pass: (process.env.MONGO_PASS || null)
	},
	errors: [
		// Generic
		'BadRLP',
		'BadCast',
		'OversizeRLP',
		'UndersizeRLP',
		// Block
		'InvalidBlockFormat',
		'TooManyUncles',
		'InvalidTransactionsRoot',
		'InvalidUnclesHash',
		'InvalidGasUsed',
		'InvalidStateRoot',
		'InvalidReceiptsRoot',
		// Block header
		'InvalidBlockHeaderItemCount',
		'TooMuchGasUsed',
		'ExtraDataTooBig',
		'InvalidDifficulty',
		'InvalidGasLimit',
		'InvalidBlockNonce',
		'InvalidNumber',
		'InvalidTimestamp',
		'InvalidLogBloom',
		// Transaction
		'OutOfGasIntrinsic',
		'BlockGasLimitReached',
		'InvalidSignature',
		'OutOfGasBase',
		'NotEnoughCash',
		'InvalidNonce',
		// Uncle
		'UncleInChain',
		'UncleTooOld',
		'UncleIsBrother'
	],
	categories: [
		{
			name: 'Generic',
			max: 3
		},
		{
			name: 'Block',
			max: 10
		},
		{
			name: 'Block header',
			max: 19
		},
		{
			name: 'Transaction',
			max: 25
		},
		{
			name: 'Uncle',
			max: 28
		}
	]
}

module.exports = config;