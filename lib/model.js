var Report = function (mongoose)
{
	this.db = mongoose;

	this.schema = new this.db.Schema({
		block: { type: String, minlength: 64, maxlenght: 64,  index: true },
		errorType: String,
		category: String,
		info: this.db.Schema.Types.Mixed,
		ip: String,
		createdAt: Date
	});

	this.model = this.db.model('Report', this.schema);

	return this.model;
}

module.exports = Report;