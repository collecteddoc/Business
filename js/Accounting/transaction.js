var transaction = {
    Save: function(id, branchId, transactionDate, eventId, accountId, transactionTypeId, processTypeId, amount, remarks) {
        if (branchId == 0) {
            swal({
                title: "Please select any branch.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (transactionDate == '') {
            swal({
                title: "Please select transaction date.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (eventId == 0) {
            swal({
                title: "Please select any event.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (accountId == 0) {
            swal({
                title: "Please select any account.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (transactionTypeId == 0) {
            swal({
                title: "Please select any transaction.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (processTypeId == 0) {
            swal({
                title: "Please select any process.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (amount == '' || amount < 0) {
            swal({
                title: "Please input any amount greater than 0.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (remarks == '') {
            swal({
                title: "Please input remarks.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            transactionDate = "'" + transactionDate + "'";
            remarks = "'" + remarks + "'";
            //console.log('Id: ' + id + ' Branch Id: ' + branchId + ' Transaction Date: ' + transactionDate + ' Event Id: ' + eventId + ' Account Id: ' + accountId + ' Transaction Type Id: ' + transactionTypeId + ' Process Type Id: ' + processTypeId + ' Amount: ' + amount + ' Remarks: ' + remarks);
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/Accounting/SaveTransaction',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    Id: id,
                    BranchId: branchId,
                    TransactionDate: transactionDate,
                    EventId: eventId,
                    AccountId: accountId,
                    TransactionTypeId: transactionTypeId,
                    ProcessTypeId: processTypeId,
                    Amount: amount,
                    Remarks: remarks
                },
                success: function(response) {
                    $(document).ajaxStop($.unblockUI);
                    if (response != null) {
                        console.log(response);
                        $('#txtAmount').val('');
                        $('#txtRemarks').val('');
                        $('#txtTransactionId').val(0);
                        $('#ddlBranch').val(branchId);
                        $('#txtEventId').val(eventId);
                        // $("#dtpTransactionDate").datepicker();
                        // $("#dtpTransactionDate").datepicker("setDate", new Date());
                        $('#ddlAccount').val(accountId);
                        $('#ddlTransactionType').val(transactionTypeId);
                        $('#ddlProcessType').val(processTypeId);
                        transaction.Search($('#dtpFromDate').val(), $('#dtpToDate').val(), $('#txtEventId').val(), $('#ddlBranchSearch option:selected').val(), $('#ddlAccountType option:selected').val(), $('#ddlAccountSearch option:selected').val(), 1, $('#ddlRowsPerPage option:selected').val());
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
    Search: function(fromDate, toDate, eventId, branchId, accountTypeId, accountId, pageNo, rowsPerPage) {
        console.log('From Date: ' + fromDate + ' To Date: ' + toDate + ' Event Id: ' + eventId + ' Account Type Id: ' + accountTypeId + 'AccountId: ' + accountId + ' BranchId: ' + branchId + ' Page No: ' + pageNo + ' Rows Per Page: ' + rowsPerPage);
        if (fromDate == '' || toDate == '') {
            swal({
                title: "Please select from date and to date.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (Date.parse(fromDate) > Date.parse(toDate)) {
            swal({
                title: "From Date is greater than To Date.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/Accounting/SearchTransaction',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    FromDate: fromDate,
                    ToDate: toDate,
                    EventId: eventId,
                    AccountTypeId: accountTypeId,
                    AccountId: accountId,
                    BranchId: branchId,
                    Page: pageNo,
                    RowsPerPage: rowsPerPage
                },
                success: function(response) {
                    if (response != null) {
                        console.log(response);
                        var table = '';
                        var pageNumber = '';
                        var totalRecords = '';
                        var total_Amount = '';
                        var rows = response.length;
                        var totalAmount = 0;
                        captionFromDate = utility.convertDateFormat(fromDate);
                        captionToDate = utility.convertDateFormat(toDate);
                        var caption = 'Transaction List (From ' + captionFromDate + ' To ' + captionToDate + ")";

                        table += '<table id="tbl_list" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>'
                            //+ '<th class="text-left" width="5%">Transaction Id</th>'
                            +
                            '<th class="text-left" width="10%">Transaction Date</th>'
                            //+ '<th class="text-left" width="10%">Event</th>'
                            +
                            '<th class="text-left" width="10%">Account</th>' +
                            '<th class="text-left" width="10%">Transaction Type</th>' +
                            '<th class="text-left" width="5%">Process Type</th>' +
                            '<th class="text-right" width="10%">Amount (Tk.)</th>' +
                            '<th class="text-left" width="20%">Remarks</th>' +
                            '<th class="text-left" width="5%">Is Processed</th>' +
                            '<th class="text-left" width="10%">Branch</th>' +
                            '<th class="text-center" width="5%">Delete</th>' +
                            '</tr>';

                        if (rows > 0) {
                            for (var r = 0; r < rows; r++) {
                                totalAmount += response[r]["Amount"];
                                table += '<tr>';
                                //table += '<td class="text-left">' + response[r]["TransactionId"] + '</td>';
                                table += '<td class="text-left">' + response[r]["TransactionDate"] + '</td>';
                                //table += '<td class="text-left">' + response[r]["Event"] + '</td>';
                                table += '<td class="text-left">' + response[r]["Account"] + '</td>';
                                table += '<td class="text-left">' + response[r]["TransactionType"] + '</td>';
                                table += '<td class="text-left">' + response[r]["ProcessType"] + '</td>';
                                table += '<td class="text-right">' + response[r]["Amount"] + '</td>';
                                table += '<td class="text-left">' + response[r]["Remarks"] + '</td>';
                                table += '<td class="text-left">' + response[r]["IsProcessed"] + '</td>';
                                table += '<td class="text-left">' + response[r]["Branch"] + '</td>';
                                if (response[r]["CanDelete"] == "Yes") {
                                    table += '<td class="text-center"><button class="btn btn-danger" onclick=transaction.Delete(' + response[r]["TransactionId"] + ')>Delete</button></td>';
                                } else {
                                    table += '<td class="text-center"></td>';
                                }
                                table += '</tr>';
                            }
                            table += '</table>';
                            pageNumber += '<ul class="pagination" style="float:left">';

                            if (response[0]["TotalRecords"] > 1) {
                                if (pageNo != 1) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:transaction.Search(' + "'" + fromDate + "'" + ',' + "'" + toDate + "'" + ',' + eventId + ',' + branchId + ',' + accountTypeId + ',' + accountId + ',' + (pageNo - 1) + ',' + rowsPerPage + ')>' + "Previous" + '</a></li>';
                                }
                                for (var itempage = 1; itempage <= response[0]["TotalPages"]; itempage++) {
                                    if (itempage == pageNo) {
                                        pageNumber += '<li class="page-item active"><a class="page-link" href=javascript:transaction.Search(' + "'" + fromDate + "'" + ',' + "'" + toDate + "'" + ',' + eventId + ',' + branchId + ',' + ',' + accountTypeId + ',' + accountId + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    } else {
                                        pageNumber += '<li class="page-item"><a class="page-link" href=javascript:transaction.Search(' + "'" + fromDate + "'" + ',' + "'" + toDate + "'" + ',' + eventId + ',' + branchId + ',' + ',' + accountTypeId + ',' + accountId + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    }
                                }
                                if (pageNo != response[0]["TotalPages"]) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:transaction.Search(' + "'" + fromDate + "'" + ',' + "'" + toDate + "'" + ',' + eventId + ',' + branchId + ',' + ',' + accountTypeId + ',' + accountId + ',' + (pageNo + 1) + ',' + rowsPerPage + ')>' + "Next" + '</a></li>';
                                }
                            }
                            pageNumber += '</ul>';
                            totalRecords = '<div style="float:right">Total Records: ' + response[0]["TotalRecords"] + '</div>';
                            total_Amount = '<br><div style="float:right">Total Amount: ' + totalAmount + '</div><br><br>';
                            $("#div_list").empty().append(total_Amount);
                            $("#div_list").append(table);
                            $("#div_list").append(pageNumber);
                            $("#div_list").append(totalRecords);
                        } else {
                            $("#div_list").empty();
                            $("#div_list").append('<div class="text-center">No record found</div>');
                        }
                    } else {
                        $("#div_list").empty();
                        $("#div_list").append('<div class="text-center">No record found</div>');
                    }
                    $(document).ajaxStop($.unblockUI);
                },
                error: function(exception) {
                    $(document).ajaxStop($.unblockUI);
                    main.errorMessage(exception);
                }
            });
        }
    },
    Delete: function(transactionId) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/DeleteTransaction',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Id: transactionId
            },
            success: function(response) {
                $(document).ajaxStop($.unblockUI);
                transaction.Search($('#dtpFromDate').val(), $('#dtpToDate').val(), $('#txtEventId').val(), $('#ddlBranchSearch option:selected').val(), $('#ddlAccountType option:selected').val(), $('#ddlAccountSearch option:selected').val(), 1, $('#ddlRowsPerPage option:selected').val());
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
    },
    LoadddlRowsPerPage: function() {
        var html = "";
        html += "<option value=" + 10000000 + ">All" + "</option>";
        html += "<option value=" + 100 + ">" + 100 + "</option>";
        html += "<option value=" + 200 + ">" + 200 + "</option>";
        html += "<option value=" + 300 + ">" + 300 + "</option>";
        html += "<option value=" + 500 + ">" + 500 + "</option>";
        $('#ddlRowsPerPage').html(html);
    },
    LoadddlBranch: function() {
        var html = "";
        var branchList = main.getBranchList();
        if (branchList != null) {
            for (var i = 0; i < branchList.length; i++) {
                html += "<option value=" + branchList[i].Id + ">" + branchList[i].Title + "</option>";
            }
        }
        $('#ddlBranch').html(html);
        $('#ddlBranchSearch').html(html);
    },
    LoadddlCurrency: function() {
        var html = "";
        var currencyList = [];
        currencyList.push("BDT");
        if (localStorage.getItem("USD")) {
            currencyList.push("USD");
        }
        if (localStorage.getItem("KWD")) {
            currencyList.push("KWD");
        }
        if (localStorage.getItem("EUR")) {
            currencyList.push("EUR");
        }
        if (localStorage.getItem("AED")) {
            currencyList.push("AED");
        }
        if (currencyList != null) {
            for (var i = 0; i < currencyList.length; i++) {
                html += "<option value=" + currencyList[i] + ">" + currencyList[i] + "</option>";
            }
        }
        $('#ddlCurrency').html(html);
        $('#ddlCurrencySearch').html(html);
    },
    LoadddlRentType: function() {
        var html = "";
        html += "<option value=" + 0 + ">All" + "</option>";
        html += "<option value=" + 61 + ">" + "Outside Dhaka" + "</option>";
        html += "<option value=" + 68 + ">" + "Inside Dhaka" + "</option>";
        html += "<option value=" + 87 + ">" + "Home Service" + "</option>";
        $('#ddlRentType').html(html);
    },
    LoadddlAllBranch: function() {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/GetAllBranchList',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Title + "</option>";
                    }
                    $('#ddlBranch').html(html);
                    $('#ddlBranchSearch').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    LoadddlEvent: function() {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/GetTransactionRegisterEvent',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Name + "</option>";
                    }
                    $('#ddlEvent').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    LoadddlAccountType: function(eventId, branchId) {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/GetTransactionRegisterAccountType',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                EventId: eventId,
                BranchId: branchId
            },
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Name + "</option>";
                    }
                    $('#ddlAccountType').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    LoadddlAccount: function(eventId, branchId) {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/GetTransactionRegisterAccount',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                EventId: eventId,
                BranchId: branchId
            },
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Name + "</option>";
                    }
                    $('#ddlAccount').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    LoadddlAccountSearch: function(eventId, branchId, accountTypeId) {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/GetTransactionRegisterAccountSearch',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                EventId: eventId,
                BranchId: branchId,
                AccountTypeId: accountTypeId
            },
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Name + "</option>";
                    }
                    $('#ddlAccountSearch').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    LoadddlTransactionType: function(eventId, accountId) {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/GetTransactionRegisterTransactionType',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                EventId: eventId,
                AccountId: accountId
            },
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Name + "</option>";
                    }
                    $('#ddlTransactionType').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    LoadddlProcessType: function(eventId, accountId, transactionTypeId) {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/GetTransactionRegisterProcessType',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                EventId: eventId,
                AccountId: accountId,
                TransactionTypeId: transactionTypeId
            },
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Name + "</option>";
                    }
                    $('#ddlProcessType').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    }
};