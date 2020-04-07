export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function getCombination(group:{}, xAxis:string){
    let combination : number = 0;
    Object.keys(group).forEach(key =>{
        combination += (key !== 'name') ? group[key] : 0;
    })
    return combination;
}

export function formatTableData(tablePropsData, xAxis:string, percent:boolean) {
    let items : {}[]= [];
    tablePropsData.series.forEach(query => {
        let queryValues = [];
        let valueName = [];
        let queryData = query.fields;
        queryData.forEach(data => {
            queryValues.push(data.values.toArray());
            valueName.push(data.name);
        });
        for (let i = 0; i < queryValues[0].length; i++) {
            let item = {};
            queryValues.forEach(function (values, index) {
                if (valueName[index] == xAxis) {
                    item['name'] = values[i];
                } else {
                    item[valueName[index]] = values[i];
                }
            });
            items.push(item);
        }
    });
    if(percent){
        items.forEach(item =>{
            let combination = getCombination(item, xAxis)
            Object.keys(item).forEach( key => {
                if(key !== 'name'){
                    item[key] = ((item[key] * 100) / combination).toFixed(2)
                }
            });
        });
    };
    return items;
}
