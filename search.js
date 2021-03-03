let search = (source, searchOption) => {
    if (!source.data.length) {
        return { data: [], filted: 0, total: 0 };
    }
    const regex = new RegExp(String(source.search).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "i");
    let data = JSON.parse(JSON.stringify(source.data));
    let scoreKey = "score";
    while (Object.keys(source.data[0]).includes(scoreKey)) {
        scoreKey = scoreKey + scoreKey[0];
    }
    if (searchOption && searchOption.filter && Object.keys(searchOption.filter)) {
        let keys = Object.keys(searchOption.filter);
        keys.forEach(key => {
            data = data.filter(element => {
                let valueToSearch = null;
                if (key.split('.').length) {
                    key.split('.').forEach(index => { valueToSearch = valueToSearch ? valueToSearch[index] : element[index] })
                } else {
                    valueToSearch = element[key];
                }
                if (!searchOption.filter[key].type) {

                    return valueToSearch ? typeof searchOption.filter[key] == "object" ?
                        String(searchOption.filter[key].value) == String(valueToSearch) :
                        searchOption.filter[key] ?
                            String(valueToSearch) == String(searchOption.filter[key]) :
                            true : false;
                } else if (searchOption.filter[key].type.toLowerCase() == "number") {
                    if (typeof searchOption.filter[key].value == "number") {
                        return searchOption.filter[key].value == valueToSearch;
                    } else {
                        if (
                            typeof searchOption.filter[key].min == "number" &&
                            searchOption.filter[key].min > valueToSearch
                        ) {
                            return false;
                        }
                        if (
                            typeof searchOption.filter[key].max == "number" &&
                            searchOption.filter[key].max < valueToSearch
                        ) {
                            return false;
                        }
                        return true;
                    }

                } else if (searchOption.filter[key].type.toLowerCase() == "date") {

                    let date = new Date(valueToSearch);

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
            if (String(valueToSearch).match(regex)) {
                points++;
                if (String(valueToSearch).search(regex) == 0) {
                    points++;
                }
            }
        });
        element[scoreKey] = points;
        return points ? true : false;
    });
    let filted = data.length;
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
        if (typeof searchOption.sort == "string") {
            data = data.sort((a, b) => a[searchOption.sort] > b[searchOption.sort] ? 1 : a[searchOption.sort] < b[searchOption.sort] ? -1 : 0);
        } else if (searchOption && typeof searchOption.sort == "object" && searchOption.sort != null) {
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

module.exports = search;
