var cash_book = {
    GetCashBook: function () {
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
                url: localStorage.getItem("baseURL") + '/Accounting/GetCashBook',
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
                        var caption = 'Cash Book (From ' + captionFromDate + ' To ' + captionToDate + ")";

                        table += '<table id="tbl_cash_book" class="table table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>'
                            + '<th class="text-left" width="20%">Transaction Date</th>'
                            + '<th class="text-left" width="40%">Particulars</th>'
                            + '<th class="text-right" width="40%">Amount ('+ currency +')</th>'
                            + '</tr>';

                        if (response.length > 0) {
                            for (var r = 0; r < response.length; r++) {
                                var amount = "";
                                if (response[r]["Amount"] >= 0) {
                                    amount = Math.round((response[r]["Amount"] * currencyRate))
                                }
                                else {
                                    amount = "(" + Math.round((-1 * response[r]["Amount"] * currencyRate)) + ")";
                                }

                                table += '<tr>';
                                if (response[r]["IsHead"] == "No") {
                                    table += '<td class="text-left">' + response[r]["TransactionDate"] + '</td>';
                                    table += '<td class="text-left">' + response[r]["Particulars"] + '</td>';
                                    table += '<td class="text-right">' + amount + '</td>';
                                }
                                else {
                                    table += '<td class="text-left"><b>' + response[r]["TransactionDate"] + '</b></td>';
                                    table += '<td class="text-left"><b>' + response[r]["Particulars"] + '</b></td>';
                                    table += '<td class="text-right"><b>' + amount + '</b></td>';
                                }

                                table += '</tr>';
                            }
                            table += '</table>';

                            totalRecords = '<div style="float:right">Total Records: ' + response.length + '</div>';
                            $("#div_cash_book").empty().append(table);
                            $("#div_cash_book").append(totalRecords);
                        }
                        else {
                            $("#div_cash_book").empty().append(table);
                            $("#div_cash_book").append('<div class="text-center">No record found</div>');
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





