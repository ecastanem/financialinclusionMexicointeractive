//Define plot variables:
var margin = {left: 45,right: 45,top: 45,bottom: 45};
var width = 450 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;
const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.bottom - margin.top;
var columns = 10;
var rows = 10;

//Data variables:
var gender = ["All","Males", "Females"];
var regions = ["All","Northwest","Northeast","Central West","Mexico City","Central East","South"];
var size = ["All", "more than 15,000 inhabitants", "less than 15,000 inhabitants"];
var educ = ["All","None", "Elementary School", "Middle School", "High School", "Undergradute School", "Graduate School"];
var age = ["All","18-25", "26-30", "31-35", "36-40", "41-45", "46-50", "51-55", "56-60", "61-65", "66-70"];
var occup = ["All","Employee", "Student", "Retiree", "Homecare", "Unemployed"];

//Auxiliary functions:
function create_array(n){
  var aux = [];
  for (i = 1; i<n; i++){aux.push(i);};
  return aux;
};

function aux_filter(data_value, filter_list){
  var aux = 0;
  for (i=0; i<filter_list.length; i++){
      if (data_value == filter_list[i]){ aux = 1};
  };
  return aux;
}

//This function filters the data set based on a criteria and my reference is Stackoverflow.
function find_in_object(data, criteria){
  return data.filter(function(d) {
    return Object.keys(criteria).every(function(c) {
      return d[c] == criteria[c];});
  });
}

//This function filter the data:
function filter_data(data,gender_value,region_value,size_value,educ_value,age_value,occup_value){
  var gender_index = gender.indexOf(gender_value);
  var region_index = regions.indexOf(region_value);
  var size_index = size.indexOf(size_value);
  var educ_index = educ.indexOf(educ_value);
  var age_index = age.indexOf(age_value);
  var occup_index = occup.indexOf(occup_value);
  var filter_criteria = '{';

  if (gender_index > 0) {filter_criteria=filter_criteria+'"GEN":'+gender_index+',';}
  if (region_index > 0) {filter_criteria=filter_criteria+'"REGION":'+region_index+',';}
  if (size_index > 0) {filter_criteria=filter_criteria+'"SIZE":'+size_index+',';}
  if (educ_index > 0) {filter_criteria=filter_criteria+'"EDUC":'+educ_index+',';}
  if (age_index > 0) {filter_criteria=filter_criteria+'"AGE":'+age_index+',';}
  if (occup_index > 0) {filter_criteria=filter_criteria+'"OCCUP":'+occup_index+',';}

  filter_criteria=filter_criteria.substring(0,filter_criteria.length-1)+'}';
  if (filter_criteria.length==1){
    var filtered_data = data;
  }
  else{
    var a = JSON.parse(filter_criteria);
    var filtered_data = find_in_object(data,a);
  };
  return filtered_data;
};


//This function creates the data layout to be used.
 function get_data(data,indicator){
  var aux = d3.nest()
              .key(function(d){ return d[indicator];})
              .rollup(function(levels){return d3.sum(levels,function(d){return d.PWT;});})
              .entries(data).map(function(d){return {[indicator]: d.key, PWT: d.value}});

  return aux;
};


