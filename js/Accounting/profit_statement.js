var profit_statement = {
    GetProfitStatement: function() {
        var fromDate = $("#dtpFromDate").val();
        var toDate = $("#dtpToDate").val();
        var branchId = $('#ddlBranch option:selected').val();
        var accountTypeId = $('#ddlRentType option:selected').val();
        var currency = $('#ddlCurrency option:selected').val();
        var currencyRate = 1;
        if (localStorage.getItem(currency)) {
            currencyRate = localStorage.getItem(currency);
        } else {
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
                url: localStorage.getItem("baseURL") + '/Accounting/GetProfitStatement',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    FromDate: fromDate,
                    ToDate: toDate,
                    BranchId: branchId,
                    AccountTypeId: accountTypeId
                },
                success: function(response) {
                    if (response != null) {
                        console.log(response);
                        var table = '';
                        var totalRecords = '';
                        captionFromDate = utility.convertDateFormat(fromDate);
                        captionToDate = utility.convertDateFormat(toDate);
                        var caption = 'Profit Statement (From ' + captionFromDate + ' To ' + captionToDate + ")";

                        table += '<table id="tbl_profit_statement" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>' +
                            '<th class="text-center" width="15%">Transaction Date</th>' +
                            '<th class="text-center" width="15%">Branch</th>' +
                            '<th class="text-center" width="35%">Rent</th>' +
                            '<th class="text-center" width="5%">Rent (Outside Dhaka) (' + currency + ')</th>' +
                            '<th class="text-center" width="5%">Rent (Inside Dhaka) (' + currency + ')</th>' +
                            '<th class="text-center" width="5%">Rent (Home Service) (' + currency + ')</th>' +
                            '<th class="text-center" width="5%">Gas (' + currency + ')</th>' +
                            '<th class="text-center" width="5%">Driver Commission (' + currency + ')</th>' +
                            '<th class="text-center" width="5%">Rent Commission (' + currency + ')</th>' +
                            '<th class="text-center" width="5%">Profit (' + currency + ')</th>'
                        '</tr>';

                        if (response.length > 0) {
                            var totalVehicleRent_OutsideDhaka = 0;
                            var totalVehicleRent_InsideDhaka = 0;
                            var totalVehicleRent_HomeService = 0;
                            var totalGas = 0;
                            var totalDriverCommission = 0;
                            var totalRentCommission = 0;
                            var totalProfit = 0;
                            for (var r = 0; r < response.length; r++) {
                                table += '<tr>';
                                table += '<td class="text-left">' + response[r]["Transaction_Date"] + '</td>';
                                table += '<td class="text-left">' + response[r]["Branch"] + '</td>';
                                table += '<td class="text-left">' + response[r]["Rent"] + '</td>';
                                table += '<td class="text-right">' + Math.round((response[r]["VehicleRent_OutsideDhaka"] * currencyRate)) + '</td>';
                                table += '<td class="text-right">' + Math.round((response[r]["VehicleRent_InsideDhaka"] * currencyRate)) + '</td>';
                                table += '<td class="text-right">' + Math.round((response[r]["VehicleRent_HomeService"] * currencyRate)) + '</td>';
                                table += '<td class="text-right">' + Math.round((response[r]["Gas"] * currencyRate)) + '</td>';
                                table += '<td class="text-right">' + Math.round((response[r]["DriverCommission"] * currencyRate)) + '</td>';
                                table += '<td class="text-right">' + Math.round((response[r]["RentCommission"] * currencyRate)) + '</td>';
                                table += '<td class="text-right">' + Math.round((response[r]["Profit"] * currencyRate)) + '</td>';
                                table += '</tr>';
                                totalVehicleRent_OutsideDhaka = totalVehicleRent_OutsideDhaka + response[r]["VehicleRent_OutsideDhaka"];
                                totalVehicleRent_InsideDhaka = totalVehicleRent_InsideDhaka + response[r]["VehicleRent_InsideDhaka"];
                                totalVehicleRent_HomeService = totalVehicleRent_HomeService + response[r]["VehicleRent_HomeService"];
                                totalGas = totalGas + response[r]["Gas"];
                                totalDriverCommission = totalDriverCommission + response[r]["DriverCommission"];
                                totalRentCommission = totalRentCommission + response[r]["RentCommission"];
                                totalProfit = totalProfit + response[r]["Profit"];
                            }
                            table += '<tr>';
                            table += '<td class="text-left"><b>' + '' + '</b></td>';
                            table += '<td class="text-left"><b>' + '' + '</b></td>';
                            table += '<td class="text-left"><b>' + 'Total' + '</b></td>';
                            table += '<td class="text-right"><b>' + Math.round((totalVehicleRent_OutsideDhaka * currencyRate)) + '</b></td>';
                            table += '<td class="text-right"><b>' + Math.round((totalVehicleRent_InsideDhaka * currencyRate)) + '</b></td>';
                            table += '<td class="text-right"><b>' + Math.round((totalVehicleRent_HomeService * currencyRate)) + '</b></td>';
                            table += '<td class="text-right"><b>' + Math.round((totalGas * currencyRate)) + '</b></td>';
                            table += '<td class="text-right"><b>' + Math.round((totalDriverCommission * currencyRate)) + '</b></td>';
                            table += '<td class="text-right"><b>' + Math.round((totalRentCommission * currencyRate)) + '</b></td>';
                            table += '<td class="text-right"><b>' + Math.round((totalProfit * currencyRate)) + '</b></td>';
                            table += '</tr>';

                            table += '</table>';
                            totalRecords = '<div style="float:right">Total Records: ' + response.length + '</div>';
                            $("#div_profit_statement").empty().append(table);
                            $("#div_profit_statement").append(totalRecords);
                        } else {
                            $("#div_profit_statement").empty().append(table);
                            $("#div_profit_statement").append('<div class="text-center">No record found</div>');
                        }
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
};