'use strict';

PDFJS.getDocument('data/TaxSaleList6.12.15.pdf').then(function(pdf) {

  var maxPages = pdf.pdfInfo.numPages;
  for (var j = 1; j <= maxPages; j++) {
    var page = pdf.getPage(j);

    // the callback function - we create one per page
    var processPageText = function processPageText(pageIndex) {
      return function(pageData, content) {
        return function(text) {
          // bidiTexts has a property identifying whether this
          // text is left-to-right or right-to-left
          for (var i = 0; i < text.bidiTexts.length; i++) {
            str += text.bidiTexts[i].str;
          }

          if (pageData.pageInfo.pageIndex ===
            maxPages - 1) {
              // later this will insert into an index
              console.log(str);
            }
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
