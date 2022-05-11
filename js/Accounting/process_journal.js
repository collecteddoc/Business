var process_journal = {
    ProcessJournal: function() {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/ProcessJournal',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    console.log(response);
                    process_journal.GetTransactionStatus();
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
    },
    SyncPrizeBondTransaction: function() {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/SyncPrizeBondTransaction',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    console.log(response);
                    process_journal.GetTransactionStatus();
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
    },
    GetTransactionStatus: function() {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/GetTransactionStatus',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    console.log(response);
                    $("#lbl_UnprocessedTransaction").empty().append(response.TotalUnProcessedTransaction);
                    $("#lbl_UnsyncedPrizeBondTransaction").empty().append(response.TotalUnSyncedPrizeBondTransaction);
                    $("#lbl_UnsyncedInventoryTransaction").empty().append(response.TotalUnSyncedInventoryTransaction);
                }
                $(document).ajaxStop($.unblockUI);
            },
            error: function(exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);
            }
        });
    },
};