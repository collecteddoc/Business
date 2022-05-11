var voucher = {
    Search: function(fromDate, toDate, branchId, pageNo, rowsPerPage) {
        //console.log('From Date: ' + fromDate + ' To Date: ' + toDate + ' Page No: ' + pageNo + ' Rows Per Page: ' + rowsPerPage);
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
                url: localStorage.getItem("baseURL") + '/Accounting/SearchVoucher',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    FromDate: fromDate,
                    ToDate: toDate,
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
                        var rows = response.length;
                        captionFromDate = utility.convertDateFormat(fromDate);
                        captionToDate = utility.convertDateFormat(toDate);
                        var caption = 'Voucher List (From ' + captionFromDate + ' To ' + captionToDate + ")";

                        table += '<table id="tbl_list" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>' +
                            '<th class="text-left" width="15%">Voucher Date</th>' +
                            '<th class="text-left" width="15%">Voucher No</th>' +
                            '<th class="text-left" width="15%">Narration</th>' +
                            '<th class="text-left" width="15%">Account</th>' +
                            '<th class="text-left" width="5%">Debit (Tk.)</th>' +
                            '<th class="text-left" width="5%">Credit (Tk.)</th>' +
                            '<th class="text-right" width="10%">Voucher Type</th>' +
                            '<th class="text-right" width="5%">Reference Transaction Id</th>' +
                            '<th class="text-left" width="15%">Remarks</th>' +
                            '<th class="text-left" width="5%">Branch</th>'
                            //+ '<th class="text-left" width="5%">Is Rectified</th>'
                            //+ '<th class="text-left" width="5%">Reference Voucher No</th>'
                            +
                            '</tr>';
                        var previousVoucherNo = "";
                        var currentStyle = "";
                        var style1 = '<tr style="background-color:#f0a0b2">';
                        var style2 = '<tr style="background-color:#ffffe2">';
                        var isChange = false;
                        var voucherEntryDate = "";
                        var voucherNo = "";
                        var narration = "";
                        var voucherType = "";
                        var referenceTransactionId = "";
                        var remarks = "";
                        var debit = "";
                        var credit = "";
                        if (rows > 0) {
                            for (var r = 0; r < rows; r++) {
                                if (response[r]["VoucherNo"] == previousVoucherNo) {
                                    isChange = false;
                                } else {
                                    isChange = true;
                                }

                                if (isChange) {
                                    if (currentStyle == style1) {
                                        currentStyle = style2;
                                    } else {
                                        currentStyle = style1;
                                    }
                                    voucherEntryDate = response[r]["VoucherEntryDate"];
                                    voucherNo = response[r]["VoucherNo"];
                                    narration = response[r]["Narration"];
                                    voucherType = response[r]["VoucherType"];
                                    referenceTransactionId = response[r]["ReferenceTransactionId"];
                                    remarks = response[r]["Remarks"];
                                } else {
                                    voucherEntryDate = "";
                                    voucherNo = "";
                                    narration = "";
                                    voucherType = "";
                                    referenceTransactionId = "";
                                    remarks = "";
                                }
                                if (response[r]["Debit"] == 0) {
                                    debit = "";
                                } else if (response[r]["Debit"] > 0) {
                                    debit = response[r]["Debit"];
                                } else {
                                    debit = "(" + (-1 * response[r]["Debit"]) + ")";
                                }
                                if (response[r]["Credit"] == 0) {
                                    credit = "";
                                } else if (response[r]["Credit"] > 0) {
                                    credit = response[r]["Credit"];
                                } else {
                                    credit = "(" + (-1 * response[r]["Credit"]) + ")";
                                }
                                previousVoucherNo = response[r]["VoucherNo"];
                                table += currentStyle;
                                table += '<td class="text-left">' + voucherEntryDate + '</td>';
                                table += '<td class="text-left">' + voucherNo + '</td>';
                                table += '<td class="text-left">' + narration + '</td>';
                                table += '<td class="text-left">' + response[r]["AccountHead"] + '</td>';
                                table += '<td class="text-left">' + debit + '</td>';
                                table += '<td class="text-left">' + credit + '</td>';
                                table += '<td class="text-right">' + voucherType + '</td>';
                                table += '<td class="text-right">' + referenceTransactionId + '</td>';
                                table += '<td class="text-left">' + remarks + '</td>';
                                table += '<td class="text-left">' + response[r]["Branch"] + '</td>';
                                //table += '<td class="text-left">' + response[r]["IsRectified"] + '</td>';
                                //table += '<td class="text-left">' + response[r]["ReferenceVoucherNo"] + '</td>';
                                table += '</tr>';
                            }
                            table += '</table>';
                            pageNumber += '<ul class="pagination" style="float:left">';

                            if (response[0]["TotalRecords"] > 1) {
                                if (pageNo != 1) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:voucher.Search(' + "'" + fromDate + "'" + ',' + "'" + toDate + "'" + ',' + (pageNo - 1) + ',' + rowsPerPage + ')>' + "Previous" + '</a></li>';
                                }
                                for (var itempage = 1; itempage <= response[0]["TotalPages"]; itempage++) {
                                    if (itempage == pageNo) {
                                        pageNumber += '<li class="page-item active"><a class="page-link" href=javascript:voucher.Search(' + "'" + fromDate + "'" + ',' + "'" + toDate + "'" + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    } else {
                                        pageNumber += '<li class="page-item"><a class="page-link" href=javascript:voucher.Search(' + "'" + fromDate + "'" + ',' + "'" + toDate + "'" + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    }
                                }
                                if (pageNo != response[0]["TotalPages"]) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:voucher.Search(' + "'" + fromDate + "'" + ',' + "'" + toDate + "'" + ',' + (pageNo + 1) + ',' + rowsPerPage + ')>' + "Next" + '</a></li>';
                                }
                            }
                            pageNumber += '</ul>';
                            totalRecords = '<div style="float:right">Total Records: ' + response[0]["TotalRecords"] +
                                '</div>';
                            $("#div_list").empty().append(table);
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
    }
};