var ledger = {
    GetLedger: function (fromDate, toDate, accountHeadId, branchId, currency) {
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
                url: localStorage.getItem("baseURL") + '/Accounting/GetLedger',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    FromDate: '' + fromDate + '',
                    ToDate: '' + toDate + '',
                    AccountHeadId: accountHeadId,
                    BranchId: branchId
                },
                success: function (response) {
                    if (response != null) {
                        console.log(response);
                        var table = '';
                        var totalRecords = '';
                        captionFromDate = utility.convertDateFormat(fromDate);
                        captionToDate = utility.convertDateFormat(toDate);
                        var caption = 'Ledger (From ' + captionFromDate + ' To ' + captionToDate + ")";

                        table += '<table id="tbl_ledger" class="table table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>'
                            + '<th class="text-left" width="15%">Account</th>'
                            + '<th class="text-left" width="10%">Voucher Entry Date</th>'
                            + '<th class="text-left" width="10%">Voucher No</th>'
                            + '<th class="text-left" width="10%">Narration</th>'
                            + '<th class="text-right" width="10%">Debit (' + currency + ')</th>'
                            + '<th class="text-right" width="10%">Credit (' + currency + ')</th>'
                            + '<th class="text-right" width="10%">Balance (' + currency + ')</th>'
                            + '<th class="text-left" width="10%">Branch</th>'
                            + '<th class="text-right" width="5%">Reference Transaction Id</th>'
                            + '<th class="text-left" width="10%">Remarks</th>'
                            + '</tr>';

                        if (response.length > 0) {
                            for (var r = 0; r < response.length; r++) {
                                var balance = "";
                                var debit = "";
                                var credit = "";
                                var referenceTransactionId = "";

                                if(response[r]["Debit"] == 0)
                                {
                                    debit = "";
                                }
                                else if(response[r]["Debit"] > 0)
                                {
                                    debit = Math.round(response[r]["Debit"] * currencyRate);
                                }
                                else
                                {
                                    debit = "(" + Math.round((-1 * response[r]["Debit"] * currencyRate)) + ")";
                                }

                                if(response[r]["Credit"] == 0)
                                {
                                    credit = "";
                                }
                                else if(response[r]["Credit"] > 0)
                                {
                                    credit = Math.round(response[r]["Credit"] * currencyRate);
                                }
                                else
                                {
                                    credit = "(" + Math.round((-1 * response[r]["Credit"] * currencyRate)) + ")";
                                }

                                if(response[r]["Balance"] == 0)
                                {
                                    balance = 0;
                                }
                                else if(response[r]["Balance"] > 0)
                                {
                                    balance = Math.round(response[r]["Balance"] * currencyRate);
                                }
                                else
                                {
                                    balance = "(" + Math.round((-1 * response[r]["Balance"] * currencyRate)) + ")";
                                }
                                
                                if(response[r]["ReferenceTransactionId"] == 0)
                                {
                                    referenceTransactionId = "";
                                }
                                else if(response[r]["ReferenceTransactionId"] > 0)
                                {
                                    referenceTransactionId = response[r]["ReferenceTransactionId"];
                                }

                                table += '<tr>';
                                table += '<td class="text-left">' + response[r]["AccountHead"] + '</td>';
                                table += '<td class="text-left">' + response[r]["VoucherEntryDate"] + '</td>';
                                table += '<td class="text-left">' + response[r]["VoucherNo"] + '</td>';
                                table += '<td class="text-left">' + response[r]["Narration"] + '</td>';
                                table += '<td class="text-right">' + debit + '</td>';
                                table += '<td class="text-right">' + credit + '</td>';
                                table += '<td class="text-right">' + balance + '</td>';
                                table += '<td class="text-left">' + response[r]["Branch"] + '</td>';
                                table += '<td class="text-right">' + referenceTransactionId + '</td>';
                                table += '<td class="text-left">' + response[r]["Remarks"] + '</td>';
                                table += '</tr>';
                            }
                            table += '</table>';

                            totalRecords = '<div style="float:right">Total Records: ' + response.length + '</div>';
                            $("#div_ledger").empty().append(table);
                            $("#div_ledger").append(totalRecords);
                        }
                        else {
                            $("#div_ledger").empty().append(table);
                            $("#div_ledger").append('<div class="text-center">No record found</div>');
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