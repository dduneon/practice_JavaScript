function Navigator(uiBtnPrevMonthId, uiBtnNextMonthId, uiBtnCurrentMonthId){
    'use strict'

    let year = null;
    let month = null;
    
    this.uiBtnPrevMonthId = uiBtnPrevMonthId;
    this.uiBtnNextMonthId = uiBtnNextMonthId;
    this.uiBtnCurrentMonthId = uiBtnCurrentMonthId;

     //init;
    (function(){
        // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get
        const searchParam = new URLSearchParams(document.location.search);
        year = searchParam.get("year");
        month = searchParam.get("month");
        const today = new Date();

        // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear
        if(year == null){
            year = today.getFullYear();
        }

        // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth
        if(month == null){
            //month는 0부터 시작
            month = today.getMonth() + 1;
        }
    })();

    //button event 설정 , DOMContentLoaded 시점에 ..
    window.addEventListener("DOMContentLoaded",function(){

        let btnPrevMonth = document.getElementById(uiBtnPrevMonthId);
        let btnNextMonth = document.getElementById(uiBtnNextMonthId);
        let btnCurrentMonth = document.getElementById(uiBtnCurrentMonthId);
        
        if(btnPrevMonth == null){
            throw new Error("이전 버튼이 존재하지 않습니다.!");
        }
        if(btnNextMonth == null){
            throw new Error("다음 버튼이 존재하지 않습니다.!");
        }
        if(btnCurrentMonth == null){
            throw new Error("이전 버튼이 존재하지 않습니다.!");
        }
        
        //버튼 이벤트 등록
        //이전
        btnPrevMonth.addEventListener("click",function(){
            if(month == 1 ){
                month = 12;
                year = parseInt(year) - 1;
            }else{
                month = month - 1;
            }
            _navigate(year,month);
        });
        //다음
        btnNextMonth.addEventListener("click",function(){
            if(month == 12 ){
                month = 1;
                year = parseInt(year) + 1;
            }else{
                month = parseInt(month) + 1;
            }
            _navigate(year,month);
        });
        //오늘
        btnCurrentMonth.addEventListener("click",function(){
            const today = new Date();
            year = today.getFullYear();
            month = today.getMonth()+1;
            _navigate(year, month);
        });
    });

    function _navigate(targetYear,targetMonth){
        targetYear = _convertToZeroMonthAndDay(targetYear);
        targetMonth = _convertToZeroMonthAndDay(targetMonth);
        location.href = "./index.html?year=" + targetYear + "&month=" + targetMonth;
    }

    function _convertToZeroMonthAndDay(d){
        d = parseInt(d);
        if(d<10){
            d = "0" + d;
        }
        return d;
    }

    return {
        getYear : function(){
            return year;
        },
        getMonth : function(){
            return _convertToZeroMonthAndDay(month);
        },
        convertToZeroMonthAndDay : function(d){
            return _convertToZeroMonthAndDay(d);
        }
    }

}//end navigator