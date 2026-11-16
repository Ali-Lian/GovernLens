function drawgraph3(company1,company2){

document.getElementById("shareholdingandpledge").innerHTML = ""
var comptodraw = "";
var drawtwo = false;

//看看傳進來的公司
if(company1!="" && company2!=""){
  //畫兩家
  drawtwo = true;
}else if (company1!="" && company2==""){
  //只畫第一家
  comptodraw = company1;
}else if (company1=="" && company2!=""){
  //只畫第二家
  comptodraw = company2;
}else if(company1=="" && company2==""){
  //大家可以回家
  return;
}

fetch(`/getlocaldata?dataset=持股質押.csv`)
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        const parsedData = JSON.parse(data);
        
        // // set the dimensions and margins of the graph
        const margin = {top:40, right: 30, bottom: 70, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#shareholdingandpledge")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        
        if (!drawtwo){//只畫單一資料
          //在此可以過濾資料
          let filteredData = parsedData.filter(d => d['證券代碼'].includes(comptodraw));
          filteredData = filteredData.filter(d => d['年月'] == "202212");
          console.log(filteredData);
          const categories = ["董監持股%", "董監質押%", "大股東持股%"];
          const values = categories.map(category => filteredData[0][category]);
          var ymax = 1;
          if(d3.max(values)>ymax){ymax = d3.max(values)}

          // Set up scales
          const x = d3.scaleBand()
            .domain(categories)
            .range([0, width])
            .padding(0.2);
          
          const y = d3.scaleLinear()
            .domain([0, ymax])
            .range([height, 0]);
          
          var temp_color = ["RGB(102, 153, 181)",  "RGB(140, 162, 99)", "RGB(247, 222, 169)"];
          // Create bars
          svg.selectAll("rect")
            .data(values)
            .enter().append("rect")
            .attr("x", (d, i) => x(categories[i]))
            .attr("y", d => y(d))
            .attr("rx", "5")
            .attr("ry", "5")
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d))
            .attr("fill", (d, i) => temp_color[i])
          
          // Add x-axis
          svg.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "0em")
          .attr("dy", "1em")
          .attr("transform", "rotate(-15)")
          .attr("font-size", "14px")
          .attr("font-weight", "600")
          
          
          // Add y-axis
          svg.append("g")
            .call(d3.axisLeft(y));

          svg.append("text")
          .attr("y", -10)
          .attr("x", -40)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("(%)");
          
        }
        else{//我要畫兩張
          let filteredData1 = parsedData.filter(d => d['證券代碼'].includes(company1));
          let filteredData2 = parsedData.filter(d => d['證券代碼'].includes(company2));
          let filteredData = filteredData1.concat(filteredData2);
          filteredData = filteredData.filter(d => d['年月'] == "202212");
          //console.log(filteredData);
          const categories = ["董監持股%", "董監質押%", "大股東持股%"];

          const groups = filteredData.map(d => d['證券代碼'])
          var ymax = 1;
          if (d3.max(filteredData, d => d3.max(categories, category => d[category]))>ymax){ymax = d3.max(filteredData, d => d3.max(categories, category => d[category]))};

           // Add X axis
          const x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
            
          // 修改 x 轴的文字大小
          svg.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x).tickSize(0))
          .selectAll("text")  // 选择所有的文本元素
          .attr("dy", "1em")
          .style("font-size", "14px")
          .style("font-weight", "600"); // 设置字体大小

          // Add Y axis
          const y = d3.scaleLinear()
            .domain([0, ymax])
            .range([ height, 0 ]);
          svg.append("g")
            .call(d3.axisLeft(y));

          svg.append("text")
            .attr("y", -10)
            .attr("x", -40)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("(%)");

          const xSubgroup = d3.scaleBand()
            .domain(categories)
            .range([0, x.bandwidth()])
            .padding([0.05])

          var temp_color = ["RGB(102, 153, 181)",  "RGB(140, 162, 99)", "RGB(247, 222, 169)"];

          svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(filteredData)
            .join("g")
              .attr("transform", d => `translate(${x(d['證券代碼'])}, 0)`)
            .selectAll("rect")
            .data(function(d) { return categories.map(function(key) { return {key: key, value: d[key]}; }); })
            .join("rect")
              .attr("x", d => xSubgroup(d.key))
              .attr("y", d => y(d.value))
              .attr("rx", "5")
              .attr("ry", "5")
              .attr("width", xSubgroup.bandwidth())
              .attr("height", d => height - y(d.value))
              .attr("fill", (d,i) => temp_color[i]);

          var temp_location = ['translate(-320, -30)', 'translate(-230, -30)', 'translate(-140, -30)']
          // Add legend if needed
          const legend = svg.selectAll(".legend")
              .data(categories)
              .enter().append("g")
              .attr("class", "legend")
              .attr("transform", (d, i) => temp_location[i]);

          legend.append("rect")
              .attr("x", width-100)
              .attr("width", 12)
              .attr("height", 12)
              .style("fill", (d,i) => temp_color[i])
              .style("font-size", "14px")
              .style("font-weight", "600")
          var temp_off = [18, 18, 5]
          legend.append("text")
              .attr("x",(d,i) => width - temp_off[i])
              .attr("y", 6)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(d => d)
              .style("font-size", "14px")
              .style("font-weight", "600");
        }
        
    })
    .catch(error => console.error("Error:", error));

}

