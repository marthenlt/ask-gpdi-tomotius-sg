/**
 * Created by root on 6/23/16.
 */


/*
$(function (){
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/ask/showall',
        success: function(data) {
            console.log('success: ',  data);
            var list = '';
            $.each(data, function(index, value) {
                list += '<li>' +
                    '<a href"#">' + value.question + '</a>' +
                    '</li>';
            }); // end each
            $('#lazyloader').append(list).listview("refresh");

        }, // end success
        error: function(data) {
            console.log('error: ', data);
        }
    }); // end ajax
});
*/



/*
 <ul data-role="listview" data-inset="true">
     <li data-role="list-divider">Friday, October 8, 2010 <span class="ui-li-count">2</span></li>
     <li><a href="index.html">
     <h2>Stephen Weber</h2>
     <p><strong>You've been invited to a meeting at Filament Group in Boston, MA</strong></p>
     <p>Hey Stephen, if you're available at 10am tomorrow, we've got a meeting with the jQuery team.</p>
         <p class="ui-li-aside"><strong>6:24</strong>PM</p>
     </a></li>
     <li><a href="index.html">
     <h2>jQuery Team</h2>
     <p><strong>Boston Conference Planning</strong></p>
     <p>In preparation for the upcoming conference in Boston, we need to start gathering a list of sponsors and speakers.</p>
         <p class="ui-li-aside"><strong>9:18</strong>AM</p>
     </a></li>
     <li data-role="list-divider">Thursday, October 7, 2010 <span class="ui-li-count">1</span></li>
     <li><a href="index.html">
     <h2>Avery Walker</h2>
     <p><strong>Re: Dinner Tonight</strong></p>
     <p>Sure, let's plan on meeting at Highland Kitchen at 8:00 tonight. Can't wait!</p>
         <p class="ui-li-aside"><strong>4:48</strong>PM</p>
     </a></li>
 </ul>
 */




var per_page = 10; //max images per page
var page = 1; //initialize page number
var loading=false;

$(document).ready(function () {
//    refreshPage();
    loadListView(per_page, 1); //load some images onload
});

//Handler for scrolling toward end of document
//$(window).scroll(function () {
$(document).on("scrollstop",function(){
//    refreshPage();
//    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
        console.log('scroll event..');
        //End of page, load next content here
        if (!loading) loadNextPage();
    //}
});

//Load content for next page
function loadNextPage() {
//    refreshPage();
    loadListView(per_page, ++page);
}


//Load images from Datasource (Flickr in this case)
function loadListView(per_page, page) {
    console.log('per_page', per_page);
    console.log('page', page);
    loading = true; //interlock to prevent multiple calls
    $.mobile.loading('show');
    var restURL = "/ask/pagination/";
    var list = '';

    //Calling to service provider
    $.getJSON(restURL + page + '/' + per_page, {
        per_page: per_page || 10,
        page: page || 1
    })
        .done(function (data) {
            $.each(data, function(index, value) {
                list += '<li>' +
                    '<a href"#">' + value.question + '</a>' +
                    '</li>';
                //Update page index
                page = index;
            }); // end each
            $('#lazyloader').append(list).listview("refresh");


            loading = false;
            $.mobile.loading('hide');
            console.log("data.page: ", data.page);
            console.log("page: ", page);
            $('#questionsNo').text($('#lazyloader li').size());
        });
};

/*
//C#-like feature to concat strings
String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}
*/

function refreshPage()
{   console.log("inside refresh..")
    jQuery.mobile.loadPage(
        window.location.href, {
            allowSamePageTransition: true,
            transition: 'none',
            reloadPage: true
    });
}