var sign_up = {
    signup: function(email, password, confirmPassword) {
        if (email == '') {
            swal({
                title: "Please enter email address.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (password == '') {
            swal({
                title: "Please enter password.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (confirmPassword == '') {
            swal({
                title: "Please enter confirm password.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (password != confirmPassword) {
            swal({
                title: "Password and Confirm Password does not match.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/Account/Signup',
                type: 'POST',
                data: {
                    Email: email,
                    Password: password,
                    ConfirmPassword: confirmPassword
                },
                success: function(response) {
                    $(document).ajaxStop($.unblockUI);
                    if (response.IsSuccess == true) {
                        $(':input').val('');
                        swal({
                            title: response.Message,
                            text: "",
                            icon: response.MessageType.toLowerCase(),
                            closeOnClickOutside: false
                        });
                        //sign_in.signin(email, password)
                    } else {
                        swal({
                            title: response.Message,
                            text: "",
                            icon: response.MessageType.toLowerCase(),
                            closeOnClickOutside: false
                        });
                    }
                },
                error: function(exception) {
                    $(document).ajaxStop($.unblockUI);
                    main.errorMessage(exception);
                }
            });
        }
    },
};