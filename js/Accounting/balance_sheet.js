var balance_sheet = {
    GetBalanceSheet: function () {
        var fromDate = $("#dtpFromDate").val();
        var toDate = $("#dtpToDate").val();
        var branchId = $('#ddlBranch option:selected').val();
        var currency = $('#ddlCurrency option:selected').val();
        var currencyRate = 1;
        if (localStorage.getItem(currency)) {
            currencyRate = localStorage.getItem(currency);
        }
        else {
            currency = "BDT";
            currencyRate = 1;
        }
        if (fromDate == '' || toDate == '') {
            swal({
                title: "Please select from date and to date.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        }
        else if (Date.parse(fromDate) > Date.parse(toDate)) {
            swal({
                title: "From Date is greater than To Date.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        }
        else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/Accounting/GetBalanceSheet',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    FromDate: fromDate,
                    ToDate: toDate,
                    BranchId: branchId
                },
                success: function (response) {
                    if (response != null) {
                        console.log(response);
                        var table = '';
                        var totalRecords = '';
                        captionFromDate = utility.convertDateFormat(fromDate);
                        captionToDate = utility.convertDateFormat(toDate);
                        var caption = 'Balance Sheet (From ' + captionFromDate + ' To ' + captionToDate + ")";

                        table += '<table id="tbl_balance_sheet" class="table table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>'
                            + '<th class="text-left" width="40%"></th>'
                            + '<th class="text-right" width="20%">Opening Balance (' + currency + ')</th>'
                            + '<th class="text-right" width="20%">During The Period Balance (' + currency + ')</th>'
                            + '<th class="text-right" width="20%">Closing Balance (' + currency + ')</th>'
                            + '</tr>';

                        if (response.length > 0) {
                            for (var r = 0; r < response.length; r++) {
                                var openingBalance = "";
                                if (response[r]["OpeningBalance"] >= 0) {
                                    openingBalance = Math.round(response[r]["OpeningBalance"] * currencyRate);
                                }
                                else {
                                    openingBalance = "(" + Math.round((-1 * response[r]["OpeningBalance"] * currencyRate)) + ")";
                                }
                                var duringThePeriodBalance = "";
                                if (response[r]["DuringThePeriodBalance"] >= 0) {
                                    duringThePeriodBalance = Math.round(response[r]["DuringThePeriodBalance"] * currencyRate);
                                }
                                else {
                                    duringThePeriodBalance = "(" + Math.round((-1 * response[r]["DuringThePeriodBalance"] * currencyRate)) + ")";
                                }
                                var closingBalance = "";
                                if (response[r]["ClosingBalance"] >= 0) {
                                    closingBalance = Math.round(response[r]["ClosingBalance"] * currencyRate);
                                }
                                else {
                                    closingBalance = "(" + Math.round((-1 * response[r]["ClosingBalance"] * currencyRate)) + ")";
                                }
                                table += '<tr>';
                                if (response[r]["IsTransactionAllowed"] == "Yes") {
                                    table += '<td class="text-left">' + response[r]["Account"] + '</td>';
                                    table += '<td class="text-right">' + openingBalance + '</td>';
                                    table += '<td class="text-right">' + duringThePeriodBalance + '</td>';
                                    table += '<td class="text-right"><a href="' + '' + '/html/Accounting/ledger.html?fromDate=' + fromDate + '' + '&toDate=' + toDate + '' + '&accountHeadId=' + response[r]["AccountId"] + '&branchId=' + branchId + '&currency=' + '' + currency + '' +'" target="_blank">' + closingBalance + '</a></td>';
                                }
                                else {
                                    table += '<td class="text-left"><b>' + response[r]["Account"] + '</b></td>';
                                    table += '<td class="text-right"><b>' + openingBalance + '</b></td>';
                                    table += '<td class="text-right"><b>' + duringThePeriodBalance + '</b></td>';
                                    table += '<td class="text-right"><b>' + closingBalance + '</b></td>';
                                }

                                table += '</tr>';
                            }
                            table += '</table>';

                            totalRecords = '<div style="float:right">Total Records: ' + response.length + '</div>';
                            $("#div_balance_sheet").empty().append(table);
                            $("#div_balance_sheet").append(totalRecords);
                        }
                        else {
                            $("#div_balance_sheet").empty().append(table);
                            $("#div_balance_sheet").append('<div class="text-center">No record found</div>');
                        }
                    }
                    $(document).ajaxStop($.unblockUI);
                },
                error: function (exception) {
                    $(document).ajaxStop($.unblockUI);
                    main.errorMessage(exception);
                }
            });
        }
    },
};