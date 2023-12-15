const flightScheduleApi = (function(){
    
    'use strict';
    const SERVICE_KEY = "oqWzAGWsxHR/cre4r5C2TJD0qw9ldrsGzxIAnDQRIvb31Gt6m/EDMUhczdZ5gIFINhj/QBbAVRTnFuTnBMOJyw==";

    //운행스케줄 테스트
    const api = new Object();
    
    async function getAirlineList(){
        let url = 'http://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getAirmanList'; /*URL*/
        let queryParams = '?' + encodeURIComponent('serviceKey') + '='+SERVICE_KEY; /*Service Key*/
        queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /**/
        url+=queryParams;

        const response = await fetch(url);
        const json = await response.json();

        if(response.ok){
            const items = json.response.body.items.item;
            return (items == null || items == undefined) ? [] : items;
        }else{
            throw new Error("error: 항공사 리스트");
        }
    }

    api.getAirportList = async function(){
        let url = "http://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getArprtList";
        let queryParams = '?' + encodeURIComponent('serviceKey') + '='+SERVICE_KEY; /*Service Key*/
            queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /**/
            url+=queryParams;
        const response  =  await fetch(url);
        const json = await response.json();
        if(response.ok){
            const items = json.response.body.items.item;
            return (items == null || items == undefined) ? [] : items;
        }else{
            throw new Error("error : 공항 조회")
        }
    }

    /* 
        * @param {*} depAirportId  출발공항 아이디
        * @param {*} arrAirportId  도착공항 아이디
        * @param {*} depPlandTime  출발시간 : 20230321
        * @param {*} airlineId     항공사 아이디
    */
    //getFlightSchedule("NAARKJJ","NAARKPC","20201202","AAR");
    async function getFlightSchedule(depAirportId,arrAirportId,depPlandTime,airlineId){
        let url = "http://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getFlightOpratInfoList";
        let queryParams = "?serviceKey="  + encodeURIComponent(SERVICE_KEY);
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
        queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /**/
        queryParams += '&' + encodeURIComponent('depAirportId') + '=' + encodeURIComponent(depAirportId); /**/
        queryParams += '&' + encodeURIComponent('arrAirportId') + '=' + encodeURIComponent(arrAirportId); /**/
        queryParams += '&' + encodeURIComponent('depPlandTime') + '=' + encodeURIComponent(depPlandTime); /**/
        queryParams += '&' + encodeURIComponent('airlineId') + '=' + encodeURIComponent(airlineId); /**/
        url = url + queryParams;
        console.log(url);

        const response = await fetch(url);
        const json = await response.json();

        if(response.ok){
            const items = json.response.body.items.item;
            if(items == null || items == undefined){
                return [];
            }

            for (const item of items) {
                item.economyCharge = item.economyCharge == undefined ? "" : item.economyCharge;
                item.prestigeCharge = item.prestigeCharge == undefined ? "" : item.prestigeCharge;
            }
            return items;
        }else{
            throw new Error("error : 스케줄 조회");
        }
    }

    api.search=async function(depAirportId,arrAirportId,depPlandTime){
        const airlineList = await getAirlineList();

        //조회로직 실행
        depPlandTime = depPlandTime.replaceAll("-","");
        const promiseList = [];
        let items = [];

        for (const airline of airlineList) {
            const response = await getFlightSchedule(depAirportId,arrAirportId,depPlandTime,airline.airlineId);
            items.push(... response);
        }
        //출발 시간으로 내림차순 정렬
        items.sort(function(a,b){
            if(a.arrPlandTime > b.arrPlandTime){
                return 1;
            }
            return -1;
        });
        return items;
    }

    function apiErrorCheck(responseText){
        if(responseText.includes("OpenAPI_ServiceResponse")){
            throw new Error(responseText);
        }
    }

    return api;
})();

window.addEventListener("DOMContentLoaded",async function(){
    'use strict'
    
    const departureId = document.getElementById("departureId");
    const arrivalId = document.getElementById("arrivalId");
    
    //비행날짜
    const plandDate = document.getElementById("plandDate");
    plandDate.value = new Date().toISOString().substring(0,10);
    

    const airportList = await flightScheduleApi.getAirportList();
    console.log(airportList);
    for (const item of airportList) {
        const option = document.createElement("option");
        option.value=item.airportId;
        option.text=item.airportNm;
        const arrivalOption = option.cloneNode(true);
        if(arrivalOption.text=== '제주'){
            arrivalOption.selected=true;
        }
        arrivalId.append(arrivalOption);
        if(option.text === '광주'){
            option.selected=true;
        }
        departureId.append(option);
    }

    const validateForm = function(form){
        const departureId = form["departureId"];
        const arrivalId = form["arrivalId"];
        const departureIdValue  = departureId.options[departureId.selectedIndex].value;
        const arrivalIdValue  = arrivalId.options[arrivalId.selectedIndex].value;
        console.log("departureIdValue:" + departureIdValue);
        console.log("arrivalIdValue:" +  arrivalIdValue);
        if(departureIdValue == arrivalIdValue){
            alert("[출발]공항 , [도착]공항 다르게 선택해주세요!");
            return false;
        }
        return true;
    };

    const findForm = document.getElementById("find-form");
    
    findForm.addEventListener("submit",async function(event){
        event.preventDefault();
        if(validateForm(event.target)==false){
            return;
        }

        //schedule 조회
        try{
            const depPlandTime = document.getElementById("plandDate").value;
            const items = await flightScheduleApi.search(departureId.value,arrivalId.value,depPlandTime);
            displaySearchResult(items);
        }catch(e){
            alert(e);
        }
    });
    
});

function displaySearchResult(items){
    console.log(JSON.stringify(items));

    const scheduleTbl = document.getElementById("schedule-tbl");
    const tbody = scheduleTbl.getElementsByTagName("tbody")[0];

    while(tbody.firstChild){
        tbody.firstChild.remove();
    }

    for(let i=0; i<items.length; i++){

        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");
        const td7 = document.createElement("td");
        const td8 = document.createElement("td");


        //항공편명	vihicleId
        td1.innerText=items[i].vihicleId;
        //항공사명	airlineNm
        td2.innerHTML=items[i].airlineNm;
        //출발시간	depPlandTime
        td3.innerText=convertDate(items[i].depPlandTime);
        //도착시간	arrPlandTime
        td4.innerText=convertDate(items[i].arrPlandTime);
        
        //일반석운임	economyCharge
        https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
        td5.innerText=new Intl.NumberFormat().format(items[i].economyCharge);
        //비즈니스석운임	prestigeCharge
        td6.innerText=new Intl.NumberFormat().format(items[i].prestigeCharge);
        //출발공항	depAirportNm
        td7.innerText=items[i].depAirportNm;
        //  도착공항	arrAirportNm
        td8.innerText=items[i].arrAirportNm;

        tr.append(td1);
        tr.append(td2);
        tr.append(td3);
        tr.append(td4);
        tr.append(td5);
        tr.append(td6);
        tr.append(td7);
        tr.append(td8);
        tbody.append(tr);
    }
}

function convertDate(str){
    str = str.toString();
    //202303221125 -> 2023 03 22 11:25
    return str.substring(0,4) 
            + "-" + str.substring(4,6)
            + "-" + str.substring(6,8) 
            + " " + str.substring(8,10) 
            + ":" + str.substring(10,12);
}
