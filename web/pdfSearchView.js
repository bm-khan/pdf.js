  // JavaScript Document
  
  var isSearchInitialized = false;
  var searchObj = {};
  var searchPageCount = 0;
  var searchResultArray = [];
  var searchFoundCount = -1;
  
  var pdfSearchView = {
	  fnActivatePdfSearch: function () {
		  console.log("fnActivatePdfSearch");
		  isSearchInitialized = true;
		  $('#searchBtn').unbind('click').click(function (evt) {
			  pdfSearchView.fnRunPdfSearch($('#searchInput').val());
		  });
		  $('#prevBtn').unbind('click').click(function (evt) {
			  pdfSearchView.fnNavigatePrevSearch();
		  });
		  $('#nextBtn').unbind('click').click(function (evt) {
			  pdfSearchView.fnNavigateNextSearch();
		  });
		  $('#searchInput').unbind('keydown').keydown(function (evt) {
			  if(evt.keyCode == 13)
				  pdfSearchView.fnRunPdfSearch($('#searchInput').val());
		  });
	  },
  
	  fnRunPdfSearch: function (_stext) {
		  console.log("fnRunPdfSearch "+_stext);
		  var findPromise = new Promise(function(resolve, reject) {
			  pdfBibViewer.findController.executeCommand('find', {
				  caseSensitive: false,
				  findPrevious: false,
				  highlightAll: true,
				  phraseSearch: true,
				  query: _stext
			  });
			  setTimeout(function() { resolve("done!")}, 2000);
		  });
  
		  findPromise.then(
			  function(result) {
				  pdfBibSearch.fnGenerateSearchResult();
			  },
			  function(error) {
				  alert(error) // doesn't run);
			  });
	  },
  
	  fnGenerateSearchResult: function() {
		  searchFoundCount = -1;
		  console.log("fnGenerateSearchResult - pdfBibViewer.findController.pageMatches.length "+pdfBibViewer.findController.pageMatches.length)
		  for(var s = 0; s < pdfBibViewer.findController.pageMatches.length; s++)
		  {
			  console.log("pdfBibViewer.findController.pageMatches[s].length "+s+" - "+pdfBibViewer.findController.pageMatches[s].length)
			  if(pdfBibViewer.findController.pageMatches[s].length > 0)
			  {
				  for(var ss = 0; ss < pdfBibViewer.findController.pageMatches[s].length;ss++)
				  {
					  searchFoundCount++;
					searchResultArray[searchFoundCount] = [];
					searchResultArray[searchFoundCount].searchId = searchFoundCount;
					searchResultArray[searchFoundCount].pageIdx = s;
					searchResultArray[searchFoundCount].matchIdx = ss;
					searchResultArray[searchFoundCount].matchPos = pdfBibViewer.findController.pageMatches[s][ss];
					searchResultArray[searchFoundCount].pageLabel = "page " + s;
					  var strRangeS = (Number(pdfBibViewer.findController.pageMatches[s][ss]) - 50);					
					  strRangeS = (strRangeS < 0) ? 0 : strRangeS;
					  var strRangeE = 200;
					  var searchStr = pdfBibViewer.findController.pageContents[s].substr(strRangeS, strRangeE);
					  searchResultArray[searchFoundCount]['pageContent'] = " ..."+searchStr+"... ";
					  console.log("ss "+ss+" |searchFoundCount"+searchFoundCount+"|"+searchStr);
				  }
			  }
		  }
		  pdfBibSearch.fnShowPDFSearchResults($('#searchInput').val());
	  },
  
	  fnNavigatePrevSearch: function() {
		  pdfBibViewer.findController.state.findPrevious = true;
		  pdfBibViewer.findController._nextMatch();
	  },
  
	  fnNavigateNextSearch: function() {
		  pdfBibViewer.findController.state.findPrevious = false;
		  pdfBibViewer.findController._nextMatch();
	  },
  
	  fnShowPDFSearchResults: function(searchterm) {
		  $('#searchResult, .arrow-up').show();
		  $('#searchResult').find('ul').html('');
		  if (searchResultArray.length > 0) {
			  prevSearchResult = true;
			  prevSearchTerm = searchterm;
			  for (var i=0;i<searchResultArray.length;i++) {
				  var resultrow = $("<li>");
				  $(resultrow).append("<span class='pgnum'></span>");
				  $(resultrow).append("<span class='pgcontent'></span>");				
				  var previewNum = Number(searchResultArray[i].pageIdx);
				$(resultrow).find('.pgnum').html("page " + previewNum);
				$(resultrow).find('.pgcontent').html(searchResultArray[i].pageContent);
				$(resultrow).attr('bibpgnum', previewNum);
				$(resultrow).attr('matchidx', searchResultArray[i].matchIdx);
				$(resultrow).attr('matchpos', searchResultArray[i].matchPos);
				$(resultrow).css('cursor', 'pointer');
				  $(resultrow).click(function(e) {
					  pdfBibViewer.findController.selected = { matchIdx: Number($(this).attr("matchidx")),
                                                              pageIdx: Number($(this).attr("bibpgnum")) };
					  pdfBibViewer.findController._updateMatch();
				  });
				  $('#searchResult').find('ul').append(resultrow);
				  $('#searchresultdesc').find('span').html("Showing results from "+pdfBibViewer.pagesCount+" pages.");
				  resizeDataPopup();
			  }
		  } else {
			  showSearchStatusMessage("No result found like, <span class='hl'>\""+searchterm+"\"</span>, try another word!");
		  }
	  }
  }
  
  
