var assert    = require('assertthat'),
mysql         = require('mysql'),
request       = require('request'),
jsdom         = require("node-jsdom"),
Promise       = require('promise');

var ultimateYear = null,
ultimateMonth = null;
// print process.argv
process.argv.forEach(function (val, index, array) {
  // console.log(index + ': ' + val);
  if (index== 2)
    ultimateYear = val;
  if (index== 3)
    ultimateMonth = val;
});

//MaraiDB Part
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'wimp',
  password : 'd7zwkDytjIHLxte0',
  database : 'wimp'
});

connection.connect(function(err) {
  if (err) throw err;
});


//Set Date
var today = new Date();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
var yearCnt = yyyy - 2008;

//Main importer
var importWimpMonth = function(year, month) {
  jsdom.env({
    url: "http://www.wimp.com/archives/"+year+"/"+month+"/index.html",
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (err, window) {
      var $ = window.$;
      var expCnt = 154,
      actCnt = 0,
      duplicateCnter = 0,
      successCnter = 0, 
      promises = [];

      $(".latest-third").each(function(){
        actCnt++;
        var lnk = $(this).children("div").children("a").attr("href");
        var dt = new Date($(this).children("div").children(".date").html());
        var post  = {
          link: lnk, 
          date: dt
        };
        // console.log(post);
        var promise = new Promise(function(resolve, reject) {
          var innerCnt = 0;
          connection.query('INSERT INTO wimp SET ?', post, function(err, result) {
            if (err) {
              if (err.code === 'ER_DUP_ENTRY')
                { resolve(err.code+ " " + year + " " + month); duplicateCnter++; }
              else
                { throw err; }
            } 
            else
              { resolve(null); successCnter++; }

            if (actCnt == duplicateCnter+successCnter)
            { 
              console.log("Found " + duplicateCnter + " duplicate(s)! Total " +actCnt + " in " + year  + "/" + month); 
              if (successCnter != 0)
                console.log("Saved "+ successCnter + " new Entrie(s)!");
              console.log("---------------"); 
            }
          });
        });
        promises.push(promise);
      });


      var result = Promise.all(promises);
      result.then(function(data) {
        
        // console.log(data);
        // var array_elements = data;
        // array_elements.sort();

        // var current = null;
        // var cnt = 0;
        // for (var i = 0; i < array_elements.length; i++) {
        //   if (array_elements[i] != current) {
        //     if (cnt > 0) {
        //       console.log(current + ' comes --> ' + cnt + ' times<br>');
        //     }
        //     current = array_elements[i];
        //     cnt = 1;
        //   } else {
        //     cnt++;
        //   }
        // }
        // if (cnt > 0) {
        //   console.log(current + ' comes --> ' + cnt + ' times');
        if (ultimateYear != null && ultimateMonth != null) {
          console.log("Finished " + ultimateYear + "/" + ultimateMonth);
          connection.end();
        }
      });


      console.log("Started Year: " + year + " Month: " + month);
      console.log("---------------");
      // Testcase: 
      if (year == 2016 && month == 1) 
      {
        console.log("<" + expCnt + "> = <" + actCnt +">");
        assert.that(expCnt).is.equalTo(actCnt);
        console.log("---------------");   
      }
    }
  });
}



if (ultimateYear != null && ultimateMonth != null){
  console.log("Starting to import only once: " + ultimateYear + "/" + ultimateMonth);
  importWimpMonth(ultimateYear,ultimateMonth);
}
else
{
  console.log("Please execute this with Arguments: yyyy mm");
  console.log("Example: node importWimp.js 2016 02")

}


// Warning!! this is very fast since its running async, but it can break ramdomly and 
// there is no easy way to kill the sql connection
// so please only exectute manualy
var importAll = function (){
  // Loop over every needed Month (12.2008 - current Month)
  for (var i = yearCnt; i >= 0; i--) {
    var curentYear = yyyy-i,
    month = curentMonth = 1;

    while (month <= 12) {
      //Start Month on: 12.2008
      if ((i == yearCnt) && (month < 12)) 
        { month++; continue; }

      if(month<10) 
        { curentMonth = '0'+month; }
      else 
        { curentMonth = month; }
       // var promiseresolve = new Promise(function(resolve, reject) {
        importWimpMonth(curentYear,curentMonth);
       // });
       // loopPromises.push(promise);
      //Break on Curent year and month 
      if ((i == 0 ) && (month >= mm)) 
        { break; }
      month++; 
    }
  };
};
