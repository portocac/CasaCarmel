  // Array of info objects, one for each widget (w/ photos) on a page
  var photoInfo = new Array(); 
  
  function setupPhoto(photosObj, photoIndex, uniq)
  {
    // Add this widget's photo data to the photoInfo array
    var size = photoInfo.length;
     
    photoInfo[size] = new Object();
    photoInfo[size].uniq = uniq; //unique key for this widget's data
    photoInfo[size].index = photoIndex; //index of current photo shown
    photoInfo[size].photos = new Array(); //list of photo URLs
    
    // Convert comma-sep list of photo data into array
    // (data may have internal commas so need to split on "http";
    // ignore first entry which is opening bracket only)
    var tmp = photosObj.split("http");
    for (var i=1; i < tmp.length; i++)
    {
      var tmpUrl = "http" + tmp[i];
      // Clean up trailing brackets, commas and spaces
      if (i == tmp.length-1)
      {
        tmpUrl = tmpUrl.substring(0,tmpUrl.length-1);
      }
      if (tmpUrl.substring(tmpUrl.length-2) == ", ") // remove trailing comma
      {
        tmpUrl = tmpUrl.substring(0,tmpUrl.length-2);
      }
      if (tmpUrl.substring(tmpUrl.length-1) == ",") // remove trailing comma
      {
        tmpUrl = tmpUrl.substring(0,tmpUrl.length-1);
      }
      photoInfo[size].photos[i-1] = tmpUrl;
    }
  }
  
  function clearPhotoInfo(uniq)
  {
    // Get correct info object for this uniq
    var curr = -1;
    for (var i=0; i < photoInfo.length; i++)
    {
      if (photoInfo[i].uniq == uniq.value)
      {
        curr = i;
        break;
      }
    }
    if (curr != -1)
    {
      // Clear out the object
      photoInfo[curr] = new Object();
      photoInfo[curr].uniq = -1; 
      photoInfo[curr].index = -1; 
      photoInfo[curr].photos = new Array(); 
    }
  }
  
  function changePhoto(increment, uniq, photoIndex, photosObj)
  {
    // Get correct info object for this uniq
    var curr = -1;
    for (var i=0; i < photoInfo.length; i++)
    {
      if (photoInfo[i].uniq == uniq)
      {
        curr = i;
        break;
      }
    }
    if (curr == -1)
    {
      // This widget's photos haven't been stored yet
      setupPhoto(photosObj, photoIndex, uniq);
      curr = photoInfo.length - 1;
    }

    // Add increment to previous index, cycle past
    // beginning/end of photos if necessary
    var tmpIndex = photoInfo[curr].index + increment;
    if (tmpIndex >= photoInfo[curr].photos.length)
    {
      tmpIndex = 0;
    }
    else if (tmpIndex < 0)
    {
      tmpIndex = photoInfo[curr].photos.length - 1;
    }
    photoInfo[curr].index = tmpIndex;
    
    // Get photo info for new index; includes URL and
    // possibly photo attribution string
    var photoFields = photoInfo[curr].photos[tmpIndex];
    if (photoFields == null)
    {
      return;
    }
    var photoFieldArr = photoFields.split("!");
    if (photoFieldArr == null)
    {
      return;
    }
    
    // Set the new photo URL on the page
    var photoUrl = photoFieldArr[0];
    var pImg = document.getElementById("photoImage" + photoInfo[curr].uniq);
    if (pImg != null)
    {
      pImg.setAttribute("src", photoUrl);
    }

    // Set the new photo attrib string on the page, if provided
    if (photoFieldArr.length > 1)
    {
      var photoAttrib = photoFieldArr[1];
      var pAttrib = document.getElementById("photoAttribution" + photoInfo[curr].uniq);
      if (pAttrib != null)
      {
        var attribElem = document.createTextNode(photoAttrib);
        while (pAttrib.firstChild != null)
        {
          pAttrib.removeChild(pAttrib.firstChild);
        }
        pAttrib.appendChild(attribElem);
      }
    }
        
  }
  
  function doPopup(url, wname)
  {
    if (wname == null || wname == '')
    {
      wname='widgetPopupWin';
    }
    popwindow = window.open(url, wname, 'width=600,height=600,scrollbars=yes');
    if (window.focus)
    {
      popwindow.focus();
    }
  }
  
  function doPopupWithSize(url, wname, width, height)
  {
    if (wname == null || wname == '')
    {
      wname='widgetPopupWin';
    }
    popwindow = window.open(url, wname, 'width=' + width + ',height=' + height + ',scrollbars=1');
    if (window.focus)
    {
      popwindow.focus();
    }
  }
  
  function doNewTAWindow(url, wname)
  {
    if (wname == null || wname == '')
    {
      wname='widgetNewTaWin';
    }
    return window.open(url, wname, 'toolbar=1,resizable=1,menubar=1,location=1,status=1,scrollbars=1,width=800,height=600');
  }
  
  function doSort(sortValue)
  {
    var reviewElems = getElementsByName_iefix("dd", "sortableReview");
    if (reviewElems == null || reviewElems.length <= 1)
    {
      return; // nothing to sort
    }
    var arrToSort = new Array();
	
    for (var i=0; i < reviewElems.length; i++)
    {
      var currId = reviewElems[i].id.split("-");
      if (sortValue == null || sortValue.indexOf("date") == 0)
      {
        arrToSort.push(currId[1] + "-" + currId[0] + "-" + currId[2]);
      }
      else 
      {
        arrToSort.push(currId[2] + "-" + currId[0] + "-" + currId[1]);
      }
    }
    arrToSort.sort(); // sorts ascending
    if (sortValue.indexOf("desc") > -1)
    {
      arrToSort.reverse();
    }
	
    var newContainer = document.createElement("div");

    for (var i=0; i < arrToSort.length; i++)
    {
      var currIdInfo = arrToSort[i].split("-");
      var elemId = "";
      if (sortValue == null || sortValue.indexOf("date") == 0)
      {
        elemId=currIdInfo[1] + "-" + currIdInfo[0] + "-" + currIdInfo[2];
      }
      else
      {
        elemId=currIdInfo[1] + "-" + currIdInfo[2] + "-" + currIdInfo[0];
      }
      var revElem = document.getElementById(elemId);
      newContainer.appendChild(revElem);
    }
    var container = document.getElementById("reviewsContainer");
    while (container.firstChild != null)
    {
      container.removeChild(container.firstChild);
    }
    container.appendChild(newContainer);
  }

  function getElementsByName_iefix(tag, name) 
  {
     var elem = document.getElementsByTagName(tag);
     var arr = new Array();
     for(i = 0,iarr = 0; i < elem.length; i++) {
          att = elem[i].getAttribute("name");
          if(att == name) {
               arr[iarr] = elem[i];
               iarr++;
          }
     }
     return arr;
  }
  
  function expandReview(index, idPrefix, isExpand)
  {
    var shortDisplay = "none"; // default to "more"
    var fullDisplay = "block";
    
    if (isExpand == 0) // we're actually doing "less"
    {
      shortDisplay = "block";
      fullDisplay = "none";
    }
    
    var rtextElems = getElementsByName_iefix("dd", "reviewText");
    for (var i=0; i < rtextElems.length; i++)
    {
      var currElem = rtextElems[i];
      if (currElem.id == idPrefix + "short" + index)
      {
        currElem.style.display = shortDisplay;
      }
      else if (currElem.id == idPrefix + "full" + index)
      {
        currElem.style.display= fullDisplay;
      }
      else if (currElem.id.indexOf("short") != -1)
      {
        currElem.style.display="block";
      } 
      else
      {
        currElem.style.display="none";
      }
    }
    if (window.sendHeight)
    {
      sendHeight(); // iframe resizing if implemented
    }
  }
  
  function toggleLanguage(count, idPrefix)
  {
    var revElems = getElementsByName_iefix("dd", "sortableReview");
    for (var i=0; i < revElems.length; i++)
    {
      var currElem = revElems[i];
      if (currElem.id.substr(0, 1) == idPrefix)
      {
        currElem.style.display="block";
        var subElems = currElem.getElementsByTagName("dd");
        for (var j=0; j < subElems.length; j++)
        {
          var tmpElem = subElems[j];
          var tmpId = tmpElem.id;
          if (tmpId.substr(1, 4) == "full" || tmpId.substr(1, 5) == "short")
          {
            // If it matches the count, show full text, otherwise short
            if (tmpId.substr(tmpId.length-1, 1) == count)
            {
              if (tmpId.substr(0, 5) == (idPrefix + "full"))
              {
                tmpElem.style.display="block";
              }
              else
              {
                tmpElem.style.display="none";
              }
            }
            else
            {
              if (tmpId.substr(0, 6) == (idPrefix + "short"))
              {
                tmpElem.style.display="block";
              }
              else
              {
                tmpElem.style.display="none";
              }
            }
          }
        }
      }
      else // id doesn't start with prefix; hide all
      {
        currElem.style.display="none";
      } // end if (currElem.id.startsWith(idPrefix))
      
    } // end for loop in revElems
  
  }
  
  function showElem(elemId)
  {
    var elem = document.getElementById(elemId);
    if (elem != null)
    {
      elem.style.display="block";
    }
  }
  
  function hideElem(elemId)
  {
    var elem = document.getElementById(elemId);
    if (elem != null)
    {
      elem.style.display="none";
    }
  }
  
  function setHref(elemId, elemHref)
  {
    var elem = document.getElementById(elemId);
    if (elem != null)
    {
      elem.setAttribute("href", elemHref);
    }
  }
  
  function changePane(tabId, paneId)
  {
    changeTab(tabId);
    var panes = $$('#list' + tabId + ' div[name=propertyPane]');
    for (var i = 0; i < panes.length; ++i) {
      if (panes[i].id == 'list' + paneId + 'Pane') {
        panes[i].style.display = 'block';
      } else {
        panes[i].style.display = 'none';
      }
    }
  }

  function changeTab(tabId)
  {
    var tabElems = getElementsByName_iefix("a", "propertyTab");
    if (tabElems == null || tabElems.length <= 1)
    {
      return; // nothing to do
    }
    // Display the right selected tab heading
    for (var i=0; i < tabElems.length; i++)
    {
      if (tabElems[i].id == tabId)
      {
        tabElems[i].className="tabSelected"; // selected tab class
      }
      else
      {
        tabElems[i].className=""; // not selected
      }
    }
    // Now display the right list
    var propListElems = getElementsByName_iefix("div", "propertyList");
    if (propListElems == null || propListElems.length <= 1)
    {
      return; // nothing to do
    }
    for (var i=0; i < propListElems.length; i++)
    {
      if (propListElems[i].id == "list" + tabId)
      {
        propListElems[i].style.display="block"; 
      }
      else
      {
        propListElems[i].style.display="none";
      }
    }
    // If we have the search box enabled, record the selected tab
    var searchFormElem = document.getElementById('DESTSEARCH_FORM');
    if (searchFormElem != null && searchFormElem.tab != null)
    {
      searchFormElem.tab.value=tabId;
    }

  }
  
  function getPartnerPropertyLink(taUrl, locationId, locationName, locale, doPartnerRedirect, linkTarget)
  {
    var pUrl = null;
    if (window.taPartnerPropertyLink && doPartnerRedirect == 'true') // partner function is defined
    {
      pUrl = taPartnerPropertyLink(locationId, locationName, locale);
    }
    
    if (pUrl != null)
    {
      partnerRedirect(pUrl, linkTarget); // redirect to partner page in new or existing window
    }
    else
    {
      if (linkTarget == 'new' && doPartnerRedirect == 'false')
      {
        doNewTAWindow(taUrl, 'newTApropdetail');
        return;
      }
      else // popup
      {
        doPopup(taUrl, 'propdetail');
        return;
      }
    }
    
    return;
  }
  
  function getPartnerPropertyLinkForMap(taUrl, locationId, locationName, locale)
  {
    var pUrl = null;
    if (window.taPartnerPropertyLink) // partner function is defined
    {
      pUrl = taPartnerPropertyLink(locationId, locationName, locale);
    }
    if (pUrl != null && pUrl != "")
    {
      return pUrl;
    }
    // If partner doesn't have a link, use the TA URL
    return taUrl;
  }

  function getPartnerBookingLink(locationId, locationName, locale, linkElemId)
  {
    var pUrl = null;
    if (window.taPartnerBookingLink) // partner function is defined
    {
      pUrl = taPartnerBookingLink(locationId, locationName, locale);
      if (pUrl != null && pUrl != "")
      {
        if (window.taPartnerBookingText) // partner function for text is defined
        {
          // Replace the default booking text with the dynamically returned text
          var pText = taPartnerBookingText(locationId, locationName, locale);
          if (pText != null && pText != "")
          {
            var bookElem = document.getElementById(linkElemId);
            bookElem.innerHTML = pText;
          }
        }

        return pUrl;
      } // end if pUrl != null
    } // end if window.taPartnerBookingLink
    
    return null;
  }
  
  function partnerRedirect(pUrl, redirectOption)
  {
    if (redirectOption == null || redirectOption == '' || redirectOption == 'existing')
    {
      if (window.opener == null)
      {
        window.top.location = pUrl;
      }
      else
      {
        window.opener.top.location = pUrl;
      }
      return;
    }
    else if (redirectOption == 'new') // open URL in new window
    {
      doNewTAWindow(pUrl, 'tpbWin');
      return;
    }
  }
 
  function doCRPopup(url, wname)
  {
    popwindow = window.open(url, wname, 'toolbar=0,resizable=1,menubar=0,location=0,status=0,scrollbars=1,width=255,height=730,screenX=5,left=5,screenY=5,top=5');
    if (window.focus)
    {
      popwindow.focus();
    }
  }
  
  function doMore(elemId)
  {
    var fullElem  = document.getElementById(elemId + "full");
    var shortElem = document.getElementById(elemId + "short");
    
    fullElem.style.display="block";
    shortElem.style.display="none";
  }
  
  function doLess(elemId)
  {
    var fullElem  = document.getElementById(elemId + "full");
    var shortElem = document.getElementById(elemId + "short");
    
    fullElem.style.display="none";
    shortElem.style.display="block";
  }
  
  // Functions for maps in destination widget
  function showMap(elemId, mapLat, mapLong, nZoom)
  {
    showMap(elemId, mapLat, mapLong, nZoom, 'WidgetEmbed-cdsdest');
  }
  
  function showMap(elemId, mapLat, mapLong, nZoom, servletName)
  {
    var mapDiv = ta.id(elemId);
    // Display the map, with some controls and set the initial location
    mapDiv.map = new ta.maps.Map(mapDiv, {
      origLat: mapLat,
      origLng:mapLong,
      zoom: nZoom,
      servlet: servletName,
      smallMap:     true,
      typeControl:  false,
      scaleControl: false,
      markerActivateOn: ta.overlays.ACTIVATE_BOTH
    });
    mapDiv.map.addIcon('hotel', {name: 'Hotel'});
    mapDiv.map.addIcon('rental', { name: 'Rental', iconPrefix:'icon',
                                   iconWidth:19, iconHeight: 18, iconAnchorX: 9, iconAnchorY: 18,
                                   shadow:'shadowIcon.png', shadowWidth:21, shadowHeight:20 });
    mapDiv.map.addIcon('restaurant', {name: 'Restaurant'});
    mapDiv.map.addIcon('attraction', {name: 'ThingToDo'});
    
    // recenter the map when user clicks on star icon
    var mapTitleElem = $('mapTitle');
    if (mapTitleElem)
    {
      mapTitleElem.addEvent('click', mapDiv.map.reset.bind(mapDiv.map));
    }
    
    // use markerData
    mapDiv.map.replaceMarkers(markerData.hotels, 'hotel', ta.maps.MARKER_HOTEL);
    mapDiv.map.replaceMarkers(markerData.rentals, 'rental', ta.maps.MARKER_VR_APPROX);
    mapDiv.map.replaceMarkers(markerData.restaurants, 'restaurant', ta.maps.MARKER_RESTAURANT);
    mapDiv.map.replaceMarkers(markerData.attractions, 'attraction', ta.maps.MARKER_ATTRACTION);
    
    // hide any pins whose types are unchecked
    var hPins = document.getElementById('cbx1');
    var vrPins = document.getElementById('cbx2');
    var aPins = document.getElementById('cbx3');
    var rPins = document.getElementById('cbx4');
    if (hPins != null && hPins != undefined && !hPins.checked)
    {
      mapDiv.map.toggleType('hotel');
    }
    if (vrPins != null && vrPins != undefined && !vrPins.checked)
    {
      mapDiv.map.toggleType('rental');
    }
    if (aPins != null && aPins != undefined && !aPins.checked)
    {
      mapDiv.map.toggleType('attraction');
    }
    if (rPins != null && rPins != undefined && !rPins.checked)
    {
      mapDiv.map.toggleType('restaurant');
    }
    
    // show error if no pins
    mapDiv.errorDiv = ta.id('mapError');
    var errorDiv = mapDiv.errorDiv;
    if (errorDiv)
    {
      mapDiv.map.addEvent("noPins", function() {errorDiv.show();});
      mapDiv.map.addEvent("allPins", function() {errorDiv.hide();});
      mapDiv.map.addEvent("homePinOnly", function() {errorDiv.show();});
    }
  }
  
  function toggleMapMarkers(elemId, type)
  {
    var mapDiv = document.getElementById(elemId);
    mapDiv.map.toggleType(type);
  }

  function callForumWidget(host, locId, params)
  {
    var fwUrl = host + "/WidgetEmbed-cdsforum?locationId=" + locId + params;
    document.location = fwUrl;
  }
  
  function pageNav(elemIdBase, num, max)
  {
    for (var i=0; i < max; i++)
    {
      var currElem = document.getElementById(elemIdBase + i);
      var linkElem = document.getElementById(elemIdBase + "Link" + i);
      
      if (currElem != null && currElem != undefined)
      {
        if (i == num)
        {
          currElem.style.display="block";
          if (linkElem != null && linkElem != undefined)
          {
            linkElem.style.cursor="default";
            linkElem.style.color="#2c2c2c";
          }
        } 
        else
        {
          currElem.style.display="none";
          if (linkElem != null && linkElem != undefined)
          {
            linkElem.style.cursor="pointer";
            linkElem.style.color="#202d95";
          }
        }
      }
    }
  }

  // the parameter host sometimes includes a prefix in addition to the host 
  //   and prepend customer tracking code on hac widget depends on this)
  function doHacSearch(elemId, host)
  {
    var hacUrl = host;
    var hacForm = document.getElementById(elemId);
    if (hacForm == null || hacForm == undefined ||
        host == null || host == undefined)
    {
      return;
    }
    
    var last = host.substring(host.length-1);
    if (last != '/')
    {
       hacUrl = host + '/';
    }
    hacUrl = hacUrl + "HACSearch?geo=" + hacForm.geo.value + 
                      "&inDay="    + hacForm.inDay.value +
                      "&inMonth="  + hacForm.inMonth.value +
                      "&outDay="   + hacForm.outDay.value +
                      "&outMonth=" + hacForm.outMonth.value +
                      "&q="        + hacForm.hacGeo.value;
    
    doNewTAWindow(hacUrl, 'TAHacSearchWin');
  }
  
  function doDestSearch(elem)
  {
    var form = document.getElementById("DESTSEARCH_FORM");
    form.locationId.value = form.geo.value;
    
    hideElem("destSearchError");

    var ops = {
      url: "/WidgetEmbed",
        data: form,
        onFailure: function(e) { 
          showElem("destSearchError"); 
        },
        onSuccess: function(txt) {
          var elmt = document.getElementById("cdsDestContent");
          if (elmt != null && elmt != undefined)
            {
              elmt.innerHTML = txt;
              var form = document.getElementById("DESTSEARCH_FORM");
              if (form != null && form.tab != null)
              {
                // Check if there are any properties on the selected tab
                var tabContent = document.getElementById("list" + form.tab.value);
                if (tabContent != null)
                {
                  changeTab(form.tab.value);
                }
                if ((tabContent != null && form.tab.value == "Map") ||
                    (tabContent == null && form.defaultTab.value == "Map"))
                {
                    // Get new map parameters
                    var mapElem = document.getElementById("mapLatLongInfo");
                    if (mapElem != null && mapElem.childNodes != null)
                    {
                      var mapInfo = mapElem.childNodes[0].nodeValue;
                      if (mapInfo != null)
                      {
                        var mapInfoArr = mapInfo.split(":");
                        if (mapInfoArr != null && mapInfoArr.length == 3)
                        {
                          showMap('theMap', parseFloat(mapInfoArr[0]), parseFloat(mapInfoArr[1]), parseInt(mapInfoArr[2]));
                        }
                      }
                    }
                }
              }
            }
        }, //onComplete
        evalScripts: true
    }
    new Request(ops).send();
    clearPhotoInfo(form.uniq);
  }

  function doTOGSearch(elem)
  {
    var form = document.getElementById("CDSTOG_FORM");
    
    // Error checking
    var hasError = checkTOGInput(form);
    if (hasError == true)
    {
      return;
    }
    
    // Show spinner until Ajax request completes
    hideElem('cdsTogIntro');
    showElem('cdsTogSpinner');
    
    var ops = {
      url: "/TankOfGas",
        data: form,
        onFailure: ta.util.error.ajaxFailure.partial('CdsWidgets:doTOGSearch'),
        onComplete: function(txt) {
          if (txt.indexOf('ERROR') == 0)
          {
            showElem("tog_error_notfoundcity");
            showElem("TOG_ERROR_MSG");
            addElemClass("TANK_OF_GAS_FORM", "cdsTogErr");
          }
          else
          {
            var elmt = document.getElementById('cdsTogResults');
            if (elmt != null && elmt != undefined)
            {
              elmt.innerHTML = txt;
              elmt.style.display = 'block';
              hideElem('cdsTogIntro');
              hideElem('cdsTogSpinner');
            }
          }
          sendHeight(); // iframe resizing if implemented
        }
    }
    new Request(ops).send();
  }

  function redoTOGSearch(locId, range)
  {
    var form = document.getElementById("CDSTOG_FORM");
    form.geo.value = locId;
    for (var i=0; i < form.tog_range.length; i++)
    {
      if (form.tog_range[i].value == range)
      {
        form.tog_range[i].checked = true;
      }
      else
      {
        form.tog_range[i].checked = false;
      }
    }
    doTOGSearch(form);
  }
  
  function checkTOGInput(form)
  {
    // First turn off any existing error messages
    hideElem("TOG_ERROR_MSG");
    hideElem("tog_error_nocity");
    hideElem("tog_error_notfoundcity");
    hideElem("tog_error_range");
    removeElemClass("TANK_OF_GAS_FORM", "cdsTogErr");
    removeElemClass("tog_city_label", "cdsTogErr");
    removeElemClass("tog_range_label", "cdsTogErr");
    removeElemClass("togGeoSearch", "cdsTogErr");

    // Now check for new errors to display
    var hasError = false;
    if (form.q.value == null || form.q.value == "")
    {
      form.geo.value="";
      showElem("tog_error_nocity");
      addElemClass("tog_city_label", "cdsTogErr");
      addElemClass("togGeoSearch", "cdsTogErr");
      hasError = true;
    }
    
    var rangeSelected = false;
    for (var i=0; i < form.tog_range.length; i++)
    {
      if (form.tog_range[i].checked == true)
      {
        rangeSelected = true;
        break;
      }
    }
    if (rangeSelected == false)
    {
      showElem("tog_error_range");
      addElemClass("tog_range_label", "cdsTogErr");
      hasError = true;
    }
    
    if (hasError == true)
    {
      // Show error box and resize form accordingly
      showElem("TOG_ERROR_MSG");
      addElemClass("TANK_OF_GAS_FORM", "cdsTogErr");
      sendHeight(); // iframe resizing if implemented
      return true;
    }
    
    return false;
  }
  
  function addElemClass(elemId, clname)
  {
    var elem = document.getElementById(elemId);
    if (elem != null)
    {
      elem.className += (" " + clname);
    }
  }

  function removeElemClass(elemId, clname)
  {
    var elem = document.getElementById(elemId);
    if (elem != null)
    {
      elem.className = elem.className.replace(clname, "");
    }
  }
  
  function limitLength(elem, limit)
  {
    if (elem != null && elem.value != null && elem.value.length >= limit)
    {
        elem.value = elem.value.substr(0, limit);
    }
  }
  
  function initTextArea(elem)
  {
    if (elem != null)
    {
      elem.value = '';
      elem.onfocus = null;
      elem.style.color = "#2C2C2C";
    }
  }
  
  function selectRating(elem, event, set, uniq)
  {
    if (elem != null && event != null && elem.clientWidth != 0)
    {
      // calculate position of element
      var offsetTrail = elem;
      var offsetLeft = 0;
      while (offsetTrail)
      {
        offsetLeft += offsetTrail.offsetLeft;
        offsetTrail = offsetTrail.offsetParent;
      }
      
      var eXWithoutOffset = event.pageX ? event.pageX - window.pageXOffset : event.clientX;
      var eX = eXWithoutOffset - offsetLeft;
      var rating = Math.ceil((eX / elem.clientWidth) * 5);
      elem.className = "widWRLRate n" + rating + "0";
      var ratingTextElem = document.getElementById('ratingText' + uniq);
      var ratingElem = document.getElementById('rating' + rating + uniq);
      if (ratingTextElem != null && ratingElem != null)
      {
        ratingTextElem.innerHTML = ratingElem.value;
      }
      if (set)
      {
        var qidElem = document.getElementById('qid10' + uniq);
        if (qidElem != null)
        {
          qidElem.value = rating;
        }
      }
    }
  }
  
  function lastSetRating(elem, uniq)
  {
    if (elem != null)
    {
      var ratingElem = document.getElementById('qid10' + uniq);
      if (ratingElem != null)
      {
        var rating = ratingElem.value;
        var ratingStrElem = document.getElementById('rating' + rating + uniq);
        if (ratingStrElem != null)
        {
          var ratingStr = ratingStrElem.value;
          if (rating == 0)
          {
            elem.className = "widWRLRate g00";
          }
          else
          {
            elem.className = "widWRLRate n" + rating + "0";
          }
          var ratingTextElem = document.getElementById('ratingText' + uniq);
          if (ratingTextElem != null)
          {
            ratingTextElem.innerHTML = ratingStr;
          }
        }
      }
    }
  }

  function checkTextArea(uniq)
  {
    var elem = document.getElementById('taWRLTitle' + uniq);
    var text = document.getElementById('defaultTitle' + uniq);
    var title = document.getElementById('reviewTitle' + uniq);
    if (elem != null && text != null && title != null)
    {
      if (text.value == elem.value)
      {
        title.value = '';
      }
      else
      {
        title.value = encodeURIComponent(elem.value);
      }
      
      var formElem = document.getElementById('cdsWRLForm' + uniq);
      if (formElem != null)
      {
        formElem.submit();
      }
    }
  }
  
  function checkSearchBox(elem, startText)
  {
    if (elem != null && elem.value == startText)
    {
      elem.value = '';
      elem.onclick = null;
      elem.style.color = "#2C2C2C";
    }
  }

  function togglePIDetails(action)
  {
    if (action == 'show')
    {
      showElem('cdsPIHideReviews');
      hideElem('cdsPIReadReviews');
      showElem('cdsPIDetails');
      if (window.sendHeight)
      {
        sendHeight(); // iframe resizing if implemented
      }
    }
    else 
    {
      showElem('cdsPIReadReviews');
      hideElem('cdsPIHideReviews');
      hideElem('cdsPIDetails');
      if (window.sendHeight)
      {
        sendHeight(); // iframe resizing if implemented
      }
    }
  }
