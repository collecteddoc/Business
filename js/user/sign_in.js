var sign_in = {
    signin: function(username, password) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/token',
            type: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Only used to get token 
            },
            data: {
                username: username,
                password: password,
                grant_type: 'password'
            },
            success: function(response) {
                $(document).ajaxStop($.unblockUI);
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('username', username);
                main.loadpage('/index.html');
            },
            error: function(exception) {
                $(document).ajaxStop($.unblockUI);
                if (exception.responseJSON != null) {
                    swal({
                        title: exception.responseJSON.error_description,
                        text: "",
                        icon: "error",
                        closeOnClickOutside: false
                    });
                } else {
                    utility.isServerUp(main.baseURL, function(online) {
                        if (online) {
                            // site is online
                            swal({
                                title: "Unable to perform due to technical difficulties.",
                                text: "",
                                icon: 'error',
                                closeOnClickOutside: false
                            });
                        } else {
                            swal({
                                title: main.serverDownMessage,
                                text: "",
                                icon: "error",
                                closeOnClickOutside: false
                            });
                        }
                    })
                }
            }
        })
    },

    signout: function() {
        //$.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Account/Signout',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"), // Used for transaction POST & GET
            },
            data: {},
            success: function(response) {
                //$(document).ajaxStop($.unblockUI);
                if (response.IsSuccess = true) {}
            },
            error: function(exception) {
                //$(document).ajaxStop($.unblockUI);
            }
        });
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        localStorage.removeItem("moduleList");
        localStorage.removeItem("branchList");
        for (var moduleId = 1; moduleId <= 6; moduleId++) {
            localStorage.removeItem("menuList_" + moduleId);
        }
        main.load();
    },

    forgotPassword: function(email) {
        utility.isServerUp(localStorage.getItem("baseURL"), function(online) {
            if (online) {
                swal({
                        title: "Are you sure to send email?",
                        text: "",
                        icon: "info",
                        closeOnClickOutside: false,
                        buttons: {
                            no: {
                                text: "No",
                                value: "No",
                            },
                            yes: {
                                text: "Sure",
                                value: "Yes",
                            },
                        },
                    })
                    .then((value) => {
                        switch (value) {
                            case "No":
                                break;
                            case "Yes":
                                $.blockUI({ message: main.loaderAnimation });
                                $.ajax({
                                    url: localStorage.getItem("baseURL") + '/Account/ForgotPassword',
                                    type: 'POST',
                                    data: {
                                        Email: email
                                    },
                                    success: function(response) {
                                        $(':input').val('');
                                        $(document).ajaxStop($.unblockUI);
                                        swal({
                                            title: response.Message,
                                            text: "",
                                            icon: response.MessageType.toLowerCase(),
                                            closeOnClickOutside: false
                                        });
                                    },
                                    error: function(exception) {
                                        $(document).ajaxStop($.unblockUI);
                                        main.errorMessage(exception);
                                    }
                                });
                                break;
                        }
                    })
            } else {
                swal({
                    title: main.serverDownMessage,
                    text: "",
                    icon: "error",
                    closeOnClickOutside: false
                });
            }
        })
    }
};