'use strict';

var request = function (url, data) {
  return $.get(url, {json: JSON.stringify(data)})
}

var locations = [];
var getLocation = function(data)
{
  var reLocation = /javascript:doGoogle\(.+(?=\))/;

  var result = data.match(reLocation);
  var m = result[0].substring(result[0].indexOf('(')+1);

  var lonLat = m.split(',');

  console.log(lonLat);
}


var singleRequest = false;

// eg. 1-1-007-028-0000
var reTMK = /\d-\d-\d\d\d-\d\d\d-0000/g;
function matchTMK(text)
{
  var requests = [];

  if(singleRequest) // test with first key
  {
    return;
  }

  var match;
  while (match = reTMK.exec(text))
  {
    var tmk = match[0].replace(/-/g, '');

    //var mapURL = "http://qpublic9.qpublic.net/qpmap4/map.php?county=hi_hawaii&parcel=";
    //var tabDataURL = "http://qpublic9.qpublic.net/hi_hawaii_display.php?county=hi_hawaii&KEY=";

    var viewAsURL = ["http://qpublic9.qpublic.net/cgi-bin/mapserv60?_dc=1434658551034&id=1434658550183&county=hi_hawaii&savequery=true&map=%2Fqpub1%2Fmaps%2Fhi%2Fhawaii%2Fparcel4.map&mode=itemquery&qitem=QPID&qstring=",
                  tmk,
                  "&qformat=parcel_as_html&qlayer=qparcel"];

    requests.push(viewAsURL.join(""));
    singleRequest = true;
    break;
  }

  $.when($.map(requests, function (_request, i) {
    return request.call($, _request)
  }))
  .always(function (arr) {
    $.each(arr, function (key, value) {
      value.then(
        function (data, textStatus, jqxhr) {
          console.log(data, textStatus, jqxhr);

          getLocation(data);
        },
        function (jqxhr, textStatus, errorThrown) {
          console.log(jqxhr, textStatus, errorThrown)
        })
      })
    })

  }

  PDFJS.getDocument('data/TaxSaleList6.12.15.pdf').then(function(pdf) {

    var maxPages = pdf.pdfInfo.numPages;
    for (var j = 1; j <= maxPages; j++) {
      var page = pdf.getPage(j);

      // the callback function - we create one per page
      var processPageText = function processPageText(pageIndex) {
        return function(pageData, content) {
          return function(text) {
            var str = "";
            for (var i = 0; i < text.items.length; i++) {
              str += text.items[i].str + " ";
            }
            matchTMK(str);
          }
        }
      }(j);

      var processPage = function processPage(pageData) {
        var content = pageData.getTextContent();

        content.then(processPageText(pageData, content));
      }

      page.then(processPage);
    }

  });
