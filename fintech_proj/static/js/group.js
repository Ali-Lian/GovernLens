function getDataInfo(stockSymbol, num){
    fetch(`/getInfo`)
        .then(response => response.json())
        .then(data => {
            // 清除之前畫的圖
            var pre = document.getElementById("infoArea" + num);
            if(pre){
                pre.parentNode.removeChild(pre);
            }

            d3.select("#info" + num)
                .append("div")
                    .attr("id", "infoArea" + String(num))

            // 把蒐集到的資料編譯為中文(本來是unicode)
            var dataTrans = JSON.parse(data);

            // 處理資料
            dataTrans = dataTrans.filter((d => d['代號'] == stockSymbol))
            console.log(dataTrans[0])
            var company = dataTrans[0]["代號"] + " " + dataTrans[0]["名稱"];
            var industry = dataTrans[0]["TEJ產業名"];
            var mainBusiness = "<ol><li>" + dataTrans[0]["主要經營業務1"] + "</li>";
            if(dataTrans[0]["主要經營業務2"] != null){
                mainBusiness = mainBusiness + "<li>" + dataTrans[0]["主要經營業務2"] + "</li>";
            }
            if(dataTrans[0]["主要經營業務3"] != null){
                mainBusiness = mainBusiness + "<li>" + dataTrans[0]["主要經營業務3"] + "</li>";
            }
            mainBusiness = mainBusiness + "</ol>"
            var businessPer = dataTrans[0]["主要產品比重"];
            var capital = dataTrans[0]["實收資本額(元)"];

            var displayContainer = document.getElementById('infoArea' + String(num));
            var divElement = document.createElement('div');
            divElement.style.padding = "20px"
            divElement.innerHTML = '<h2>' + company + '</h2>' +
                                   '<ul><li>產業別 | ' + industry + '</li>' +
                                   '<li>主營業務 | <br>' + mainBusiness + '</li>' +
                                   '<li>主要產品比重 | <br>' + businessPer + '</li>' +
                                   '<li>實收資本額 | ' + capital + '</p></ul>';
            displayContainer.appendChild(divElement);
        })
}