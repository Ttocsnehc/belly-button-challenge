const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data) {
  console.log(data);
  createPlots(data.names[0], data);
});


d3.json(url).then((data) => {
    var select = d3.select("#selDataset");
  
    data.names.forEach((id) => {
      select.append("option")
        .text(id)
        .property("value", id);
    });
  
    createPlots(data.names[0], data);
  });

function createPlots(id, data) {
  var samples = data.samples.filter(s => s.id.toString() === id)[0];
  
  // top 10
  var sampleValues = samples.sample_values.slice(0, 10).reverse();
  var idValues = samples.otu_ids.slice(0, 10).reverse();
  var otuIds = idValues.map(d => "OTU " + d)
  var labels = samples.otu_labels.slice(0, 10);

  // bar
  var trace1 = {
    x: sampleValues,
    y: otuIds,
    text: labels,
    type: "bar",
    orientation: "h"
  };

  // bar data
  var barData = [trace1];

  // bar layout
  var barLayout = {
    title: "Top 10 OTUs",
    yaxis: { title: "OTU ID" },
    xaxis: { title: "Sample Values" }
  };

  // bar chart
  Plotly.newPlot("bar", barData, barLayout);

  // bubble
  var trace2 = {
    x: samples.otu_ids,
    y: samples.sample_values,
    mode: "markers",
    marker: {
      size: samples.sample_values.map(value => value / 1.5),
      color: samples.otu_ids
    },
    text: samples.otu_labels
  };

  // bubble data
  var bubbleData = [trace2];

  // bubble layout
  var bubbleLayout = {
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" },
    showlegend: false
  };

  // bubble chart
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  var metadata = data.metadata.filter(m => m.id.toString() === id)[0];
  var metadataDisplay = d3.select("#sample-metadata");

  metadataDisplay.html("");

  Object.entries(metadata).forEach(([key, value]) => {
    metadataDisplay.append("h5").text(`${key}: ${value}`);
  });
}

function optionChanged(id) {
  d3.json(url).then((data) => {
    createPlots(id, data);
  });
}
