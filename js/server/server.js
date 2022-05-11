var server = {
    BackupDatabase: function() {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/AppServer/BackupDatabase',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    swal({
                        title: response.Message,
                        text: "",
                        icon: response.MessageType.toLowerCase(),
                        closeOnClickOutside: false
                    });
                }
                $(document).ajaxStop($.unblockUI);
            },
            error: function(exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);
            }
        });
    }
}