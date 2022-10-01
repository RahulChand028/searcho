const search = (source, searchOption = {}) => {
	if (!source.data.length) {
		return { data: [], filted: 0, total: 0 };
	}
	const regex = new RegExp(String(source.search).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), searchOption.case ? "" : 'i');
	let data = JSON.parse(JSON.stringify(source.data));
	let scoreKey = 'score';
	while (Object.keys(source.data[0]).includes(scoreKey)) {
		scoreKey = scoreKey + scoreKey[0];
	}
	if (searchOption && searchOption.filter && Object.keys(searchOption.filter)) {
		const keys = Object.keys(searchOption.filter);
		keys.forEach(key => {
			data = data.filter(element => {
				let valueToSearch = null;
				if (key.split('.').length) {
					key.split('.').forEach(index => { valueToSearch = valueToSearch ? valueToSearch[index] : element[index] })
				} else {
					valueToSearch = element[key];
				}
				if (!searchOption.filter[key].type) {

					return valueToSearch ? typeof searchOption.filter[key] === 'object' ?
						String(searchOption.filter[key].value) == String(valueToSearch) :
						searchOption.filter[key] ?
							String(valueToSearch) == String(searchOption.filter[key]) :
							true : false;
				} else if (searchOption.filter[key].type.toLowerCase() === 'number') {
					if (typeof searchOption.filter[key].value === 'number') {
						return searchOption.filter[key].value === valueToSearch;
					} else {
						if (
							typeof searchOption.filter[key].min === 'number' &&
							searchOption.filter[key].min > valueToSearch
						) {
							return false;
						}
						if (
							typeof searchOption.filter[key].max === 'number' &&
							searchOption.filter[key].max < valueToSearch
						) {
							return false;
						}
						return true;
					}

				} else if (searchOption.filter[key].type.toLowerCase() === 'date') {

					const date = new Date(valueToSearch);

					if (!(date instanceof Date && !isNaN(date))) {
						return false;
					} else if (searchOption.filter[key].value) {
						return new Date(searchOption.filter[key].value).setHours(0, 0, 0, 0) == date.setHours(0, 0, 0, 0)
					} else {
						if (
							searchOption.filter[key].min &&
							(new Date(searchOption.filter[key].min).setHours(0, 0, 0, 0)) > date.setHours(0, 0, 0, 0)
						) {
							return false;
						}
						if (
							searchOption.filter[key].max &&
							(new Date(searchOption.filter[key].max).setHours(0, 0, 0, 0)) < date.setHours(0, 0, 0, 0)
						) {
							return false;
						}
						return true;
					}
				} else {
					return true;
				}
			});
		});
	}

	data = data.filter(element => {
		let points = 0;

		(searchOption && searchOption.searchCols && searchOption.searchCols.length ?
			searchOption.searchCols :
			Object.keys(element)
		).forEach(key => {
			let valueToSearch = null;
			if (key.split('.').length) {
				key.split('.').forEach(index => { valueToSearch = valueToSearch ? valueToSearch[index] : element[index] })
			} else {
				valueToSearch = element[key];
			}
			if (valueToSearch && typeof valueToSearch === 'object') {
				JSON.stringify(valueToSearch, (key, value) => {
					if (typeof value != 'undefined' && String(value).match(regex)) {
						points++;
						if (String(value).search(regex) === 0) {
							points++;
						}
					}
					return value;
				});
			} else if (typeof valueToSearch != 'undefined' && String(valueToSearch).match(regex)) {
				points++;
				if (String(valueToSearch).search(regex) === 0) {
					points++;
				}
			}
		});
		element[scoreKey] = points;
		return points;
	});
	const filted = data.length;
	source.size = source.size ? source.size : 10;
	data = source.page ?
		data
			.sort((a, b) => b[scoreKey] - a[scoreKey])
			.map(element => {
				delete element[scoreKey];
				return element;
			})
			.slice(
				source.page * source.size - source.size,
				source.page * source.size
			) :
		data
			.sort((a, b) => b[scoreKey] - a[scoreKey])
			.map(element => {
				delete element[scoreKey];
				return element;
			});
	if (searchOption && searchOption.sort) {
		if (typeof searchOption.sort === 'string') {
			data = data.sort((a, b) => a[searchOption.sort] > b[searchOption.sort] ? 1 : a[searchOption.sort] < b[searchOption.sort] ? -1 : 0);
		} else if (searchOption && typeof searchOption.sort === 'object' && searchOption.sort != null) {
			data = data.sort((a, b) => a[searchOption.sort.key] > b[searchOption.sort.key] ? 1 : a[searchOption.sort.key] < b[searchOption.sort.key] ? -1 : 0);
			searchOption.sort.order == -1 ? data.reverse() : '';
		}
	}
	return {
		data: data,
		filted: filted,
		total: source.data.length
	};
};

const searchValue = (data = [], keys = []) => {
	let result = [];
	let resultPoint = null;
	data.forEach(point => {
		Object.keys(point).forEach(key => {
			let getPointValue = getResultPoint(key, point, keys);
			if (getPointValue) { resultPoint ? resultPoint = { ...resultPoint, ...getPointValue } : resultPoint = getPointValue; }
		});
		if (resultPoint) { result.push(resultPoint); resultPoint = null; }
	});
	return result;
}

const getResultPoint = (key, point, keys) => {
	let returnValue = null;
	if (keys.includes(key)) {
		returnValue = { [key]: point[key] }
	} else if (typeof point[key] === 'object' && point[key] != null) {
		Object.keys(point[key]).forEach(ikey => { returnValue = getResultPoint(ikey, point[key], keys); });
	}
	return returnValue;
}

const pagination = (data, config = { page: 1, size: 10 }) => {
	let resultData = data.slice(
		config.page * config.size - config.size,
		config.page * config.size
	);
	return {
		data: resultData,
		filted: resultData.length,
		total: data.length
	};
}
module.exports = { search, searchValue, pagination };
