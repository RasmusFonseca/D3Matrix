
function initD3Matrix(canvasDivId, width){
  var d3m = { 
    width   : width, 
    height  : 0,
    minCol  : "#4A569D",
    midCol  : "white",
    maxCol  : "#DC2424",
    midOff  : 0.5,
    svg     : d3.select("#"+canvasDivId).append("svg"),

    update : function(rawData){
      if( rawData!==undefined ){
        var ssv = d3.dsvFormat(" ").parseRows(rawData);
        var tsv = d3.dsvFormat("\t").parseRows(rawData);
        var csv = d3.dsvFormat(",").parseRows(rawData);
        if(ssv.length==0) return;
        d3m.data = ssv;
        if(tsv[0].length>d3m.data[0].length) 
          d3m.data = tsv;
        if(csv[0].length>d3m.data[0].length) 
          d3m.data = csv;
      }

      var rows = d3m.data.length;
      var cols = d3m.data[0].length;

      //Set width and height of svg
      var cellWidth = width/cols;
      d3m.height = cellWidth*rows;
      d3m.svg
        .attr("width", width)
        .attr("height", d3m.height);

      //Put data in bindable form
      var data1d = [];
      for(var r=0;r<rows;r++)
        for(var c=0;c<cols;c++)
          if(d3m.data[r][c]!==undefined)
            data1d.push( {"row":r, "col":c, "val":parseFloat(d3m.data[r][c])} )

      var minVal = d3.min(data1d, function(d){ return d["val"]; });
      var maxVal = d3.max(data1d, function(d){ return d["val"]; });
      var absMax = Math.max(-minVal, maxVal);

      var tmpScale = d3.scaleLinear().domain([-1, 0, 1]).range([d3m.minCol, d3m.midCol, d3m.maxCol]);
      var colScale = d3
        .scaleLinear()
        .domain([-absMax, -absMax*d3m.midOff, 0, absMax*d3m.midOff, absMax])
        .range([d3m.minCol, tmpScale(-0.5), d3m.midCol, tmpScale(0.5), d3m.maxCol]);
    
      var radScale = d3
        .scaleLinear()
        .domain([-absMax, -absMax*d3m.midOff, 0, absMax*d3m.midOff, absMax])
        .range([cellWidth/2, cellWidth/4, 0, cellWidth/4, cellWidth/2]);
    

      //Create/update/delete circles accordingly
      var circles = d3m.svg
        .selectAll("circle")
        .data(data1d, function(d){return d["row"]+","+d["col"]});

      //Entering set
      circles.enter()
        .append("circle")
        .attr("cx", function(d){ return d["col"]*cellWidth+cellWidth/2; })
        .attr("cy", function(d){ return d["row"]*cellWidth+cellWidth/2; })
        .attr("r", function(d){ return radScale(d["val"]); })
        //.attr("r", function(d){ return Math.abs(d["val"]*cellWidth/(2*absMax)); })
        .attr("fill", function(d){ return colScale(d["val"]); });

      //Update
      circles.transition()
        .attr("cx", function(d){ return d["col"]*cellWidth+cellWidth/2; })
        .attr("cy", function(d){ return d["row"]*cellWidth+cellWidth/2; })
        .attr("r", function(d){ return radScale(d["val"]); })
        .attr("fill", function(d){ return colScale(d["val"]); });

      //Exiting
      circles.exit()
        .transition()
        .attr("r", 0)
        .remove();
    }
  };

  
  return d3m;
}
