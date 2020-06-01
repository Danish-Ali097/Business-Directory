$(document).ready(function () {
    $("#locationBtn").click(getCurrentLocation);
    $("#submitBusinessFormBtn").click(addBusiness);
    var html, catresponse;
    var token = localStorage.getItem("auth_token");
    getDataOnLoad();

    function getDataOnLoad() {
        //categories
        $.ajax({
            type: "GET",
            url: "/api/Categories",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                catresponse = response;
            },
            error: function (error) {
                catresponse = error.responseText;
            }
        });
        //businesses
        $.ajax({
            type: 'GET',
            url: '/api/Businesses',
            contentType: 'application/json;charset=utf-8',
            success: function (response) {
                if (response) {
                    console.log(response);
                    for (var x in response) {
                        tmp = Number.parseInt(x) + 1;
                        html += `<tr>`;
                        html += `<td>${tmp}</td>`;
                        html += `<td>${response[x].Name}</td>`;
                        html += `<td> St# ${response[x].StNumber}, ${response[x].City}, ${response[x].Country}</td>`;
                        html += `<td>${getCategories(response[x].Id)}</td>`;
                        html += `</tr>`;
                    }
                    $("#businessList").html(html);
                } else {
                    alert('No Business Added');
                }
            },
            error: function (error) {
                console.log('error: ' + error.status);
            }
        });
    }

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                $("#coordinateX").val(position.coords.longitude);
                $("#coordinateY").val(position.coords.latitude);
            })
        }
    }
    function getCategories(uid) {
        var cat='';
        if (catresponse != null) {
            for (var res in catresponse) {
                if (catresponse[res].BusinessId == uid) {
                    cat += `<span class="badge badge-pill badge-primary mx-1">`;
                    cat += catresponse[res].Name;
                    cat += `</span>`;
                }
            }
            return cat != '' ? cat : 'No Categories';
        } else { return 'no categories'; }
    }

    function addBusiness() {
        var error = [];
        //regex
        var alphabetsWithSpace = /^(([a-z]|[A-Z])+\s?([a-z]|[A-Z])?)+$/g;
        var alphabetsOnly = /^\w+$/g;
        var numberofTwoDigit = /^(\d|\d{2})$/g;
        var longOrLatOnly = /^\-?\d+\.{1}\d+$/g;
        //getting values from form
        var name = $("#name").val();
        var stno = $("#streetno").val();
        var city = $("#city").val();
        var country = $("#country").val();
        var long = $("#coordinateX").val();
        var lat = $("#coordinateY").val();
        var categories = $("#categories").val();

        if (name.length < 1 || stno.length < 1 || city.length < 1 || country.length < 1 || long.length < 1 || lat.length < 1 || categories.length < 1) {
            $(".errorDiv").html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error!</strong> Please Fill all fields
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`);
        } else {
            var obj = {
                Name: name,
                StNumber: stno,
                City: city,
                Country: country,
                location: long + ',' + lat
            };
            console.log(categories);
            $.ajax({
                type: 'POST',
                url: '/api/Businesses',
                contentType: 'application/json;charset=utf-8',
                headers: { "Authorization": "Bearer "+ token},
                data: JSON.stringify(obj),
                dataType: 'json',
                success: function (response) {
                    console.log(response);
                    var userId = response.Id;
                    for (var i in categories) {
                        addCategories(userId, categories[i]);
                    }
                },
                error: function (error, status) {
                    var message = JSON.parse(error.responseText);
                    console.log(status+" "+message);
                    console.log('error in adding business');
                    debugger;
                    console.log(error.status);
                    if (error.status == 401) {
                        $(".errorDiv").html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error!</strong> Please Login to Complete this request
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>`);
                        $('#AddBusinessModal').modal('hide');
                    }
                    
                }

            });
        }
        function addCategories(uid, category) {
            $.ajax({
                type: 'POST',
                url: '/api/Categories',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({ BusinessId: uid, Name: category }),
                dataType: 'json',
                headers: { "Authorization": "Bearer " + token },
                success: function (response) {
                    console.log("categories added success");
                    console.log(response);
                    $('#AddBusinessModal').modal('hide');
                    $('.errorDiv').html(`<div class="alert alert-success alert-dismissible fade show" role="alert">
                                          <strong>Success!</strong> Business Added.
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>`);
                    getDataOnLoad();
                },
                error: function (error, status) {
                    var message = JSON.parse(error.responseText);
                    console.log('error in adding categories');
                }
            })
        }

    }
    $("#tablesearchField").keyup(function () {
        var value = $(this).val().toLowerCase();
        $("#businessList tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        })
    });

    // Login form script
    $("#LoginForm").on('submit', function (e) {
        e.preventDefault();
        var username = $("#userNameLogin").val();
        var password = $("#passwordLogin").val();

        var obj = { UserName: username, Password: password };

        if (username.length < 1 || password.length < 1) {
            $(".errorDiv").html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error!</strong> Please Fill all fields
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`);
        } else {
            $.ajax({
                method: 'POST',
                url: '/api/Token',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(obj),
                dataType: 'json',
                success: function (response) {
                    console.log(response);
                    localStorage.setItem("auth_token", response.auth_token);
                    $(this).submit();
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            });
        }
    });
});