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
			name: 'RLPError',
			max: 3
		},
		{
			name: 'InvalidBlock',
			max: 10
		},
		{
			name: 'InvalidHeader',
			max: 19
		},
		{
			name: 'InvalidTransaction',
			max: 25
		},
		{
			name: 'InvalidUncle',
			max: 28
		}
	]
}

module.exports = config;