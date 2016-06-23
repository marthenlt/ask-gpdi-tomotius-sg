/**
 * Created by Marthen on 6/23/16.
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


var recordPerPage = 10; //max items per page
var page = 0; //initialize page number
var maxPage=0; //initialized dynamically based on actual number of questions stored in MongoDB..
var currentNumberOfRecsFound=0;
var previousNumberOfRecsFound=0;
var loading = false;
var questionNo=1;


$(document).ready(function () {
    loadListView(recordPerPage, maxPage); //load some images onload
});

//Handler for scrolling toward end of document
//$(window).scroll(function () {
$(document).on("scrollstop", function () {
//    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
    console.log('scroll event..');
    //End of page, load next content here
    if (!loading) loadNextPage();
    //}
});

//Load content for next page
function loadNextPage() {
    if (page < maxPage) {
        loadListView(recordPerPage, ++page);
    } else {
        if (previousNumberOfRecsFound != currentNumberOfRecsFound) {
            loadListView(recordPerPage, page);
            previousNumberOfRecsFound = currentNumberOfRecsFound;
        }
    }
}

function initializeMaxPage() {
    loading = true; //interlock to prevent multiple calls
    $.mobile.loading('show');
    //Get the total number of available isAnswered questions
    var restURL = "/ask/numberOfUnansweredRecords";
    $.getJSON(restURL, function(data) {
        currentNumberOfRecsFound = data;
        maxPage = Math.ceil(data/recordPerPage);
    })
    loading = false;
    $.mobile.loading('hide');
}

function loadListView(recordPerPage, innerPageNo) {
    initializeMaxPage()
    loading = true; //interlock to prevent multiple calls
    $.mobile.loading('show');

    console.log('inside loadListView() --> page: ', page);
    console.log('inside loadListView() --> maxPage: ', maxPage);
    console.log('inside loadListView() --> recordPerPage: ', recordPerPage);
    console.log('inside loadListView() --> innerPageNo: ', innerPageNo);

    //Get the actual records..
    restURL = "/ask/pagination/";
    var list = '';
    $.getJSON(restURL + innerPageNo + '/' + recordPerPage, {})
        .done(function (data) {
            $.each(data, function (index, value) {
                list += '<li>' +
                    '<a href"#">' + questionNo + '). Question: ' + value.question + '</a>' +
                    '</li>';
                questionNo++;
            }); // end each
//            $('#lazyloader').empty().append(list).listview("refresh");
            $('#lazyloader').append(list).listview("refresh");

            loading = false;
            $.mobile.loading('hide');
            $('#questionsNo').text(currentNumberOfRecsFound);
        });

};
