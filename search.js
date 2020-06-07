let search = (source, searchOption) => {
    if (!source.data.length) {
        return { data: [], filted: 0, total: 0 };
    }
    const regex = new RegExp(source.search, "i");
    let data = JSON.parse(JSON.stringify(source.data));
    let scoreKey = "score";
    while (Object.keys(source.data[0]).includes(scoreKey)) {
        scoreKey = scoreKey + scoreKey[0];
    }
    if (searchOption && searchOption.filter && Object.keys(searchOption.filter)) {
        let keys = Object.keys(searchOption.filter);
        keys.forEach(key => {
            data = data.filter(element => {
                if (!searchOption.filter[key].type) {
                    return typeof searchOption.filter[key] == "object"
                        ? String(searchOption.filter[key].value) == String(element[key])
                        : searchOption.filter[key]
                            ? String(element[key]) == String(searchOption.filter[key])
                            : true;
                } else if (searchOption.filter[key].type.toLowerCase() == "number") {
                    if (typeof searchOption.filter[key].value == "number") {
                        return searchOption.filter[key].value == element[key];
                    } else {
                        if (
                            typeof searchOption.filter[key].min == "number" &&
                            searchOption.filter[key].min > element[key]
                        ) {
                            return false;
                        }
                        if (
                            typeof searchOption.filter[key].max == "number" &&
                            searchOption.filter[key].max < element[key]
                        ) {
                            return false;
                        }
                        return true;
                    }
                    return true;
                } else if (searchOption.filter[key].type.toLowerCase() == "date") {

                    if (searchOption.filter[key].value) {
                        return new Date(searchOption.filter[key].value).setHours(0, 0, 0, 0) == new Date(element[key]).setHours(0, 0, 0, 0)
                    } else {
                        if (
                            searchOption.filter[key].min &&
                            (new Date(searchOption.filter[key].min).setHours(0, 0, 0, 0)) > new Date(element[key]).setHours(0, 0, 0, 0)
                        ) {
                            return false;
                        }
                        if (
                            searchOption.filter[key].max &&
                            (new Date(searchOption.filter[key].max).setHours(0, 0, 0, 0)) < new Date(element[key]).setHours(0, 0, 0, 0)
                        ) {
                            return false;
                        }
                        return true;
                    }
                    return true;
                } else {
                    return true;
                }
            });
        });
    }

    data = data.filter(element => {
        let points = 0;

        (searchOption && searchOption.searchCols && searchOption.searchCols.length
            ? searchOption.searchCols
            : Object.keys(element)
        ).forEach(key => {
            if (String(element[key]).match(regex)) {
                points++;
                if (String(element[key]).search(regex) == 0) {
                    points++;
                }
            }
        });
        element[scoreKey] = points;
        return points ? true : false;
    });
    let filted = data.length;
    source.size = source.size ? source.size : 10;
    data = source.page
        ? data
            .sort((a, b) => b[scoreKey] - a[scoreKey])
            .map(element => {
                delete element[scoreKey];
                return element;
            })
            .slice(
                source.page * source.size - source.size,
                source.page * source.size
            )
        : data
            .sort((a, b) => b[scoreKey] - a[scoreKey])
            .map(element => {
                delete element[scoreKey];
                return element;
            });
    return {
        data: data,
        filted: filted,
        total: source.data.length
    };
};

module.exports = search;
