var prizebond = {
    Save: function(id, number, ownerId, isActive) {
        if (ownerId == 0) {
            swal({
                title: "Please select owner.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (number == '') {
            swal({
                title: "Please input prize bond number.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            console.log('Id: ' + id + ' Number: ' + number + ' Owner Id: ' + ownerId + ' Is Active: ' + isActive);
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/PrizeBond/Save',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    Id: id,
                    Number: number,
                    OwnerId: ownerId,
                    IsActive: isActive
                },
                success: function(response) {
                    $(document).ajaxStop($.unblockUI);
                    if (response != null) {
                        console.log(response);
                        $('#txtId').val(0);
                        $('#txtNumber').val('');
                        prizebond.Search($('#txtSearchNumber').val(), $('#ddlSearchOwner option:selected').val(), document.getElementById('chkSearchIsActive').checked, 1, $('#ddlRowsPerPage option:selected').val());
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
    Search: function(number, ownerId, isActive, pageNo, rowsPerPage) {
        $.blockUI({ message: main.loaderAnimation });
        console.log('Number: ' + number + ' OwnerId: ' + ownerId + ' Is Active: ' + isActive + ' Page No: ' + pageNo + ' Rows Per Page: ' + rowsPerPage);
        $.ajax({
            url: localStorage.getItem("baseURL") + '/PrizeBond/Search',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Number: number,
                OwnerId: ownerId,
                IsActive: isActive,
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
                    var caption = 'Prize Bond List';

                    table += '<table id="tbl_list" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';

                    table += '<tr>' +
                        '<th class="text-left" width="25%">Number</th>' +
                        '<th class="text-left" width="30%">Owner</th>' +
                        '<th class="text-right" width="10%">Is Active</th>' +
                        '<th class="text-right" width="15%">Is Synced</th>' +
                        '<th class="text-left" width="10%">Edit</th>' +
                        '<th class="text-center" width="10%">Delete</th>' +
                        '</tr>';
                    if (rows > 0) {
                        for (var r = 0; r < rows; r++) {
                            table += '<tr>';
                            table += '<td class="text-left">' + response[r]["Number"] + '</td>';
                            table += '<td class="text-left">' + response[r]["OwnerName"] + '</td>';
                            table += '<td class="text-right">' + response[r]["IsActive"] + '</td>';
                            table += '<td class="text-right">' + response[r]["IsSynced"] + '</td>';
                            table += '<td class="text-center">' + '<button class="btn btn-info" onclick=prizebond.LoadPrizeBond(' + response[r]["Id"] + ')>Edit</button>' + '</td>';
                            table += '<td class="text-center">' + '<button class="btn btn-danger" onclick=prizebond.Delete(' + response[r]["Id"] + ')>Delete</button>' + '</td>';
                            table += '</tr>';
                        }
                        table += '</table>';
                        pageNumber += '<ul class="pagination" style="float:left">';

                        if (response[0]["TotalRecords"] > 1) {
                            if (pageNo != 1) {
                                pageNumber += '<li class="page-item"><a class="page-link" href=javascript:prizebond.Search(' + "'" + number + "'" + ',' + ownerId + ',' + isActive + ',' + (pageNo - 1) + ',' + rowsPerPage + ')>' + "Previous" + '</a></li>';
                            }
                            for (var itempage = 1; itempage <= response[0]["TotalPages"]; itempage++) {
                                if (itempage == pageNo) {
                                    pageNumber += '<li class="page-item active"><a class="page-link" href=javascript:prizebond.Search(' + "'" + number + "'" + ',' + ownerId + ',' + isActive + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                } else {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:prizebond.Search(' + "'" + number + "'" + ',' + ownerId + ',' + isActive + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                }
                            }
                            if (pageNo != response[0]["TotalPages"]) {
                                pageNumber += '<li class="page-item"><a class="page-link" href=javascript:prizebond.Search(' + "'" + number + "'" + ',' + ownerId + ',' + isActive + ',' + (pageNo + 1) + ',' + rowsPerPage + ')>' + "Next" + '</a></li>';
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
    },
    LoadPrizeBond: function(id) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/PrizeBond/GetById',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Id: id
            },
            success: function(response) {
                $(document).ajaxStop($.unblockUI);
                $('#txtId').val(response.Id);
                $('#ddlOwner').val(response.OwnerId).trigger('change.select2');
                $('#txtNumber').val(response.Number);
                $('#chkIsActive').prop("checked", response.IsActive);
            },
            error: function(exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);
            }
        });
    },
    Delete: function(id) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/PrizeBond/Delete',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Id: id
            },
            success: function(response) {
                $(document).ajaxStop($.unblockUI);
                prizebond.Search($('#txtSearchNumber').val(), $('#ddlSearchOwner option:selected').val(), document.getElementById('chkSearchIsActive').checked, 1, $('#ddlRowsPerPage option:selected').val());
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
        html += "<option value=" + 25 + ">" + 25 + "</option>";
        html += "<option value=" + 50 + ">" + 50 + "</option>";
        html += "<option value=" + 100 + ">" + 100 + "</option>";
        html += "<option value=" + 200 + ">" + 200 + "</option>";
        $('#ddlRowsPerPage').html(html);
    },
    LoadddlOwner: function() {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/PrizeBond/GetPrizeBondOwner',
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
                    $('#ddlOwner').html(html);
                    $('#ddlSearchOwner').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    }
};