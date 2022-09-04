module.exports={
    checkEndTime:function (aa, bb) {
        var startTime = aa;
        var start = new Date(startTime.replace("-", "/").replace("-", "/"));
        var endTime = bb;
        var end = new Date(endTime.replace("-", "/").replace("-", "/"));
        if (end < start) {
            return false;
        }
        return true;
    },

    getDaysBetween:function(date1,date2){
        var  startDate = Date.parse(date1);
        var  endDate = Date.parse(date2);
        if (startDate>endDate){
            return 0;
        }
        if (startDate==endDate){
            return 1;
        }
        var days=(endDate - startDate)/(1*24*60*60*1000);
        return  days;
    },

    addDate:function (date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      var month = d.getMonth() + 1;
      var day = d.getDate();
    //   if (month < 10) {
    //       month = "0" + month;
    //   }
    //   if (day < 10) {
    //       day = "0" + day;
    //   }
      var val = d.getFullYear() + "/" + month + "/" + day;
      return val;
}






}
