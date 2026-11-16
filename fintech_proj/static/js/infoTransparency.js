function getDataIT(stockSymbol1, stockSymbol2){
    
    fetch(`/gettest`)
        .then(response => response.json())
        .then(data => {
            // 清除之前畫的圖
            var pre = document.getElementById("infoTrans");
            if(pre){
                pre.parentNode.removeChild(pre);
            }

            // 設定圖大小
            const margin = {top: 30, right: 30, bottom: 70, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            const svg = d3.select("#infoTransArea")
                            .append("svg")
                                .attr("width", width + margin.left + margin.right)
                                .attr("height", height + margin.top + margin.bottom)
                                .attr("id", "infoTrans")
                            .append("g")
                                .attr("transform",`translate(${margin.left},${margin.top})`);

            // 把蒐集到的資料編譯為中文(本來是unicode)
            var dataTrans = JSON.parse(data);

            // 找最新(202309)
            dataTrans = dataTrans.filter((d => d['年月']=="202212"))

            // 找符合個股
            if(stockSymbol1.length != 0 && stockSymbol2.length != 0){
                let dataTrans1 = dataTrans.filter((d => d['證券代碼'].startsWith(stockSymbol1)))
                let dataTrans2 = dataTrans.filter((d => d['證券代碼'].startsWith(stockSymbol2)))
                dataTrans = dataTrans1.concat(dataTrans2)
            }
            else if(stockSymbol1.length != 0){
                dataTrans = dataTrans.filter((d => d['證券代碼'].startsWith(stockSymbol1)))
            }
            else{
                dataTrans = dataTrans.filter((d => d['證券代碼'].startsWith(stockSymbol2)))
            }
            

            // 小分類(每個bar)
            const subgroups = ["轉投資佔淨值%", "轉投資佔資產%"]

            // 大分類(不同證券)
            const groups = dataTrans.map(d => d["證券代碼"])

            // 整理資料(用來抓domain上下限)
            var reinvestNetWorth = dataTrans.map(function(obj) {
                return obj["轉投資佔淨值%"];
            });
            var reinvestAssets = dataTrans.map(function(obj) {
                return obj["轉投資佔資產%"];
            });

            // Add X axis
            const x = d3.scaleBand()
                .domain(groups)
                .range([0, width])
                .padding([0.2])
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .attr("dy", "0.5em")
                .attr("font-size", "14px")
                .attr("font-weight", "600");

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([d3.min(reinvestNetWorth.concat(reinvestAssets)), d3.max(reinvestNetWorth.concat(reinvestAssets))])
                .range([ height, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Another scale for subgroup position?
            const xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.05])

            // color palette = one color per subgroup
            const color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(["RGB(125, 196, 139)" ,"RGB(247, 222, 169)"])
            var temp_color = ["RGB(102, 153, 181)",  "RGB(140, 162, 99)", "RGB(247, 222, 169)"];
            // Show the bars
            svg.append("g")
                .selectAll("g")
                // Enter in data = loop group per group
                .data(dataTrans)
                .join("g")
                .attr("transform", d => `translate(${x(d["證券代碼"])}, 0)`)
                .selectAll("rect")
                .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
                .join("rect")
                .attr("x", d => xSubgroup(d.key))
                .attr("y", d => y(d.value))
                .attr("rx", "5")
                .attr("ry", "5")
                .attr("width", xSubgroup.bandwidth())
                .attr("height", d => height - y(d.value))
                .attr("fill", d => color(d.key));

            var temp_location = ['translate(-290, -22)', 'translate(-175, -22)']
            // 圖例
            const legend = svg.selectAll(".legend")
                .data(subgroups)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => temp_location[i]);

            legend.append("rect")
                .attr("x", width - 130)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", d => color(d));

            legend.append("text")
                .attr("x", width - 18)
                .attr("y", 6)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(d => d)
                .style("font-size", "14px")
                .attr("font-weight", "600");

            svg.append("text")
                .attr("y", -10)
                .attr("x", -40)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("(%)");
        })
}
