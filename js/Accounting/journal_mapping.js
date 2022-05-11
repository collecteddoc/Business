var journal_mapping = {
    GetJournalMapping: function () {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/GetJournalMapping',
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
                    var caption = 'Journal Mapping';

                    table += '<table id="tbl_journal_mapping" class="table table-hover"><caption><b>' + caption + '</b></caption>';

                    table += '<tr>'
                        + '<th class="text-left" width="5%">Id</th>'
                        + '<th class="text-left" width="10%">Event</th>'
                        + '<th class="text-left" width="10%">Account Type</th>'
                        + '<th class="text-left" width="10%">Transaction Type</th>'
                        + '<th class="text-left" width="10%">Process Type</th>'
                        + '<th class="text-left" width="10%">Debit Side Account Head</th>'
                        + '<th class="text-left" width="10%">Credit Side Account Head</th>'
                        + '<th class="text-left" width="20%">Narration</th>'
                        + '<th class="text-left" width="10%">Voucher Type</th>'
                        + '<th class="text-left" width="5%">Is Active</th>'
                        + '</tr>';

                    if (response.length > 0) {
                        for (var r = 0; r < response.length; r++) {
                            table += '<tr>';
                            table += '<td class="text-left">' + response[r]["Id"] + '</td>';
                            table += '<td class="text-left">' + response[r]["Event"] + '</td>';
                            table += '<td class="text-left">' + response[r]["AccountType"] + '</td>';
                            table += '<td class="text-left">' + response[r]["TransactionType"] + '</td>';
                            table += '<td class="text-left">' + response[r]["ProcessType"] + '</td>';
                            table += '<td class="text-left">' + response[r]["DebitSideAccountHead"] + '</td>';
                            table += '<td class="text-left">' + response[r]["CreditSideAccountHead"] + '</td>';
                            table += '<td class="text-left">' + response[r]["Narration"] + '</td>';
                            table += '<td class="text-left">' + response[r]["VoucherType"] + '</td>';
                            table += '<td class="text-left">' + response[r]["IsActive"] + '</td>';
                            table += '</tr>';
                        }
                        table += '</table>';
                        totalRecords = '<div style="float:right">Total Records: ' + response.length + '</div>';
                        $("#div_journal_mapping").empty().append(table);
                        $("#div_journal_mapping").append(totalRecords);
                    }
                    else {
                        $("#div_journal_mapping").empty().append(table);
                        $("#div_journal_mapping").append('<div class="text-center">No record found</div>');
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





