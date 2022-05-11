var user_permission = {
    SaveRoleMenuAssign: function(roleId, menuId) {
        if (roleId <= 0) {
            swal({
                title: "Please select any role.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (menuId <= 0) {
            swal({
                title: "Please select any menu.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/UserPermission/SaveRoleMenuAssign',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    RoleId: roleId,
                    MenuId: menuId
                },
                success: function(response) {
                    $(document).ajaxStop($.unblockUI);
                    if (response != null) {
                        user_permission.SearchRoleMenuAssign($('#ddlRoleSearch option:selected').val(), $('#ddlMenuSearch option:selected').val(), 1, $('#ddlRowsPerPage option:selected').val());
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
    SaveUserBranchAssign: function(profileId, branchId) {
        if (profileId <= 0) {
            swal({
                title: "Please select any user.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (branchId <= 0) {
            swal({
                title: "Please select any branch.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/UserPermission/SaveUserBranchAssign',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    ProfileId: profileId,
                    BranchId: branchId
                },
                success: function(response) {
                    $(document).ajaxStop($.unblockUI);
                    if (response != null) {
                        user_permission.SearchUserBranchAssign($('#ddlUserProfileSearch option:selected').val(), $('#ddlBranchSearch option:selected').val(), 1, $('#ddlRowsPerPage option:selected').val());
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
    SaveUserRoleAssign: function(profileId, roleId) {
        if (profileId <= 0) {
            swal({
                title: "Please select any user.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (roleId <= 0) {
            swal({
                title: "Please select any role.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/UserPermission/SaveUserRoleAssign',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    ProfileId: profileId,
                    RoleId: roleId
                },
                success: function(response) {
                    $(document).ajaxStop($.unblockUI);
                    if (response != null) {
                        user_permission.SearchUserRoleAssign($('#ddlUserProfileSearch option:selected').val(), $('#ddlRoleSearch option:selected').val(), 1, $('#ddlRowsPerPage option:selected').val());
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
    SaveUserProfile: function(id, name, mobile, address) {
        if (name == "") {
            swal({
                title: "Please enter name.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (mobile == "") {
            swal({
                title: "Please enter mobile.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (address == "") {
            swal({
                title: "Please enter address.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/UserPermission/SaveUserProfile',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    Id: id,
                    Name: name,
                    Mobile: mobile,
                    Address: address
                },
                success: function(response) {
                    $(document).ajaxStop($.unblockUI);
                    if (response != null) {
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
    SearchRoleMenuAssign: function(roleId, menuId, pageNo, rowsPerPage) {
        if (roleId == '') {
            swal({
                title: "Please select role.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (menuId == '') {
            swal({
                title: "Please select menu.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/UserPermission/SearchRoleMenuAssign',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    RoleId: roleId,
                    MenuId: menuId,
                    Page: pageNo,
                    RowsPerPage: rowsPerPage
                },
                success: function(response) {
                    if (response != null) {
                        console.log(response);
                        var table = '';
                        var pageNumber = '';
                        var totalRecords = '';
                        var total_Amount = '';
                        var rows = response.length;
                        var totalAmount = 0;
                        var caption = 'Role wise menu assign';

                        table += '<table id="tbl_list" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>' +
                            '<th class="text-left" width="45%">Role</th>' +
                            '<th class="text-left" width="45%">Menu</th>' +
                            '<th class="text-center" width="10%">Delete</th>' +
                            '</tr>';

                        if (rows > 0) {
                            for (var r = 0; r < rows; r++) {
                                table += '<tr>';
                                table += '<td class="text-left">' + response[r]["RoleTitle"] + '</td>';
                                table += '<td class="text-left">' + response[r]["MenuTitle"] + '</td>';
                                table += '<td class="text-center"><button class="btn btn-danger" onclick=user_permission.DeleteRoleMenuAssign(' + response[r]["Id"] + ')>Delete</button></td>';
                                table += '</tr>';
                            }
                            table += '</table>';
                            pageNumber += '<ul class="pagination" style="float:left">';

                            if (response[0]["TotalRecords"] > 1) {
                                if (pageNo != 1) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchRoleMenuAssign(' + roleId + ',' + menuId + ',' + (pageNo - 1) + ',' + rowsPerPage + ')>' + "Previous" + '</a></li>';
                                }
                                for (var itempage = 1; itempage <= response[0]["TotalPages"]; itempage++) {
                                    if (itempage == pageNo) {
                                        pageNumber += '<li class="page-item active"><a class="page-link" href=javascript:user_permission.SearchRoleMenuAssign(' + roleId + ',' + menuId + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    } else {
                                        pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchRoleMenuAssign(' + roleId + ',' + menuId + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    }
                                }
                                if (pageNo != response[0]["TotalPages"]) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchRoleMenuAssign(' + roleId + ',' + menuId + ',' + (pageNo + 1) + ',' + rowsPerPage + ')>' + "Next" + '</a></li>';
                                }
                            }
                            pageNumber += '</ul>';
                            totalRecords = '<div style="float:right">Total Records: ' + response[0]["TotalRecords"] + '</div>';
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
    },
    SearchUserBranchAssign: function(profileId, branchId, pageNo, rowsPerPage) {
        if (profileId == '') {
            swal({
                title: "Please select profile.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (branchId == '') {
            swal({
                title: "Please select branch.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/UserPermission/SearchUserBranchAssign',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    ProfileId: profileId,
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
                        var total_Amount = '';
                        var rows = response.length;
                        var totalAmount = 0;
                        var caption = 'Role wise menu assign';

                        table += '<table id="tbl_list" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>' +
                            '<th class="text-left" width="45%">User</th>' +
                            '<th class="text-left" width="45%">Branch</th>' +
                            '<th class="text-center" width="10%">Delete</th>' +
                            '</tr>';

                        if (rows > 0) {
                            for (var r = 0; r < rows; r++) {
                                table += '<tr>';
                                table += '<td class="text-left">' + response[r]["ProfileTitle"] + '</td>';
                                table += '<td class="text-left">' + response[r]["BranchTitle"] + '</td>';
                                table += '<td class="text-center"><button class="btn btn-danger" onclick=user_permission.DeleteUserBranchAssign(' + response[r]["Id"] + ')>Delete</button></td>';
                                table += '</tr>';
                            }
                            table += '</table>';
                            pageNumber += '<ul class="pagination" style="float:left">';

                            if (response[0]["TotalRecords"] > 1) {
                                if (pageNo != 1) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchUserBranchAssign(' + profileId + ',' + branchId + ',' + (pageNo - 1) + ',' + rowsPerPage + ')>' + "Previous" + '</a></li>';
                                }
                                for (var itempage = 1; itempage <= response[0]["TotalPages"]; itempage++) {
                                    if (itempage == pageNo) {
                                        pageNumber += '<li class="page-item active"><a class="page-link" href=javascript:user_permission.SearchUserBranchAssign(' + profileId + ',' + branchId + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    } else {
                                        pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchUserBranchAssign(' + profileId + ',' + branchId + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    }
                                }
                                if (pageNo != response[0]["TotalPages"]) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchUserBranchAssign(' + profileId + ',' + branchId + ',' + (pageNo + 1) + ',' + rowsPerPage + ')>' + "Next" + '</a></li>';
                                }
                            }
                            pageNumber += '</ul>';
                            totalRecords = '<div style="float:right">Total Records: ' + response[0]["TotalRecords"] + '</div>';
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
    },
    SearchUserRoleAssign: function(profileId, roleId, pageNo, rowsPerPage) {
        if (profileId == '') {
            swal({
                title: "Please select profile.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (roleId == '') {
            swal({
                title: "Please select role.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/UserPermission/SearchUserRoleAssign',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    ProfileId: profileId,
                    RoleId: roleId,
                    Page: pageNo,
                    RowsPerPage: rowsPerPage
                },
                success: function(response) {
                    if (response != null) {
                        console.log(response);
                        var table = '';
                        var pageNumber = '';
                        var totalRecords = '';
                        var total_Amount = '';
                        var rows = response.length;
                        var totalAmount = 0;
                        var caption = 'Role wise menu assign';

                        table += '<table id="tbl_list" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>' +
                            '<th class="text-left" width="45%">User</th>' +
                            '<th class="text-left" width="45%">Role</th>' +
                            '<th class="text-center" width="10%">Delete</th>' +
                            '</tr>';

                        if (rows > 0) {
                            for (var r = 0; r < rows; r++) {
                                table += '<tr>';
                                table += '<td class="text-left">' + response[r]["ProfileTitle"] + '</td>';
                                table += '<td class="text-left">' + response[r]["RoleTitle"] + '</td>';
                                table += '<td class="text-center"><button class="btn btn-danger" onclick=user_permission.DeleteUserRoleAssign(' + response[r]["Id"] + ')>Delete</button></td>';
                                table += '</tr>';
                            }
                            table += '</table>';
                            pageNumber += '<ul class="pagination" style="float:left">';

                            if (response[0]["TotalRecords"] > 1) {
                                if (pageNo != 1) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchUserRoleAssign(' + profileId + ',' + roleId + ',' + (pageNo - 1) + ',' + rowsPerPage + ')>' + "Previous" + '</a></li>';
                                }
                                for (var itempage = 1; itempage <= response[0]["TotalPages"]; itempage++) {
                                    if (itempage == pageNo) {
                                        pageNumber += '<li class="page-item active"><a class="page-link" href=javascript:user_permission.SearchUserRoleAssign(' + profileId + ',' + roleId + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    } else {
                                        pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchUserRoleAssign(' + profileId + ',' + roleId + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    }
                                }
                                if (pageNo != response[0]["TotalPages"]) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchUserRoleAssign(' + profileId + ',' + roleId + ',' + (pageNo + 1) + ',' + rowsPerPage + ')>' + "Next" + '</a></li>';
                                }
                            }
                            pageNumber += '</ul>';
                            totalRecords = '<div style="float:right">Total Records: ' + response[0]["TotalRecords"] + '</div>';
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
    },
    SearchUserProfile: function(name, username, mobile, roleId, branchId, isActive, isConfirmed, pageNo, rowsPerPage) {
        if (roleId == '') {
            swal({
                title: "Please select role.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else if (branchId == '') {
            swal({
                title: "Please select branch.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            $.blockUI({ message: main.loaderAnimation });
            $.ajax({
                url: localStorage.getItem("baseURL") + '/UserPermission/SearchUserProfile',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                },
                data: {
                    Name: name,
                    Username: username,
                    Mobile: mobile,
                    RoleId: roleId,
                    BranchId: branchId,
                    IsActive: isActive,
                    IsConfirmed: isConfirmed,
                    Page: pageNo,
                    RowsPerPage: rowsPerPage
                },
                success: function(response) {
                    if (response != null) {
                        console.log(response);
                        var table = '';
                        var pageNumber = '';
                        var totalRecords = '';
                        var total_Amount = '';
                        var rows = response.length;
                        var totalAmount = 0;
                        var caption = 'User Profile';

                        table += '<table id="tbl_list" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';

                        table += '<tr>' +
                            '<th class="text-left" width="20%">Name</th>' +
                            '<th class="text-left" width="20%">Username</th>' +
                            '<th class="text-left" width="10%">Mobile</th>' +
                            '<th class="text-left" width="20%">Address</th>' +
                            '<th class="text-left" width="15%">Is Active</th>' +
                            '<th class="text-left" width="15%">Is Confirmed</th>' +
                            '</tr>';

                        if (rows > 0) {
                            for (var r = 0; r < rows; r++) {
                                table += '<tr>';
                                table += '<td class="text-left">' + response[r]["Name"] + '</td>';
                                table += '<td class="text-left">' + response[r]["Username"] + '</td>';
                                table += '<td class="text-left">' + response[r]["Mobile"] + '</td>';
                                table += '<td class="text-left">' + response[r]["Address"] + '</td>';
                                table += '<td class="text-center"><input type="checkbox" Id= chkIsActive_' + response[r]["Id"] + (response[r]["IsActive"] == "Yes" ? ' checked ' : ' ') + 'onclick=user_permission.ChangeActiveStatus("' + response[r]["Id"] + '",' + (response[r]["IsActive"] == "Yes" ? false : true) + ')></td>';
                                table += '<td class="text-center"><input type="checkbox" Id= chkIsConfirmed_' + response[r]["Id"] + (response[r]["IsConfirmed"] == "Yes" ? ' checked ' : ' ') + 'onclick=user_permission.ChangeConfirmationStatus("' + response[r]["Id"] + '",' + (response[r]["IsConfirmed"] == "Yes" ? false : true) + ')></td>';
                                table += '</tr>';
                            }
                            table += '</table>';
                            pageNumber += '<ul class="pagination" style="float:left">';

                            if (response[0]["TotalRecords"] > 1) {
                                if (pageNo != 1) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchUserProfile(' + name + ',' + username + ',' + mobile + ',' + roleId + ',' + branchId + ',' + isActive + ',' + (pageNo - 1) + ',' + rowsPerPage + ')>' + "Previous" + '</a></li>';
                                }
                                for (var itempage = 1; itempage <= response[0]["TotalPages"]; itempage++) {
                                    if (itempage == pageNo) {
                                        pageNumber += '<li class="page-item active"><a class="page-link" href=javascript:user_permission.SearchUserProfile(' + name + ',' + username + ',' + mobile + ',' + roleId + ',' + branchId + ',' + isActive + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    } else {
                                        pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchUserProfile(' + name + ',' + username + ',' + mobile + ',' + roleId + ',' + branchId + ',' + isActive + ',' + itempage + ',' + rowsPerPage + ')>' + itempage + '</a></li>';
                                    }
                                }
                                if (pageNo != response[0]["TotalPages"]) {
                                    pageNumber += '<li class="page-item"><a class="page-link" href=javascript:user_permission.SearchUserProfile(' + name + ',' + username + ',' + mobile + ',' + roleId + ',' + branchId + ',' + isActive + ',' + (pageNo + 1) + ',' + rowsPerPage + ')>' + "Next" + '</a></li>';
                                }
                            }
                            pageNumber += '</ul>';
                            totalRecords = '<div style="float:right">Total Records: ' + response[0]["TotalRecords"] + '</div>';
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
    },
    DeleteRoleMenuAssign: function(id) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/DeleteRoleMenuAssign',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Id: id
            },
            success: function(response) {
                $(document).ajaxStop($.unblockUI);
                user_permission.SearchRoleMenuAssign($('#ddlRoleSearch option:selected').val(), $('#ddlMenuSearch option:selected').val(), 1, $('#ddlRowsPerPage option:selected').val());
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
    DeleteUserBranchAssign: function(id) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/DeleteUserBranchAssign',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Id: id
            },
            success: function(response) {
                $(document).ajaxStop($.unblockUI);
                user_permission.SearchUserBranchAssign($('#ddlUserProfileSearch option:selected').val(), $('#ddlBranchSearch option:selected').val(), 1, $('#ddlRowsPerPage option:selected').val());
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
    DeleteUserRoleAssign: function(id) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/DeleteUserRoleAssign',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Id: id
            },
            success: function(response) {
                $(document).ajaxStop($.unblockUI);
                user_permission.SearchUserRoleAssign($('#ddlUserProfileSearch option:selected').val(), $('#ddlRoleSearch option:selected').val(), 1, $('#ddlRowsPerPage option:selected').val());
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
    GetUserProfile: function(username) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/GetUserProfile',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Id: username
            },
            success: function(response) {
                $(document).ajaxStop($.unblockUI);

                $('#txtUsername').val(response.Id);
                $('#txtDisplayUsername').val(response.Id);
                $('#txtName').val(response.Name);
                $('#txtMobile').val(response.Mobile);
                $('#txtAddress').val(response.Address);
            },
            error: function(exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);
            }
        });
    },
    LoadddlRole: function() {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/GetAllRoleList',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Title + "</option>";
                    }
                    $('#ddlRole').html(html);
                    $('#ddlRoleSearch').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    LoadddlMenu: function() {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/GetAllMenuList',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Title + "</option>";
                    }
                    $('#ddlMenu').html(html);
                    $('#ddlMenuSearch').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    LoadddlBranch: function() {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/GetAllBranchList',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Title + "</option>";
                    }
                    $('#ddlBranch').html(html);
                    $('#ddlBranchSearch').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    LoadddlUserProfile: function() {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/GetAllProfileList',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].Title + "</option>";
                    }
                    $('#ddlUserProfile').html(html);
                    $('#ddlUserProfileSearch').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    ChangeActiveStatus: function(userName, isActive) {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/ChangeActiveStatus',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                UserName: userName,
                IsActive: isActive
            },
            success: function(response) {
                if (response != null) {
                    swal({
                        title: response.Message,
                        text: "",
                        icon: response.MessageType.toLowerCase(),
                        closeOnClickOutside: false
                    });
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    ChangeConfirmationStatus: function(userName, isConfirmed) {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/ChangeConfirmationStatus',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                UserName: userName,
                IsConfirmed: isConfirmed
            },
            success: function(response) {
                if (response != null) {
                    swal({
                        title: response.Message,
                        text: "",
                        icon: response.MessageType.toLowerCase(),
                        closeOnClickOutside: false
                    });
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
};