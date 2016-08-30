exports.log = function(message) {
	var debug = true;
	if (debug) console.log(message);
}

exports.print_call_stack = function() {
	var stack = new Error().stack;
	console.log(stack);
}

exports.clone = function(tar) {
	var rs = {};
	for (var key in tar) {
		rs[key] = tar[key];
	}
	return rs;
}

exports.dataSplit = function(data, splite) {
	var re = new RegExp('\\' + splite + "(.*)", "g");
	var rsdata = {
		condition: {},
		value: {}
	};

	for (var key in data) {
		if (key.match(re) != null)
			rsdata.condition[key.replace(splite, '')] = data[key];
		else
			rsdata.value[key] = data[key];
	}
	return rsdata;
};