function drawgraph5(company1,company2){
  console.log(company1,company2);
  document.getElementById("personnalstability").innerHTML = ""
  var comptodraw = "";
  var drawtwo = false;

  //看看傳進來的公司
  if(company1!="" && company2!=""){
    //畫兩家
    drawtwo = true;
  }else if (company1!="" && company2==""){
    //只畫第一家
    comptodraw = company1;
  }else if (company1=="" && company2!=""){
    //只畫第二家
    comptodraw = company2;
  }else if(company1=="" && company2==""){
    //大家可以回家
    return;
  }

  fetch(`/getlocaldata?dataset=人事穩定度.csv`)
      .then(response => response.json())
      .then(data => {
          // console.log(data);
          const parsedData = JSON.parse(data);
          
          // // set the dimensions and margins of the graph
          const margin = {top: 30, right: 30, bottom: 77, left: 60},
              width = 460 - margin.left - margin.right,
              height = 400 - margin.top - margin.bottom;

          // append the svg object to the body of the page
          const svg = d3.select("#personnalstability")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)

            .append("g")
              .attr("transform", `translate(${margin.left},${margin.top})`);

          
          if (!drawtwo){//只畫單一資料
            //在此可以過濾資料
            let filteredData = parsedData.filter(d => d['證券代碼'].includes(comptodraw));
            filteredData = filteredData.filter(d => d['年月'] == "202212");
            console.log(filteredData);
            const categories = ["3年內董事長異動次數","3年內總經理異動次數","3年內財務主管異動次","3年內發言人異動次數","3年內內部稽核異動次","當月董事長異動次數","當月總經理異動次數","當月財務主管異動次","當月發言人異動次數","當月內部稽核異動次"];
            const values = categories.map(category => filteredData[0][category]);
            
            var ymax = 1;
            if(d3.max(values)>ymax){ymax = d3.max(values)}

            // Set up scales
            const x = d3.scaleBand()
              .domain(categories)
              .range([0, width])
              .padding(0.2);
            
            const y = d3.scaleLinear()
              .domain([0, ymax])
              .range([height, 0]);

            const color =['RGB(83, 158, 190)', 'RGB(103, 187, 105)', 'RGB(105, 136, 171)', 'RGB(249, 205, 147)', 'RGB(247, 189, 172)', 'RGB(234, 176, 125)', 
              'RGB(185, 160, 200)', 'RGB(221, 125, 102)', 'RGB(193, 168, 132)', 'RGB(212, 150, 111)']
            // Create bars
            svg.selectAll("rect")
              .data(values)
              .enter().append("rect")
              .attr("x", (d, i) => x(categories[i]))
              .attr("y", d => y(d))
              .attr("rx", "5")
              .attr("ry", "5")
              .attr("width", x.bandwidth())
              .attr("height", d => height - y(d))
              .attr("fill", (d, i) => color[i])
            
            // Add x-axis
            svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.15em")
            .attr("dy", "0.6em")
            .attr("transform", "rotate(-36)")
            .attr("font-size", "11px")
            .attr("font-weight", "600")
            
            // Add y-axis
            svg.append("g")
              .call(d3.axisLeft(y));

            svg.append("text")
            .attr("y", -10)
            .attr("x", -40)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("(次)");
          }
          else{//我要畫兩張
            let filteredData1 = parsedData.filter(d => d['證券代碼'].includes(company1));
            let filteredData2 = parsedData.filter(d => d['證券代碼'].includes(company2));
            let filteredData = filteredData1.concat(filteredData2);
            filteredData = filteredData.filter(d => d['年月'] == "202212");
            console.log(filteredData);
            const categories = ["3年內董事長異動次數","3年內總經理異動次數","3年內財務主管異動次","3年內發言人異動次數","3年內內部稽核異動次","當月董事長異動次數","當月總經理異動次數","當月財務主管異動次","當月發言人異動次數","當月內部稽核異動次"];

            const groups = filteredData.map(d => d['證券代碼'])
            //console.log(groups)

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

            var ymax = 1;
            if (d3.max(filteredData, d => d3.max(categories, category => d[category]))>ymax){ymax = d3.max(filteredData, d => d3.max(categories, category => d[category]))};

            // Add Y axis
            const y = d3.scaleLinear()
              .domain([0, ymax])
              .range([ height, 0 ]);
            svg.append("g")
              .call(d3.axisLeft(y));

            svg.append("text")
              .attr("y", -10)
              .attr("x", -40)
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("(次)");

            const xSubgroup = d3.scaleBand()
              .domain(categories)
              .range([0, x.bandwidth()])
              .padding([0.05])

            /*const color = d3.scaleOrdinal()
              .domain(categories) // Ensure 'categories' is an array of your category names
              .range(d3.schemeCategory10);*/
            const color =['RGB(83, 158, 190)', 'RGB(103, 187, 105)', 'RGB(105, 136, 171)', 'RGB(249, 205, 147)', 'RGB(247, 189, 172)', 'RGB(234, 176, 125)', 
                    'RGB(185, 160, 200)', 'RGB(221, 125, 102)', 'RGB(193, 168, 132)', 'RGB(212, 150, 111)']

            svg.append("g")
              .selectAll("g")
              // Enter in data = loop group per group
              .data(filteredData)
              .join("g")
                .attr("transform", d => `translate(${x(d['證券代碼'])}, 0)`)
              .selectAll("rect")
              .data(function(d) { return categories.map(function(key) { return {key: key, value: d[key]}; }); })
              .join("rect")
                .attr("x", d => xSubgroup(d.key))
                .attr("y", d => y(d.value))
                .attr("rx", "5")
                .attr("ry", "5")
                .attr("width", xSubgroup.bandwidth())
                .attr("height", d => height - y(d.value))
                .attr("fill", (d,i)=> color[i]);
            
            // Add legend if needed
            const legend = svg.selectAll(".legend")
                .data(categories)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(0,${i * 15})`);

            legend.append("rect")
                .attr("x", width - 12)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", (d,i)=> color[i]);

            legend.append("text")
                .attr("x", width - 18)
                .attr("y", 6)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(d => d)
                .style("font-size", "14px");
          }
          
      })
      .catch(error => console.error("Error:", error));


    
}

  function getallcompany() {
    return fetch(`/getlocaldata?dataset=持股質押.csv`)
        .then(response => response.json())
        .then(data => {
            const parsedData = JSON.parse(data);
            return [...new Set(parsedData.map(d => d['證券代碼']))];
        })
        .catch(error => {
            console.error("Error:", error);
            return []; // Return an empty array in case of an error
        });
}



function existcheck(company1,company2,allcompanies){
    var comptodraw = "";
    var drawtwo = false;
    //看看傳進來的公司
    if(company1!="" && company2!=""){
      //畫兩家
      drawtwo = true;
    }else if (company1!="" && company2==""){
      //只畫第一家
      comptodraw = company1;
    }else if (company1=="" && company2!=""){
      //只畫第二家
      comptodraw = company2;
    }else if(company1=="" && company2==""){
      //大家可以回家
      return;
    }
    //console.log(allcompanies);
    if(!drawtwo){
      let filteredData = allcompanies.filter(d => d.includes(comptodraw));
        if(filteredData.length ==0){
          alert("公司資料輸入錯誤!");
          return false;
        }else{
          return true;
        }
    }else{
      let filteredData1 = allcompanies.filter(d => d.includes(company1));
      let filteredData2 = allcompanies.filter(d => d.includes(company2));
      if(filteredData1.length!=0 && filteredData2.length!=0){
        return true;
      }else if (filteredData1.length!=0 && filteredData2.length==0){
        alert("公司2資料輸入錯誤!");
        return false;
      }else if (filteredData1.length==0 && filteredData2.length!=0){
        alert("公司1資料輸入錯誤!");
        return false;
      }else if (filteredData1.length==0 && filteredData2.length==0){
        alert("公司1,2資料輸入錯誤!");
        return false;
      }
    }
  
}