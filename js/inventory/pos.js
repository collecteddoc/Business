var pos = {
    getItem: function(itemData) {
        var item = $('<div class="gallery col-md-2">');
        var subList = $("<a>");
        subList.append('<img src="/content/' + itemData.Id + '.jpg" alt="' + itemData.Title + '">');
        item.append(subList);
        var divList = $("<div>");
        divList.append(
            $("<label>", {
                html: itemData.Title,
                class: 'text-center description',
                innerWidth: '100%'
            }));
        divList.append(
            $("<label>", {
                html: "Price: 200 tk",
                class: 'text-center description',
                innerWidth: '100%'
            }));
        divList.append(
            $("<button>", {
                onclick: "pos.Add(" + itemData.Id + ",'" + itemData.Title + "','" + 'ltr' + "'," + 200 + ")",
                html: "Add",
                class: 'btn btn-sm btn-success button',
                innerWidth: '100%'
            }));
        item.append(divList);
        return item;
    },
    loadItem: function(elementId) {
        var list = main.getModuleList();
        if (list != null) {
            var $module = $(elementId);
            $module.empty();
            $.each(list, function() {
                $module.append(
                    pos.getItem(this)
                );
            });
        }
    },
    PrepareTable: function() {
        var table = '';
        var caption = 'Invoice';
        table += '<table id="tbl_order" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';
        table += '<tr>' +
            '<th class="text-left" width="60%">Item</th>' +
            '<th class="text-right" width="20%">Item_Rate</th>' +
            '<th class="text-right" width="10%">Quantity</th>' +
            '<th class="text-right" width="10%">Total_Price</th>' +
            '<th class="text-center" width="10%">Remove</th>' +
            '<th class="text-left" style="display:none;" width="100%">ItemId</th>' +
            '</tr>';
        table += '</table>';
        $("#div_order").empty().append(table);
    },
    PreparePrintTable: function(id) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Inventory/GetTransactionById',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Id: id
            },
            success: function(response) {
                if (response != null) {
                    console.log(response);
                    var table = '';
                    var caption = 'Invoice Details';
                    var total = 0;
                    table += '<table id="tbl_order_print" border="1" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';
                    table += '<tr>' +
                        '<th style="text-align: left;" width="70%">Item</th>' +
                        '<th style="text-align: right;" width="10%">Rate</th>' +
                        '<th style="text-align: right;" width="10%">Quantity</th>' +
                        '<th style="text-align: right;" width="10%">Total</th>' +
                        '</tr>';
                    table += '</table>';
                    $("#div_order_print").empty().append(table);

                    var table_print = document.getElementById("tbl_order_print");

                    for (i = 0; i < response.length; i++) {
                        var row = table_print.insertRow(1);
                        var cell0 = row.insertCell(0);
                        cell0.style.textAlign = "left";
                        var cell1 = row.insertCell(1);
                        cell1.style.textAlign = "right";
                        var cell2 = row.insertCell(2);
                        cell2.style.textAlign = "right";
                        var cell3 = row.insertCell(3);
                        cell3.style.textAlign = "right";

                        cell0.innerHTML = response[i]["Item"];
                        cell1.innerHTML = response[i]["Rate"];
                        cell2.innerHTML = response[i]["Quantity"];
                        cell3.innerHTML = response[i]["ItemTotal"];

                        var header = '<div style="text-align: center;"><b>' + response[i]["CompanyName"] + '</b></div><br>';
                        var invoiceNo = '<div style="text-align: left;">' + 'Invoice No: ' + response[i]["InvoiceNo"] + '</div><br>';
                        var invoiceDate = '<div style="text-align: left;">' + 'Invoice Date: ' + response[i]["InvoiceDate"] + '</div><br>';
                        var subtotal = '<br><div style="text-align: right;">' + 'Sub Total: ' + response[i]["SubTotal"] + '</div><br>';
                        var discount = '<div style="text-align: right;">' + 'Discount: ' + response[i]["TransactionDiscountAmount"] + ' tk' + '</div><br>';
                        var nettotal = '<div style="text-align: right;"><b>' + 'Net Total: ' + response[i]["NetTotal"] + '</b></div><br>';
                        var note = '<div style="text-align: center;">' + 'System generated document. Do not need any signature.' + '</div><br>';
                        var unpaid = '<div style="text-align: center; color:red;""><h1>' + '(UNPAID)' + '</h1></div><br>';
                        var paid = '<div style="text-align: center; color:green;"><h1>' + '(PAID)' + '</h1></div><br>';
                        var barcode = '<svg id="barcode"></svg>';
                    }

                    $("#div_order_print").empty().append(header);
                    $("#div_order_print").append(invoiceNo);
                    $("#div_order_print").append(invoiceDate);
                    $("#div_order_print").append(table_print);
                    $("#div_order_print").append(subtotal);
                    $("#div_order_print").append(discount);
                    $("#div_order_print").append(nettotal);
                    $("#div_order_print").append(note);
                    $("#div_order_print").append(paid);
                }
                $(document).ajaxStop($.unblockUI);
            },
            error: function(exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);
            }
        });
    },
    Add: function(itemId, inventoryTransactionTypeId) {
        $.blockUI({ message: main.loaderAnimation });
        var itemName = '';
        var itemUnit = '';
        var itemPrice = 0;
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Inventory/GetItemById',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Id: itemId
            },
            success: function(response) {
                $(document).ajaxStop($.unblockUI);
                if (response != null) {
                    itemName = response.EnglishName;
                    itemUnit = response.UnitEnglishName;
                    if (inventoryTransactionTypeId == 2) {
                        itemPrice = response.SellingPricePerUnit;
                    }
                    if ($("#btnSave").is(":disabled")) {
                        swal({
                            title: "Unable to add item in paid invoice",
                            text: "",
                            icon: 'warning',
                            closeOnClickOutside: false
                        });
                    } else {
                        var table = document.getElementById("tbl_order");
                        var count = 0;
                        for (i = 1; i < table.rows.length; i++) {
                            if (table.rows[i].cells[5].innerHTML == itemId) {
                                count = count + 1;
                            }
                        }
                        if (count > 0) {
                            swal({
                                title: "Same item already exists.",
                                text: "",
                                icon: 'warning',
                                closeOnClickOutside: false
                            });
                        } else {
                            var row = table.insertRow(1);
                            var cell0 = row.insertCell(0);
                            cell0.style.textAlign = "left";
                            var cell1 = row.insertCell(1);
                            cell1.style.textAlign = "right";
                            var cell2 = row.insertCell(2);
                            cell2.style.textAlign = "right";
                            var cell3 = row.insertCell(3);
                            cell3.style.textAlign = "right";
                            var cell4 = row.insertCell(4);
                            cell4.style.textAlign = "right";
                            var cell5 = row.insertCell(5);
                            cell5.style.textAlign = "right";
                            cell5.style.display = 'none';

                            cell0.innerHTML = itemName;
                            cell1.innerHTML = '<input type="number" class="text-right" value=' + itemPrice + ' style="width:80%;" onchange="pos.CalculateTotal()" onkeypress="pos.CalculateTotal()" onkeyup="pos.CalculateTotal()" onkeydown="pos.CalculateTotal()"><label style="width:20%">' + 'tk' + '</label>';
                            cell2.innerHTML = '<input type="number" class="text-right" value="1" style="width:80%" onchange="pos.CalculateTotal()" onkeypress="pos.CalculateTotal()" onkeyup="pos.CalculateTotal()" onkeydown="pos.CalculateTotal()"><label style="width:20%">&nbsp;' + itemUnit + '</label>';
                            cell3.innerHTML = '<label value="1" style="width:100%">';
                            cell4.innerHTML = '<td class="text-right"><button class="btn btn-danger deleterow"' + '>Remove</button></td>';
                            cell5.innerHTML = itemId;
                            pos.CalculateTotal();
                        }
                    }
                }
            },
            error: function(exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);
            }
        });
    },
    CalculateTotal: function() {
        var table = document.getElementById("tbl_order");
        var total = 0;
        var discount = document.getElementById("txtDiscount").value;
        var div_total = document.getElementById("div_total");
        for (i = 1; i < table.rows.length; i++) {
            table.rows[i].cells[3].innerHTML = (table.rows[i].cells[1].childNodes[0].value) * (table.rows[i].cells[2].childNodes[0].value) + " tk";
            table.rows[i].cells[3].childNodes[0].value = (table.rows[i].cells[1].childNodes[0].value) * (table.rows[i].cells[2].childNodes[0].value);
            total += table.rows[i].cells[3].childNodes[0].value;
        }
        if (discount > total) {
            discount = 0;
            document.getElementById("txtDiscount").value = discount;
            swal({
                title: "Discount should not be more than total amount.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        }
        div_total.innerHTML = "<b>" + (total - discount) + " tk" + "</b>";
    },
    LoadddlItem: function() {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/Inventory/GetItem',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response != null) {
                    var html = "<option value=0>Please select</option>";
                    for (var i = 0; i < response.length; i++) {
                        html += "<option value=" + response[i].Id + ">" + response[i].EnglishName + "</option>";
                    }
                    $('#ddlItem').html(html);
                }
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    Save: function(inventoryTransactionTypeId, processTypeId, branchId, partyId) {
        if (branchId == 0) {
            swal({
                title: "Please select any branch.",
                text: "",
                icon: 'warning',
                closeOnClickOutside: false
            });
        } else {
            var table_order = document.getElementById("tbl_order");
            if (table_order.rows.length > 1) {
                var inventoryTransaction = {
                    Id: 0,
                    TransactionTypeId: inventoryTransactionTypeId,
                    ProcessTypeId: processTypeId,
                    TransactionDiscountAmount: 0,
                    BranchId: branchId,
                    PartyId: partyId,
                    InventoryTransactionDetailsList: []
                };

                for (i = 1; i < table_order.rows.length; i++) {
                    var inventoryTransactionDetails = {
                        Id: 0,
                        TransactionId: 0,
                        ItemId: table_order.rows[i].cells[5].innerHTML,
                        Rate: table_order.rows[i].cells[1].childNodes[0].value,
                        Quantity: table_order.rows[i].cells[2].childNodes[0].value,
                        TransactionAmount: table_order.rows[i].cells[3].childNodes[0].value,
                        VATPercentage: 0,
                        VATAmount: 0,
                        DiscountPercentage: 0,
                        DiscountAmount: 0
                    }
                    inventoryTransaction.InventoryTransactionDetailsList.push(inventoryTransactionDetails);
                }
                inventoryTransaction.TransactionDiscountAmount = document.getElementById("txtDiscount").value;
                console.log(JSON.stringify(inventoryTransaction));
                $.blockUI({ message: main.loaderAnimation });
                $.ajax({
                    url: localStorage.getItem("baseURL") + '/Inventory/SaveTransaction',
                    type: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
                    },
                    data: inventoryTransaction,
                    success: function(response) {
                        $(document).ajaxStop($.unblockUI);
                        if (response != null) {
                            console.log(response);
                            $('#div_total').val('');
                            $("#btnSave").hide();
                            $("#btnPrint").show();
                            $("#btnSave").prop("disabled", true);
                            $(".deleterow").hide();
                            $(".deleterow").prop("disabled", true);
                            $("#div_order").hide();
                            $("#div_order_print").show();
                            $('#txtDiscount').attr('readonly', 'true');
                            pos.PreparePrintTable(response.Id);

                            // swal({
                            //     title: response.Message,
                            //     text: "",
                            //     icon: response.MessageType.toLowerCase(),
                            //     closeOnClickOutside: false
                            // });
                        }
                    },
                    error: function(exception) {
                        $(document).ajaxStop($.unblockUI);
                        main.errorMessage(exception);
                    }
                });
            } else {
                swal({
                    title: "Please add any item.",
                    text: "",
                    icon: 'warning',
                    closeOnClickOutside: false
                });
            }
        }
    },
    LoadddlParty: function() {
        var html = "<option value=0>Please select</option>";
        //var list = main.getBranchList();
        //if (list != null) {
        //for (var i = 0; i < list.length; i++) {
        //html += "<option value=" + list[i].Id + ">" + list[i].Title + "</option>";
        //}
        //}
        $('#ddlParty').html(html);
        $('#ddlPartySearch').html(html);
    },
    PreparePrintTableFromAnotherTable: function() {
        var table = '';
        var caption = 'Invoice Details';
        var total = 0;
        table += '<table id="tbl_order_print" class="table table-bordered table-hover"><caption><b>' + caption + '</b></caption>';
        table += '<tr>' +
            '<th style="text-align: left;" width="70%">Item</th>' +
            '<th style="text-align: right;" width="10%">Rate</th>' +
            '<th style="text-align: right;" width="10%">Quantity</th>' +
            '<th style="text-align: right;" width="10%">Total</th>' +
            '</tr>';
        table += '</table>';
        $("#div_order_print").empty().append(table);

        var table_order = document.getElementById("tbl_order");
        var table_print = document.getElementById("tbl_order_print");

        for (i = 1; i < table_order.rows.length; i++) {
            var row = table_print.insertRow(1);
            var cell0 = row.insertCell(0);
            cell0.style.textAlign = "left";
            var cell1 = row.insertCell(1);
            cell1.style.textAlign = "right";
            var cell2 = row.insertCell(2);
            cell2.style.textAlign = "right";
            var cell3 = row.insertCell(3);
            cell3.style.textAlign = "right";

            cell0.innerHTML = table_order.rows[i].cells[0].innerHTML;
            cell1.innerHTML = table_order.rows[i].cells[1].childNodes[0].value + " " + table_order.rows[i].cells[1].childNodes[1].innerHTML;
            cell2.innerHTML = table_order.rows[i].cells[2].childNodes[0].value + " " + table_order.rows[i].cells[2].childNodes[1].innerHTML;
            cell3.innerHTML = table_order.rows[i].cells[3].innerHTML;
            total += (table_order.rows[i].cells[1].childNodes[0].value) * (table_order.rows[i].cells[2].childNodes[0].value);
        }
        var header = '<div style="text-align: center;"><b>' + 'Company' + '</b></div><br>';
        var invoiceNo = '<div style="text-align: left;">' + 'Invoice No: ' + 'Inv-1234' + '</div><br>';
        var invoiceDate = '<div style="text-align: left;">' + 'Invoice Date: ' + 'January 02, 2021' + '</div><br>';
        var subtotal = '<br><div style="text-align: right;">' + 'Sub Total: ' + total + ' tk' + '</div><br>';
        var discount = '<div style="text-align: right;">' + 'Discount: ' + document.getElementById("txtDiscount").value + ' tk' + '</div><br>';
        var nettotal = '<div style="text-align: right;"><b>' + 'Net Total: ' + document.getElementById("div_total").innerHTML + '</b></div><br>';
        var note = '<div style="text-align: center;">' + 'System generated document. Do not need any signature.' + '</div><br>';
        var unpaid = '<div style="text-align: center; color:red;""><h1>' + '(UNPAID)' + '</h1></div><br>';
        var paid = '<div style="text-align: center; color:green;"><h1>' + '(PAID)' + '</h1></div><br>';
        var barcode = '<svg id="barcode"></svg>';

        $("#div_order_print").empty().append(header);
        $("#div_order_print").append(invoiceNo);
        $("#div_order_print").append(invoiceDate);
        $("#div_order_print").append(table_print);
        $("#div_order_print").append(subtotal);
        $("#div_order_print").append(discount);
        $("#div_order_print").append(nettotal);
        $("#div_order_print").append(note);

        if ($("#btnSave").is(":disabled")) {
            $("#div_order_print").append(paid);
        } else {
            $("#div_order_print").append(unpaid);
        }
    }
};