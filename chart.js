function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`)
    })

      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          marker: {size: 28, color:'850000'},
          value: result.wfreq,
          title: 'Belly Button Washing Frequency<br> Scrubs per Week',
          titlefont: {family: '"Palatino Linotype", "Book Antiqua", Palatino, serif'},
          type: "indicator",
          mode: "gauge+number"
        }
      ];
      
      // layout for the gauge chart.
      var gaugeLayout = {
        width: 450,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        line: {
        color: '600000'
        },
        paper_bgcolor: "#a5bdc6",
        font: { color: "#85541d", family: "Serif" }
      };
  
      // plot the gauge data and layout.
      Plotly.newPlot("gauge", guageData, gageLayout);
    });
  }
    
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var buildingArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = buildingArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(); 

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
  
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
    // 1. Create the trace for the bubble chart.
    var bubbleChart = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
    };
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ]; 
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleChart, bubbleLayout);
  });
}