//This function generates the grid.
function gen_points_data(m,n,size,units){
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
function get_units(data,indicator){
  return (Object.values(data.filter(function(d){return d[indicator] == 1;}))[0]["PWT"]);
};

//This function computes the total:
function get_total(data){
  return d3.sum(data,function(d){return d.PWT;});
};

//These functions define the scales:
//Define the scales:
function x_scale(rows,min_x,max_x){
  return d3.scaleLinear().domain([0,rows+1]).range([min_x,max_x]);
};

function y_scale(columns,min_y,max_y){
  return d3.scaleLinear().domain([0,columns+1]).range([min_y,max_y]);
};

var xScale = x_scale(rows,margin.left,plotWidth);
var yScale = y_scale(columns,plotHeight,margin.bottom);

//This function format a number with commas:
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//This function creates the waffle plots:
function waffle_plot_ecm(svg_name,indicator,data,svg_area,svg_title){
  var data_ENIF2018 = get_data(data,indicator);
  var total = get_total(data_ENIF2018);
  var squareSize = total/(columns*rows);
  var units = get_units(data_ENIF2018,indicator);
  var data_points = gen_points_data(rows,columns,squareSize,units);

  svg_name.selectAll("rect")
      .data(data_points)
      .enter()
      .append("rect")
      .attr("x",function(d){return xScale(d[0]);})
      .attr("y",function(d){return yScale(d[1]);})
      .attr("width", (plotWidth-margin.left)/(rows+1)-1)
      .attr("height", (plotHeight-margin.bottom)/(columns+1)-1)
      .attr("class",function(d){return d[5];})
      .append("title")
          .text(function(d){
            var aux="";
            if(d[5]=="color_this"){aux = "Estimated inhabitants with the service: "+numberWithCommas(units);}
            else {aux = "Estimated inhabitants without the service: "+numberWithCommas(total-units);};
            return aux;
            });

  svg_name.append("text")
      .attr("y",1.05*plotHeight)
      .attr("x",0.7*plotWidth)
      .attr("class","legend")
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .text("1 square: "+numberWithCommas(squareSize)+" inhabitants");

  svg_name.append("text")
      .attr("y",1.3*margin.top)
      .attr("x",xScale(6))
      .attr("class","legend")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Percentage of population: "+Math.round(units/total*10000)/100+"%");

  svg_name.append("text")
      .attr("y",margin.top)
      .attr("x",xScale(6))
      .attr("class","legend")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(svg_title);

};


var dd = [];
//Read the data and graph!
d3.json("ENIF2018.json",function(error,data)
{
  if (error) {return console.warn(error);}
  else{
    dd=data;
    var svg1 = d3.select("#graph1_area").append("svg").attr("width",width).attr("height",height);
    var svg2 = d3.select("#graph2_area").append("svg").attr("width",width).attr("height",height);
    var svg3 = d3.select("#graph3_area").append("svg").attr("width",width).attr("height",height);
    var svg4 = d3.select("#graph4_area").append("svg").attr("width",width).attr("height",height);

    //Deposits
    waffle_plot_ecm(svg1,"deposits",data,"#graph1_area","Debit account");
   //Credits
    waffle_plot_ecm(svg2, "credit",data,"#graph2_area","Credit account");
    //Insurance
    waffle_plot_ecm(svg3, "insurance",data,"#graph3_area","Insurance policy");
    //Retirement
    waffle_plot_ecm(svg4, "retirement",data,"#graph4_area","Retirement account");

    //Add menus
    var select_gender = d3.select("#gender_control").append('select').attr('class','select_gender').on("change",function(){update_waffle();});
    var options_gender = select_gender.selectAll('option').data(gender).enter().append('option').text(function(d){return d;});
    var select_region = d3.select("#region_control").append('select').attr('class','select_region').on("change",function(){update_waffle();});
    var options_region = select_region.selectAll('option').data(regions).enter().append('option').text(function(d){return d;});
    var select_size = d3.select("#size_control").append('select').attr('class','select_size').on("change",function(){update_waffle();});
    var options_size = select_size.selectAll('option').data(size).enter().append('option').text(function(d){return d;});
    var select_educ = d3.select("#education_control").append('select').attr('class','select_educ').on("change",function(){update_waffle();});
    var options_educ = select_educ.selectAll('option').data(educ).enter().append('option').text(function(d){return d;});
    var select_age = d3.select("#age_control").append('select').attr('class','select_age').on("change",function(){update_waffle();});
    var options_age = select_age.selectAll('option').data(age).enter().append('option').text(function(d){return d;});
    var select_occup = d3.select("#occupation_control").append('select').attr('class','select_occup').on("change",function(){update_waffle();});
    var options_occup = select_occup.selectAll('option').data(occup).enter().append('option').text(function(d){return d;});

    var update_waffle = function(){
      var gender_value=d3.select("select.select_gender").property("value");
      var region_value=d3.select("select.select_region").property("value");
      var size_value=d3.select("select.select_size").property("value");
      var educ_value=d3.select("select.select_educ").property("value");
      var age_value=d3.select("select.select_age").property("value");
      var occup_value=d3.select("select.select_occup").property("value");

      var aux_data = filter_data(dd,gender_value,region_value,size_value,educ_value,age_value,occup_value);
      d3.selectAll("text.legend").remove();
      d3.selectAll("rect").remove();
      //Deposits
      waffle_plot_ecm(svg1,"deposits",aux_data,"#graph1_area","Debit account");
     //Credits
      waffle_plot_ecm(svg2, "credit",aux_data,"#graph2_area","Credit account");
      //Insurance
      waffle_plot_ecm(svg3, "insurance",aux_data,"#graph3_area","Insurance policy");
      //Retirement
      waffle_plot_ecm(svg4, "retirement",aux_data,"#graph4_area","Retirement account");

    };

  }
});
