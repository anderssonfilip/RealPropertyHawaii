'use strict';

var request = function (url, data) {
  return $.get(url, {json: JSON.stringify(data)})
}

var requests = [
  //  ["/echo/json/", "success1"]
  ["http://qpublic9.qpublic.net/hi_hawaii_display.php?county=hi_hawaii&KEY=", 921180430000]
  //, ["/echo/jsons/", ["error1"]]
  //  , ["/echo/json/", ["success2"]]
  //, ["/echo/json/", ["error2"]]
  //  , ["/echo/json/", ["success3"]]
];

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
    requests.push(["http://qpublic9.qpublic.net/hi_hawaii_display.php?county=hi_hawaii&KEY=", tmk]);
    singleRequest = true;
    break;
  }

  $.when($.map(requests, function (_request, i) {
    return request.apply($, _request)
  }))
  .always(function (arr) {a
    $.each(arr, function (key, value) {
      value.then(
        function (data, textStatus, jqxhr) {
          console.log(data, textStatus, jqxhr);
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
