function getDataNews(stockSymbol, num){

    fetch(`/getNews?symbol=${stockSymbol}`)
        .then(response => response.json())
        .then(data => {
            // 清除之前畫的圖
            var pre = document.getElementById("newsArea" + num);
            if(pre){
                pre.parentNode.removeChild(pre);
            }

            d3.select("#News" + num)
                .append("div")
                    .attr("id", "newsArea" + String(num))
                    
            // 把蒐集到的資料編譯為中文(本來是unicode)
            var dataTrans = JSON.parse(data);

           
            var dataCleaned = {
                news_cat: [],
                news_subcat: [],
                date:[],
                content:[]
            };
            
            // 整理事件，依照序號前8碼區別
            days = Array.from(new Set(dataTrans.map(d => d["序號"])))
            dataTrans.forEach(element => {
                element["事件別"] = element["序號"].substring(0, 8);
            });
            
            // 事件別
            eventNum = Array.from(new Set(dataTrans.map(d => d["事件別"])));

            // 按照事件別找資料
            eventNum.forEach(element => {
                newsMatch = dataTrans.filter(d => d["事件別"] === element);
                // 年月日
                dataCleaned["date"].push(newsMatch[0]["年月日"]);
                // 事件小類
                dataCleaned["news_subcat"].push(newsMatch[0]["事件小類"]);

                //事件內容
                content = ""
                newsMatch.forEach(d => {
                    content = content.concat(d["事件內容"]);
                });
                dataCleaned["content"].push(content)
                // 編號(事件別)
                dataCleaned["news_cat"].push(newsMatch[0]["事件別"])
                
                
            });
             
            // 印出來
            var displayContainer = document.getElementById("newsArea" + String(num));
            var news = document.getElementById("News" + String(num));
            var classList = news.classList;
            // var existNews = document.getElementById('noNews'+ String(num));
            if(eventNum.length == 0 ){
                
                var divElement = document.createElement('div');
                divElement.setAttribute("id", "noNews" + String(num));
                divElement.style.padding = "10px"
                divElement.innerHTML = '<p>無公司治理相關新聞</p>';
                displayContainer.appendChild(divElement);
                classList.add("centered");
            }
            else{
                // 循环遍历数据，创建并添加元素到页面中
                
                for (var i = 0; i < dataCleaned.news_cat.length; i++) {
                    var divElement = document.createElement('div');
                    divElement.innerHTML = '<div class="newsTitle">新聞類型 | </div><div class="newsTitleDetail">' + dataCleaned.news_subcat[i] + '</div><br>' +
                                           '<div class="newsTime">時間 | </div><div class="newsTimeDetail">' + String(dataCleaned.date[i]) + '</div><br>' +
                                           '<div class="newsContent">內容 | </div><div class="newsContentDetail">' + String(dataCleaned.content[i]) + '</div><hr>';
                    displayContainer.appendChild(divElement);
                }
                classList.remove("centered");
            }
            
                        
            

        })
}
