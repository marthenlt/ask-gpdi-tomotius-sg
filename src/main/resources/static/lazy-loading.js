/**
 * Created by Marthen on 6/23/16.
 */

var recordPerPage = 10; //max items per page
var page = 0; //initialize page number
var maxPage = 0; //initialized dynamically based on actual number of questions stored in MongoDB..
var currentNumberOfRecsFound = 0;
var previousNumberOfRecsFound = 0;
var loading = false;
var questionNo = 1;
var isHomePage = true;
var questionId = "";
var maxLengthForTitleAndQuestion = 30;
var dotDot = "..";


$(document).ready(function () {
    if (isHomePage)
        loadListView(recordPerPage, maxPage); //load some images onload
});

//Handler for scrolling toward end of document
$(document).on("scrollstop", function () {
    if (isHomePage) {
        console.log('scroll event..');
        if (!loading) loadNextPage();
    }
});

//Load content for next page
function loadNextPage() {
    if (page < maxPage) {
        loadListView(recordPerPage, ++page);
    } else {
        initializeMaxPage();
        if (previousNumberOfRecsFound != currentNumberOfRecsFound) {
            console.log('inside loadNextPage() removeListFromListView() is called');
            removeListFromListView();
            //reset all the page index variable
            page = 0;
            questionNo = 1;
            previousNumberOfRecsFound = currentNumberOfRecsFound;
            loadListView(recordPerPage, page);
        }
    }
}

function initializeMaxPage() {
    loading = true; //interlock to prevent multiple calls
    $.mobile.loading('show');
    //Get the total number of available isAnswered questions
    var restURL = "/ask/numberOfUnansweredRecords";
    $.getJSON(restURL, function (data) {
        currentNumberOfRecsFound = data;
        maxPage = Math.ceil(data / recordPerPage);
    })
    loading = false;
    $.mobile.loading('hide');
}

function removeListFromListView() {
    $('#lazyloader').empty().listview("refresh");
}

function loadListView(recordPerPage, innerPageNo) {
    initializeMaxPage()
    loading = true; //interlock to prevent multiple calls
    $.mobile.loading('show');
    //Get the actual records..
    restURL = "/ask/pagination/";
    var list = '';
    $.getJSON(restURL + innerPageNo + '/' + recordPerPage, {})
        .done(function (data) {
            $.each(data, function (index, value) {
                titleText = value.title;
                if (titleText.length > maxLengthForTitleAndQuestion) titleText = titleText.substr(0, maxLengthForTitleAndQuestion-3) + dotDot;
                titleQuestion = value.question;
                if (titleQuestion.length > maxLengthForTitleAndQuestion) titleQuestion = titleQuestion.substr(0, maxLengthForTitleAndQuestion-3) + dotDot;
                list += '<li><a href="" question-id="' + value.id + '">' +
                    '<h3>' + titleText + '</h3>' +
                    '<p>' + titleQuestion + '</p>' +
                    '</li>';
                //list += '<li><a href="" question-id="' + value.id + '">' +
                //    '<h3>' + value.title + '</h3>' +
                //    '<p>' + value.question + '</p>' +
                //    '</li>';
                questionNo++;
            }); // end each
            $('#lazyloader').append(list).listview("refresh");
            loading = false;
            $.mobile.loading('hide');
            $('#questionsNo').text(currentNumberOfRecsFound);
        });

};


//////////////////////////////////////////////////////////////////////////////////

$(document).on('vclick', '#lazyloader li a', function () {
    questionId = $(this).attr('question-id');
    $.mobile.changePage("#detail", { transition: "slide", changeHash: false });
});

$(document).on('pagebeforeshow', '#detail', function () {
    isHomePage = false;
    loading = true; //interlock to prevent multiple calls
    $.mobile.loading('show');
    //Get the total number of available isAnswered questions
    var restURL = "/ask/show/" + questionId;
    $.getJSON(restURL, function (data) {
        $("#updatequestion").val(data.question);
        $("#updatetitle").val(data.title);
        $("#id").val(data.id);
    })
    loading = false;
    $.mobile.loading('hide');
})


$(document).on('pageinit', '#detail', function () {
    $(document).on('click', '#updateSubmit', function () { // catch the form's submit event
        $.ajax({
            url: '/ask/update',
            data: $('#updateQuestion').serialize(),
            type: 'PUT',
            beforeSend: function () {
                loading = true;
                $.mobile.loading('show');
            },
            complete: function () {
                loading = false;
                $.mobile.loading('hide');
            },
            success: function (result) {
                $.mobile.changePage("#successfulMarkedQuestion");
            },
            error: function (request, error) {
                alert('Sorry there is an error. Could be due to network problem. Please try again later');
            }
        });
        return false; // cancel original event to prevent form submitting
    });
});

///////////////////////////////////////////////////////////////////////////


$(document).on('pageinit', '#new', function () {
    $(document).on('click', '#submit', function () { // catch the form's submit event
        if ($('#title').val().length > 0 && $('#question').val().length > 0) {
            // Send data to server through the Ajax call
            // action is functionality we want to call and outputJSON is our data
            $.ajax({
                url: '/ask/post',
                data: $('#newquestionform').serialize(),
                type: 'POST',
                beforeSend: function () {
                    loading = true;
                    $.mobile.loading('show');
                },
                complete: function () {
                    loading = false;
                    $.mobile.loading('hide');
                },
                success: function (result) {
                    $.mobile.changePage("#successfulPostedQuestion");
                },
                error: function (request, error) {
                    alert('Sorry there is an error. Could be due to network problem. Please try again later');
                }
            });
        } else {
            alert('Title and Question fields are mandatory!');
        }
        //remove all the value for the next question..
        $("#question").val('');
        $("#title").val('');
        return false; // cancel original event to prevent form submitting
    });
});


$(document).on('pagebeforeshow', '#new', function () {
    isHomePage = false;
})


$(document).on('pagebeforeshow', '#home', function () {
    isHomePage = true;
    removeListFromListView();
    //reset all the page index variable
    page = 0;
    questionNo = 1;
    previousNumberOfRecsFound = currentNumberOfRecsFound;
    loadListView(recordPerPage, page);
})

