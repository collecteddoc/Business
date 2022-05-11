var account = {
    Save: function (id, branchId, name, accountTypeId, isActive) {
        if (branchId == 0) {
            swal({
                title: "Please select any branch.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        }
        else if (name == '') {
            swal({
                title: "Please input account name.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        }
        else {
            console.log('Id: ' + id + ' Name: ' + name + ' Account Type Id: ' + accountTypeId + ' Is Active: ' + isActive);
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/Accounting/SaveAccount',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    Id: id,
                    Name: name,
                    AccountTypeId: accountTypeId,
                    BranchId: branchId,
                    IsActive: isActive
                },
                success: function (response) {
                    $(document).ajaxStop($.unblockUI);
                    if (response != null) {
                        console.log(response);
                        $('#txtId').val(0);
                        $('#txtName').val('');
                        account.Search($('#txtSearchName').val(), $('#ddlBranchSearch option:selected').val(), $('#ddlSearchAccountType option:selected').val(), document.getElementById('chkSearchIsActive').checked, 1, $('#ddlRowsPerPage option:selected').val());
                        swal({
                            title: response.Message,
                            text: "",
                            icon: response.MessageType.toLowerCase(),
                            closeOnClickOutside: false
                        });
                    }
                },
                error: function (exception) {
                    $(document).ajaxStop($.unblockUI);
                    main.errorMessage(exception);
                }
            });
        }
    },
    Search: function (name, branchId, accountTypeId, isActive, pageNo, rowsPerPage) {
        $.blockUI({ message: main.loaderAnimation });
        //console.log('Name: ' + name + ' AccountTypeId: ' + accountTypeId + ' Is Active: ' + isActive + ' Page No: ' + pageNo + ' Rows Per Page: ' + rowsPerPage);
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/SearchAccount',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Name: name,
                AccountTypeId: accountTypeId,
                BranchId: branchId,
                IsActive: isActive,
                Page: pageNo,
                RowsPerPage: rowsPerPage
            },
            success: function (response) {
                if (response != null) {
                    console.log(response);
                    var table = '';
                    var pageNumber = '';
                    var totalRecords = '';
                    var rows = response.length;
                    var caption = 'Account List';

                    table += '<table id="tbl_list" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';

                    table += '<tr>'
                        //+ '<th class="text-left" width="5%">Id</th>'
                        + '<th class="text-left" width="15%">Account Type</th>'
                        + '<th class="text-left" width="20%">Name</th>'
                        + '<th class="text-left" width="10%">Branch</th>'
                        + '<th class="text-left" width="15%">Opening Date</th>'
                        + '<th class="text-left" width="15%">Closing Date</th>'
                        + '<th class="text-right" width="15%">Is Active</th>'
                        + '<th class="text-left" width="5%">Edit</th>'
                        + '<th class="text-center" width="5%">Delete</th>'
                        + '</tr>';

                    if (rows > 0) {
                        for (var r = 0; r < rows; r++) {
                            table += '<tr>';
                            //table += '<td class="text-left">' + response[r]["Id"] + '</td>';
                            table += '<td class="text-left">' + response[r]["AccountTypeName"] + '</td>';
                            table += '<td class="text-left">' + response[r]["Name"] + '</td>';
                            table += '<td class="text-left">' + response[r]["Branch"] + '</td>';
                            table += '<td class="text-left">' + response[r]["OpeningDate"] + '</td>';
                            table += '<td class="text-left">' + response[r]["ClosingDate"] + '</td>';
                            table += '<td class="text-right">' + response[r]["IsActive"] + '</td>';
                            table += '<td class="text-center">' + '<button class="btn btn-info" onclick=account.LoadAccount(' + response[r]["Id"] + ')>Edit</button>' + '</td>';
                            table += '<td class="text-center">' + '<button class="btn btn-danger" onclick=account.Delete(' + response[r]["Id"] + ')>Delete</button>' + '</td>';
                            table += '</tr>';
                        }
                        table += '</table>';
                        pageNumber += '<ul class="pagination" style="float:left">';

                        if (response[0]["TotalRecords"] > 1) {
                            if (pageNo != 1) {
                                pageNumber += '<li class="page-item"><a class="page-link" href=javascript:account.Search(' + "'" + name + "'" + ',' + accountTypeId + ',' + isActive + ',' + (pageNo - 1) + ',' + rowsPerPage + ')>' + "Previous" + '</a></li>';
                            }
                            for (var itempage = 1; itempage <= response[0]["TotalPages"]; itempage++) {
                                if (itempage == pageNo) {
                                    pageNumber += '<li class="page-item active"><a class="page-link" href=javascript:account.Search(' + "'" + name + "'" + ',' + accountTypeId + ',' + isActive + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                }
                                else {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:account.Search(' + "'" + name + "'" + ',' + accountTypeId + ',' + isActive + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                }
                            }
                            if (pageNo != response[0]["TotalPages"]) {
                                pageNumber += '<li class="page-item"><a class="page-link" href=javascript:account.Search(' + "'" + name + "'" + ',' + accountTypeId + ',' + isActive + ',' + (pageNo + 1) + ',' + rowsPerPage + ')>' + "Next" + '</a></li>';
                            }
                        }
                        pageNumber += '</ul>';
                        totalRecords = '<div style="float:right">Total Records: ' + response[0]["TotalRecords"]
                            + '</div>';
                        $("#div_list").empty().append(table);
                        $("#div_list").append(pageNumber);
                        $("#div_list").append(totalRecords);
                    }
                    else {
                        $("#div_list").empty();
                        $("#div_list").append('<div class="text-center">No record found</div>');
                    }
                }
                else {
                    $("#div_list").empty();
                    $("#div_list").append('<div class="text-center">No record found</div>');
                }
                $(document).ajaxStop($.unblockUI);
            },
            error: function (exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);
            }
        });
    },
    LoadAccount: function (accountId) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/GetAccountById',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                AccountId: accountId
            },
            success: function (response) {
                $(document).ajaxStop($.unblockUI);
                $('#txtId').val(response.Id);
                $('#ddlAccountType').val(response.AccountTypeId).trigger('change.select2');
                $('#ddlBranch').val(response.BranchId).trigger('change.select2');
                $('#txtName').val(response.Name);
                $('#chkIsActive').prop( "checked", response.IsActive );
            },
            error: function (exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);
            }
        });
    },
    Delete: function (accountId) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Accounting/DeleteAccount',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                AccountId: accountId
            },
            success: function (response) {
                $(document).ajaxStop($.unblockUI);
                account.Search($('#txtSearchName').val(), $('#ddlBranchSearch option:selected').val(), $('#ddlSearchAccountType option:selected').val(), document.getElementById('chkSearchIsActive').checked, 1, $('#ddlRowsPerPage option:selected').val());
                swal({
                    title: response.Message,
                    text: "",
                    icon: response.MessageType.toLowerCase(),
                    closeOnClickOutside: false
                });
            },
            error: function (exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);  
            }
        });
    },
    LoadddlRowsPerPage: function () {
        var html = "";
        html += "<option value=" + 10000000 + ">All" + "</option>";
        html += "<option value=" + 25 + ">" + 25 + "</option>";
        html += "<option value=" + 50 + ">" + 50 + "</option>";
        html += "<option value=" + 100 + ">" + 100 + "</option>";
        html += "<option value=" + 200 + ">" + 200 + "</option>";
        $('#ddlRowsPerPage').html(html);
    },
    LoadddlAccountType: function (eventId, branchId) {
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
            success: function (response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Name + "</option>";
                    }
                    $('#ddlAccountType').html(html);
                    $('#ddlSearchAccountType').html(html);
                }
            },
            error: function (exception) {
                main.errorMessage(exception);
            }
        });
    }
};





