var _ = require('lodash');
var config = require('./utils/config');

var Validator = function (result, ip)
{
	if( _.isUndefined(result) || _.isUndefined(result[0]) || !_.isObject(result[0]) )
	{
		return false;
	}

	result = result[0];

	var errortype = _.get(result, "errortype", null);
	var errIndex = config.errors.indexOf(errortype);
	var category = _.result( _.filter(config.categories, function (item)
	{
		return item.max >= errIndex;
	}), 'name', 'Generic');

	return {
		block: 		_.get(result, 'block', null),
		errorType: 	errortype,
		category: 	category,
		info: 		_.omit(result, ['block', 'errortype', 'category']),
		ip: 		ip,
		createdAt: 	new Date
	};
}

module.exports = Validator;