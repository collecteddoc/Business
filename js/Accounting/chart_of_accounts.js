var chart_of_accounts = {
    GetChartofAccounts: function () {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/GetChartofAccounts',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
            },
            success: function (response) {
                if (response != null) {
                    console.log(response);
                    var table = '';
                    var totalRecords = '';
                    var caption = 'Chart of Accounts';

                    table += '<table id="tbl_chart_of_accounts" class="table table-hover"><caption><b>' + caption + '</b></caption>';

                    table += '<tr>'
                        + '<th class="text-left" width="40%">Account</th>'
                        + '<th class="text-left" width="20%">Account Type</th>'
                        + '<th class="text-left" width="20%">Is Income Statement Account Head</th>'
                        + '<th class="text-left" width="20%">Is Balance Sheet Account Head</th>'
                        + '</tr>';

                    if (response.length > 0) {
                        for (var r = 0; r < response.length; r++) {
                            table += '<tr>';
                            if (response[r]["IsTransactionAllowed"] == "Yes") {
                                table += '<td class="text-left">' + response[r]["Account"] + '</td>';
                                table += '<td class="text-left">' + response[r]["AccountType"] + '</td>';
                                table += '<td class="text-left">' + response[r]["IsIncomeStatementAccountHead"] + '</td>';
                                table += '<td class="text-left">' + response[r]["IsBalanceSheetAccountHead"] + '</td>';
                            }
                            else {
                                table += '<td class="text-left"><b>' + response[r]["Account"] + '</b></td>';
                                table += '<td class="text-left"><b>' + response[r]["AccountType"] + '</b></td>';
                                table += '<td class="text-left"><b>' + response[r]["IsIncomeStatementAccountHead"] + '</b></td>';
                                table += '<td class="text-left"><b>' + response[r]["IsBalanceSheetAccountHead"] + '</b></td>';
                            }

                            table += '</tr>';
                        }
                        table += '</table>';
                        totalRecords = '<div style="float:right">Total Records: ' + response.length + '</div>';
                        $("#div_chart_of_accounts").empty().append(table);
                        $("#div_chart_of_accounts").append(totalRecords);
                    }
                    else {
                        $("#div_chart_of_accounts").empty().append(table);
                        $("#div_chart_of_accounts").append('<div class="text-center">No record found</div>');
                    }
                }
                $(document).ajaxStop($.unblockUI);
            },
            error: function (exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);
            }
        });
    },
};





