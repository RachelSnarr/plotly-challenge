function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  const url = "/metadata/" + sample;
  let selector = d3.select("#sample-metadata");
  selector.html("");

  d3.json(url).then((metadata) => {
    Object.entries(metadata).forEach(([key, value]) => {
      selector.append("h6")
      .text(key + ": " + value);
    });

  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  //Use `d3.json` to fetch the sample data for the plots
  const url = "/samples/" + sample;

  d3.json(url).then((samples) => {
    let otu_ids = samples["otu_ids"];
    let sample_values = samples["sample_values"];
    let otu_labels = samples["otu_labels"];

    let trace1 = {
      labels: otu_ids.slice(0, 10),
      values: sample_values.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      type: "pie"
    };

    let data = [trace1];

    Plotly.newPlot("pie", data);

    let trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        opacity: 0.5,
        color: otu_ids
      }
    };

    let bubble_data = [trace2];
    Plotly.newPlot("bubble", bubble_data)
  }
  
)};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
