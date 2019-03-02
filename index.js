//Define plot area:
var margin = {left: 45,right: 45,top: 45,bottom: 45};
var width = 450 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;

const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.bottom - margin.top;

//Data variables:
var data_ENIF2018 = [];
var data_points = [];
//Auxiliary functions:
//This function filters the data to be used.
var get_data = function(data,indicator){
  var aux = d3.nest()
              .key(function(d){ return d[indicator];})
              .rollup(function(levels){return d3.sum(levels,function(d){return d.PWT;});})
              .entries(data).map(function(d){return {[indicator]: d.key, PWT: d.value}});

  return aux;
};

//This function generates the grid.
var gen_points_data = function(m,n,size,units){
  var points = [];
  var k = 1;
  for (i = 1; i <= m; i++){
    for (j = 1; j <= n; j++){
      var aux = [];
      aux.push(i);
      aux.push(j);
      aux.push(k);
      aux.push(k*size);
      aux.push(units);
      if (k*size <= units) {aux.push("color_this");} else{aux.push("dont_color_this")};
      points.push(aux);
      k++;
    };
  };
  return points;
};

//This function computes the units:
var get_units = function(data,indicator){
  return (Object.values(data.filter(function(d){return d[indicator] == 1;}))[0]["PWT"]);
};

//This function computes the total:
var get_total = function(data){
  return d3.sum(data,function(d){return d.PWT;});
};

//These functions define the scales:
//Define the scales:
var x_scale = function(rows,min_x,max_x){
  return d3.scaleLinear().domain([0,rows+1]).range([min_x,max_x]);
};

var y_scale = function(columns,min_y,max_y){
  return d3.scaleLinear().domain([0,columns+1]).range([min_y,max_y]);
};

//This functions format a number with commas:
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Read the data and graph!
d3.json("ENIF2018.json",function(error,data)
{
  if (error) {return console.warn(error);}
  else{
    //General Variables
    var columns = 10;
    var rows = 10;
    var xScale = x_scale(rows,margin.left,plotWidth);
    var yScale = y_scale(columns,plotHeight,margin.bottom);

    //Deposits
    var indicator = "deposits"
    data_ENIF2018 = get_data(data,indicator);
    var total = get_total(data_ENIF2018);
    var squareSize = total/(columns*rows);
    var units = get_units(data_ENIF2018,indicator);
    data_points = gen_points_data(rows,columns,squareSize,units);

    //Create the svg1
    var svg1 = d3.select("#graph1_area").append("svg").attr("width",width).attr("height",height);

    //Append rectangles:
    svg1.selectAll("rect")
        .data(data_points)
        .enter()
        .append("rect")
        .attr("x",function(d){return xScale(d[0]);})
        .attr("y",function(d){return yScale(d[1]);})
        .attr("width", (plotWidth-margin.left)/(rows+1)-1)
        .attr("height", (plotHeight-margin.bottom)/(columns+1)-1)
        .attr("class",function(d){return d[5];});

    svg1.append("text")
        .attr("y",1.05*plotHeight)
        .attr("x",0.7*plotWidth)
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("1 square: "+numberWithCommas(squareSize)+" inhabitants");

    svg1.append("text")
        .attr("y",1.3*margin.top)
        .attr("x",xScale(6))
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Percentage of population: "+Math.round(units/total*10000)/100+"%");

    svg1.append("text")
        .attr("y",margin.top)
        .attr("x",xScale(6))
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Debit account");

   //Credits
    var indicator = "credit"
    data_ENIF2018 = get_data(data,indicator);
    var total = get_total(data_ENIF2018);
    var squareSize = total/(columns*rows);
    var units = get_units(data_ENIF2018,indicator);
    data_points = gen_points_data(rows,columns,squareSize,units);
    //Create the svg1
    var svg2 = d3.select("#graph2_area").append("svg").attr("width",width).attr("height",height);

    //Append rectangles:
    svg2.selectAll("rect")
        .data(data_points)
        .enter()
        .append("rect")
        .attr("x",function(d){return xScale(d[0]);})
        .attr("y",function(d){return yScale(d[1]);})
        .attr("width", (plotWidth-margin.left)/(rows+1)-1)
        .attr("height", (plotHeight-margin.bottom)/(columns+1)-1)
        .attr("class",function(d){return d[5];});

    svg2.append("text")
        .attr("y",1.05*plotHeight)
        .attr("x",0.7*plotWidth)
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("1 square: "+numberWithCommas(squareSize)+" inhabitants");

    svg2.append("text")
        .attr("y",1.3*margin.top)
        .attr("x",xScale(6))
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Percentage of population: "+Math.round(units/total*10000)/100+"%");

    svg2.append("text")
        .attr("y",margin.top)
        .attr("x",xScale(6))
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Credit account");

    //Insurance
    var indicator = "insurance"
    data_ENIF2018 = get_data(data,indicator);
    var total = get_total(data_ENIF2018);
    var squareSize = total/(columns*rows);
    var units = get_units(data_ENIF2018,indicator);
    data_points = gen_points_data(rows,columns,squareSize,units);
    //Create the svg1
    var svg3 = d3.select("#graph3_area").append("svg").attr("width",width).attr("height",height);

    //Append rectangles:
    svg3.selectAll("rect")
        .data(data_points)
        .enter()
        .append("rect")
        .attr("x",function(d){return xScale(d[0]);})
        .attr("y",function(d){return yScale(d[1]);})
        .attr("width", (plotWidth-margin.left)/(rows+1)-1)
        .attr("height", (plotHeight-margin.bottom)/(columns+1)-1)
        .attr("class",function(d){return d[5];});

    svg3.append("text")
        .attr("y",1.05*plotHeight)
        .attr("x",0.7*plotWidth)
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("1 square: "+numberWithCommas(squareSize)+" inhabitants");

    svg3.append("text")
        .attr("y",1.3*margin.top)
        .attr("x",xScale(6))
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Percentage of population: "+Math.round(units/total*10000)/100+"%");

    svg3.append("text")
        .attr("y",margin.top)
        .attr("x",xScale(6))
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Insurance policy");

    //Retirement
    var indicator = "retirement"
    data_ENIF2018 = get_data(data,indicator);
    var total = get_total(data_ENIF2018);
    var squareSize = total/(columns*rows);
    var units = get_units(data_ENIF2018,indicator);
    data_points = gen_points_data(rows,columns,squareSize,units);
    //Create the svg1
    var svg4 = d3.select("#graph4_area").append("svg").attr("width",width).attr("height",height);

    //Append rectangles:
    svg4.selectAll("rect")
        .data(data_points)
        .enter()
        .append("rect")
        .attr("x",function(d){return xScale(d[0]);})
        .attr("y",function(d){return yScale(d[1]);})
        .attr("width", (plotWidth-margin.left)/(rows+1)-1)
        .attr("height", (plotHeight-margin.bottom)/(columns+1)-1)
        .attr("class",function(d){return d[5];});

    svg4.append("text")
        .attr("y",1.05*plotHeight)
        .attr("x",0.7*plotWidth)
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("1 square: "+numberWithCommas(squareSize)+" inhabitants");

    svg4.append("text")
        .attr("y",1.3*margin.top)
        .attr("x",xScale(6))
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Percentage of population: "+Math.round(units/total*10000)/100+"%");

    svg4.append("text")
        .attr("y",margin.top)
        .attr("x",xScale(6))
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Retirement account");


  }
});
