var cheerio = require('cheerio')
var request = require('request');


var parcelNumber = '240061270000';

// Oahu
// http://qpublic9.qpublic.net/hi_honolulu_search.php?search=parcel

// Maui (including Molokai)
// http://qpublic9.qpublic.net/hi_maui_search.php?county=hi_maui&search=parcel

// Kauai
// http://qpublic9.qpublic.net/ga_search_dw.php?county=hi_kauai&search=parcel

var url = 'http://qpublic9.qpublic.net/hi_hawaii_display.php?county=hi_hawaii&KEY=' + parcelNumber;
request(url, function(err, resp, body) {
  if (err)
  throw err;
  $ = cheerio.load(body);

  var keys = $('table tr td[class=owner_header]').map(function() {
    return $(this).text().trim();
  });

  var values = $('table tr td[class=owner_value]').map(function() {
    return $(this).text().trim();
  });

  for(var i = 0 ; i < keys.length ; i++){
    console.log(keys[i] + ': ' + values[i]);
  }
});
