'use strict'

var _ = require('lodash');
var jsonrpc = require('node-express-json-rpc2');

var TAG_ERROR = [
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
];

var CATEGORIES = [
	['Generic', 3],
	['Block', 10],
	['Block header', 19],
	['Transaction', 25],
	['Uncle', 28],
];

var Validator = function(result, callback)
{
	if( !_.isObject(result) )
	{
		callback(jsonrpc.INVALID_PARAMS, null);
		return false;
	}

	if( _.isUndefined(result[0]) || !_.isObject(result[0]) )
	{
		callback(jsonrpc.INVALID_PARAMS, null);
		return false;
	}

	result = result[0];

	if( !_.has(result, "block") || _.get(result, "block", "").length !== 64 )
	{
		callback(jsonrpc.INVALID_PARAMS, null);
		return false;
	}

	if( !_.has(result, "errortype") )
	{
		callback(jsonrpc.INVALID_PARAMS, null);
		return false;
	}

	var errortype = _.get(result, "errortype", null);

	if( errortype === null )
	{
		callback(jsonrpc.INVALID_PARAMS, null);
		return false;
	}

	var category = TAG_ERROR.indexOf(errortype)

	result.category = CATEGORIES[_.findIndex(CATEGORIES, function(item){
		return item[1] >= category;
	})][0];

	console.log(result);

	callback(null, 'ok');
}

module.exports = Validator;