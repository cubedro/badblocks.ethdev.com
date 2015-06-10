'use strict'

var _ = require('lodash');
var jsonrpc = require('node-express-json-rpc2');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var options = {
	server: {
		poolsize: 5,
		socketOptions: { keepAlive: 1 }
	},
	user: (process.env.MONGO_USER || 'nouser'),
	pass: (process.env.MONGO_PASS || 'nopass')
}

var mongoConnected = false;

mongoose.connect('mongodb://' + (process.env.MONGO_HOST || 'localhost') + ':' + (process.env.MONGO_PORT || 27017) + '/' + (process.env.MONGO_DB || 'badblocks'), function() {
	mongoConnected = true;
});

var reportSchema = new Schema({
	block: { type: String, index: true },
	errorType: String,
	category: String,
	info: Schema.Types.Mixed,
	ip: String,
	createdAt: Date
});

var Report = mongoose.model('Report', reportSchema);

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

var Validator = function(result, ip, callback)
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

	var r = new Report;
	r.block = result.block;
	r.errorType = result.errortype;
	r.category = result.category;
	r.info = _.omit(result, ['block', 'errortype', 'category']);
	r.ip = ip;
	r.createdAt = new Date;

	r.save(function (err)
	{
		if(err !== null)
		{
			console.error(err);
		}

		callback(null, 'ok');
	});
}

module.exports = Validator;