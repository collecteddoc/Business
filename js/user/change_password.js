var change_password = {
    changePassword: function (currentPassword, newPassword, confirmNewPassword) {
        if (currentPassword != "" && newPassword != "" && confirmNewPassword != "") {
            swal({
                title: "Are you sure to change the password?",
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
                                url: localStorage.getItem("baseURL") + '/Account/ChangePassword',
                                type: 'POST',
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                                },
                                data: {
                                    OldPassword: currentPassword,
                                    NewPassword: newPassword,
                                    ConfirmPassword: confirmNewPassword
                                },
                                success: function (response) {
                                    $(':input').val('');
                                    $(document).ajaxStop($.unblockUI);
                                    swal({
                                        title: response.Message,
                                        text: "",
                                        icon: response.MessageType.toLowerCase(),
                                        closeOnClickOutside: false
                                    });
                                },
                                error: function (exception) {
                                    $(':input').val('');
                                    $(document).ajaxStop($.unblockUI);
                                    main.errorMessage(exception);
                                }
                            });
                            break;
                    }
                })
        }
        else {
            swal({
                title: "Please input password.",
                text: "",
                icon: "warning",
                closeOnClickOutside: false
            });
        }
    }
};