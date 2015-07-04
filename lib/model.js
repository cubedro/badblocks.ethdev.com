var Report = function (mongoose)
{
	this.db = mongoose;

	this.schema = new this.db.Schema({
		block: { type: String, index: true, required: true },
		errorType: { type: String, required: true },
		category: String,
		info: this.db.Schema.Types.Mixed,
		ip: String,
		createdAt: Date
	});

	this.model = this.db.model('Report', this.schema);

	return this.model;
}

module.exports = Report;