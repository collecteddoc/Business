var income_statement = {
    GetIncomeStatement: function () {
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
                url: localStorage.getItem("baseURL") + '/Accounting/GetIncomeStatement',
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
                        var caption = 'Income Statement (From ' + captionFromDate + ' To ' + captionToDate + ")";

                        table += '<table id="tbl_income_statement" class="table table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>'
                            + '<th class="text-left" width="60%"></th>'
                            + '<th class="text-right" width="40%">Amount ('+ currency +')</th>'
                            + '</tr>';

                        if (response.length > 0) {
                            for (var r = 0; r < response.length; r++) {
                                table += '<tr>';
                                if (response[r]["IsTransactionAllowed"] == "Yes") {
                                    table += '<td class="text-left">' + response[r]["Account"] + '</td>';
                                    table += '<td class="text-right">' + Math.round((response[r]["Amount"] * currencyRate)) + '</td>';
                                }
                                else {
                                    table += '<td class="text-left"><b>' + response[r]["Account"] + '</b></td>';
                                    table += '<td class="text-right"><b>' + Math.round((response[r]["Amount"] * currencyRate)) + '</b></td>';
                                }

                                table += '</tr>';
                            }
                            table += '</table>';
                            totalRecords = '<div style="float:right">Total Records: ' + response.length + '</div>';
                            $("#div_income_statement").empty().append(table);
                            $("#div_income_statement").append(totalRecords);
                        }
                        else {
                            $("#div_income_statement").empty().append(table);
                            $("#div_income_statement").append('<div class="text-center">No record found</div>');
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





