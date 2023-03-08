var margin = {top: 20, right: 200, bottom: 40, left: 80},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var data;
var tooltip = d3.select("#tooltip").attr('opacity' , 0);

d3.json( "LCKSummer2017.json").then(function(dataset) {
    data = dataset;
    console.log(data)
    drawLines(); 
  
}).catch(function(error) {
  console.log(error);
});

function drawLines(){

  function tweenDash() {
      var l = this.getTotalLength(),
          i = d3.interpolateString("0," + l, l + "," + l);
      return function (t) { return i(t); };
  }
  function transition(selection) {
      selection.each(function(){
      d3.select(this).transition()
                  .duration(2000)
                  .attrTween("stroke-dasharray", tweenDash);
      })
          }

  d3.select('.svg').remove()
  
  var svg = d3.select("#lineChart")
  .style("width", width + margin.left + margin.right + "px")
  .style("height", height + margin.top + margin.bottom + "px")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")")
  .attr("class", "svg");

  var attribute = d3.select('#attribute-input').property('value')
  selectedData = data.filter(d=> d.Side == attribute)
  let lineChartData = []
  selectedData.forEach(element => { 
      let golddiff = JSON.parse(element.Golddiff)
      let values = []
      golddiff.forEach((el , i)=>{
          values.push({x:i, y:+el})
      })
      lineChartData.push({key:element.Team, values:values})
  }); 


  var maxX =  d3.max(lineChartData, function(c) { return d3.max(c.values, function(d) { return d.x; }); }) 

  var maxY =  d3.max(lineChartData, function(c) { return d3.max(c.values, function(d) { return d.y; }); }) 
  var minY =  d3.min(lineChartData, function(c) { return d3.min(c.values, function(d) { return d.y; }); }) 

  // Set the ranges
  var x = d3.scaleLinear().domain([0,maxX]).range([0, width]);
  var y = d3.scaleLinear().domain([minY,maxY]).range([height, 0]).nice();
  var color = d3.scaleOrdinal(d3.schemeCategory10);  

  // Define the line
  var valueLine = d3.line()
  .x(function(d) { return x(+d.x); })
  .y(function(d) { return y(+d.y); })

  // Set up the x axis
  var xaxis = svg.append("g")
  .attr("transform", "translate(0," + y(0) + ")")
  .attr("class", "x axis")
  .call(d3.axisBottom(x));

  //add label to x-axis
  svg.append("text")      // text label for the x axis
  .attr("transform", "translate("+ (width + margin.left-10) +"," + (y(0)+10) + ")")
      .style("text-anchor", "middle")
      .text("Time(minutes)");

  // Add the Y Axis
  var yaxis = svg.append("g")
              .attr("class", "y axis")
              .call(d3.axisLeft(y).ticks(5));

  // Add a label to the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 60)
      .attr("x", 0 - (height / 2.5))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Golddiff value")
      .attr("class", "y axis label");
        


  lineChartData.forEach(d=>{
      g = svg.append('g').attr('class' , d.key)

      d.values = d.values.sort((a,b) => (+a.key) - (+b.key))

      g
      .append("path")
      .attr('class' , 'line')
      .attr("d", valueLine(d.values))
      .attr('stroke' , color(d.key))
      .attr('fill' , 'none')
      .attr('stroke-width' , 2)
      .on('mouseover', function(e){
          d3.selectAll('.line').style('opacity' , 0.2)
          d3.select(this).style("cursor", "pointer").attr('stroke-width' , 5).style('opacity' ,1); 
          d3.select("#tooltip")
          .style('opacity' , 1)
            .html("<b>Team: </b>" + d.key )
            .style("left", ( d3.event.pageX)  +"px") 
            .style("top", (d3.event.pageY - 60) + "px")
            .style("fill-opacity","0.5")
            .style('background' , color(d.key) )
      })
      .on('mouseout' , function(d){
          d3.select(this).style("cursor", "default").attr('stroke-width' , 2); 
          d3.selectAll('.line').style('opacity' , 1)
          d3.select("#tooltip").style('opacity' , 0).html('')
            .style("left", (0) + "px") 
            .style("top", (0) + "px")
      }) 


  })


  transition(d3.selectAll(".line"))
}