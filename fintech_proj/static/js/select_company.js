// 畫面資料
function show_company_name(index){
    document.getElementById('corp_name').textContent = testjson[index]['證券代碼'];
}
// 畫圖
function show_company_chart(corp){
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.json("test.json").then( function(data) {
        var filteredData = data.filter(d => d["證券代碼"] === corp);
        //const subgroups = data.columns.slice(1)
        const subgroups = ["法人持股%", "自然人持股%"]

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        const groups = filteredData.map(d => (d["年月"]))
        //console.log(filteredData);

        // Add X axis
        const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        const y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#45A197','#4570A1'])

        //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
        .keys(subgroups)
        (filteredData)

        // console.log(stackedData);
        // Show the bars
        svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .join("rect")
            .attr("x", d => x(d.data["年月"]))
            .attr("y", d => y(d[1]))
            .attr("rx", "5")
            .attr("ry", "5")
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width",x.bandwidth())
    })
}
