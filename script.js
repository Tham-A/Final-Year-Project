var tabulate = function (data,columns) {
    var table = d3.select('body').append('table')
      var thead = table.append('thead')
      var tbody = table.append('tbody')
  
      thead.append('tr')
        .selectAll('th')
          .data(columns)
          .enter()
        .append('th')
          .text(function (d) { return d })
  
      var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
        .append('tr')
  
      var cells = rows.selectAll('td')
          .data(function(row) {
              return columns.map(function (column) {
                  return { column: column, value: row[column] }
            })
        })
        .enter()
      .append('td')
        .text(function (d) { return d.value })
  
    return table;
}

var dataCSV = d3.csv('LCKSummer2017.csv');

dataCSV.then(function (data) {
    //console.log(data);
    var fixedData = data.map(function (d) {
        return {
            Team: d.Team,
            Golddiff: d.Golddiff,
            Side: d.Side
        };
    });
    console.log(fixedData);

    var filtered = fixedData.filter(function(d) { return d.Side == "Both"});
    console.log(filtered);
    var columns = ["Team", "Golddiff", "Side"];
    tabulate(filtered, columns);

    var asd = fixedData.filter(function(d) { return d.Team == "SKT" && d.Side == "Blue"})
    console.log(asd);
})

var dataCSV2 = d3.json('LCKSummer2017.json');

dataCSV2.then(function (data) {
  //console.log(data);
  var fixedData1 = data.map(function (d) {
      return {
          Team: d.Team,
          Golddiff: d.Golddiff,
          Side: d.Side
      };
  });
  console.log(fixedData1);

  var filtered1 = fixedData1.filter(function(d) { return d.Side == "Both"});
  var columns = ["Team", "Golddiff", "Side"];
  tabulate(filtered1, columns);
  
  let greatest = -Infinity;
  for (let i = 0; i < 10; i++) {
    if (JSON.parse(filtered1[i].Golddiff).length > greatest) {
      greatest = JSON.parse(filtered1[i].Golddiff).length;
    }
  }
  console.log(greatest)
  console.log(filtered1[0].Golddiff)
})