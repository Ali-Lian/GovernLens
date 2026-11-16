function getDataKL(stockSymbol, num) {

    // 發送包含股票代號的請求
    fetch(`/get_data?symbol=${stockSymbol}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);

            // 數據
            const kLineData = data.data;

            // 將日期轉換為 JavaScript Date 對象
            kLineData.forEach(d => {
                d.date = new Date(d.date);
            });

            KLine(kLineData, num);
            
        })
        .catch(error => console.error("Error:", error));
}



function KLine(kLineData, num){
    
    // 設定 SVG 寬高和邊距
    var margin = { top: 20, right: 20, bottom: 30, left: 40 };
    var width = document.getElementById("KLine" + String(num)).getBoundingClientRect().width;
    var height = document.getElementById("KLine"+ String(num)).getBoundingClientRect().height;
    
    // 清除之前畫的圖
    var pre = document.getElementById("KLinePlot" + String(num));
    if(pre){
        pre.parentNode.removeChild(pre);
    }

    // 創建 SVG 元素
    var svg = d3.select("#kLineChart" + String(num))
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("id", "KLinePlot" + String(num))
        // .attr("transform", `translate(${margin.left},${margin.top})`);

    // 定義 x 和 y 的比例尺
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // // 設定 x 和 y 的域
    var xExtent = d3.extent(kLineData, d => d.date);
    
    // const yExtent = d3.extent(kLineData.map(d => [d.low, d.high]));
    low = d3.min(kLineData.map(d => d.low))
    high = d3.max(kLineData.map(d => d.high))
    
    x.domain(xExtent);
    y.domain([low - 1, high + 1]);


    // 新增時間格式化函數
    var formatDate = d3.timeFormat("%Y-%m");

    // 創建 x 軸生成器
    var xAxis = d3.axisBottom(x).tickFormat(formatDate);

    // 創建 y 軸生成器
    var yAxis = d3.axisLeft(y);

    // 在 SVG 中添加 x 軸
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        // .attr("transform", "rotate(-30)") // 可選，將標籤旋轉，使其更容易閱讀
        .style("text-anchor", "end"); // 可選，設定文字錨點;

    // 在 SVG 中添加 y 軸
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);


    // 創建 K 線圖中的線段
    svg.selectAll(".line")
        .data(kLineData)
        .enter().append("line")
        .attr("x1", d => x(d.date))
        .attr("x2", d => x(d.date))
        .attr("y1", d => y(d.low))
        .attr("y2", d => y(d.high))
        .attr("stroke", d => d.change >= 0 ? "green" : "red");

    // 增加矩形表示 K 線圖中的實體
    svg.selectAll(".bar")
        .data(kLineData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.date) - 2)
        .attr("y", d => y(Math.max(d.open, d.close)))
        .attr("width", 4)
        .attr("height", d => Math.abs(y(d.open) - y(d.close)))
        .attr("fill", d => d.change >= 0 ? "green" : "red");    
    
    // 計算縮放比例
    // var scale = Math.min(width / svg.node().getBBox().width, height / svg.node().getBBox().height);
    var scale = 0.9;

    // 對 g 元素進行等比例縮放
    svg.attr("transform", `translate(${margin.left},10) scale(${scale})`);

    
}
