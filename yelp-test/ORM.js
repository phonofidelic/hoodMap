var Model = {
	inherited: function() {},
	created: function() {},

	prototype: {
		init: function() {}
	},

	create: function() {
		var object = Object.create(this);
		object.parent = this;
		object.prototype = object.fn = Object.create(this.prototype);

		object.created();
		this.inherited(object);
		return object;
	},

	init: function() {
		var instance = Object.create(this.prototype);
		instance.parent = this;
		instance.init.apply(instance, arguments);
		return instance;
	},

	extend: function(o) {
		var extended  = o.extended;
		$.extend(this, o);
		if (extended) extended(this);
	},

	include: function(o) {
		var included = o.included;
		$.extend(this.prototype, o);
		if (included) included(this);
	}
};

//Add object properties
$.extend(Model, {
	find: function() {}
});

Model.extend({
	find: function() {}
});

//Add instance properties
$.extend(Model.prototype, {
	init: function(atts) {
		if (atts) this.load(atts);
	},

	load: function() {
		for(var name in attributes)
			this[name] = attributes[name];
	}
});

Model.include({
	init: function(atts) {},
	load: function(attributes) {}
});

// An object of saved assets
Model.records = {};

Model.include({
	newRecord: true,

	create: function() {
		this.newRecord = false;
		this.parent.records[this.id];
	},

	destroy: function() {
		delete this.parent.records[this.id];
	},

	update: function() {
		this.parent.records[this.id] = this;
	},

// Save the object th the records hash, keeping a reference to it
	save: function() {
		this.newRecord ? this.create() : this.update();
	}
});

Model.extend({
	// Fins by ID or rais an exeption
	find: function(id) {
		var record = this.records[id];
		if ( !record ) throw new Error("Unknown record");
		return record;
	},

	populate: function(values) {
		// Reset model & records
		this.records = {};

		for (var i = 0; i < values.length; i++) {
			var record = this.init(values[i]);
			record.newRecord = false;
			this.records[record.id] = record;
		}
	}
});

var Asset = Model.create();