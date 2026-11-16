function getCotral(stockSymbol) {    

    fetch(`/getContral?symbol=${stockSymbol}`)
        .then(response => response.json())
        .then(data => {
            // 數據
            var dataTrans = JSON.parse(data);
        })
        .catch(error => console.error("Error:", error));
}

function test(){
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
// append the svg object to the body of the page
const svg = d3.select("#contral_a_test")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);      
}