var main = {

    centralServerURL: 'http://localhost:52180',

    serverDownMessage: 'API server is down.',

    loaderAnimation: '<img src="/content/loader.gif" /> <br/> Just a moment',

    includeScriptFiles: function() {
        main.include('/js/common//bootstrap.min.js');
        main.include('/js/common/sweetalert.min.js');
        main.include('/js/common/jquery.blockUI.js');
        main.include('/js/common/jquery.alphanum.js');
        main.include('/js/common/jquery.dataTables.min.js');
        main.include('/js/common/print.min.js');
        main.include('/js/common/jquery-ui.js');
        main.include('/js/common/select2.min.js');
        main.include('/js/common/JsBarcode.all.min.js'); // https://lindell.me/JsBarcode/

        main.include('/js/utility/utility.js');
        main.include('/js/user/change_password.js');
        main.include('/js/user/sign_in.js');
        main.include('/js/user/sign_up.js');

        main.include('/js/robot/robot.js');

        main.include('/js/accounting/balance_sheet.js');
        main.include('/js/accounting/chart_of_accounts.js');
        main.include('/js/accounting/ledger.js');
        main.include('/js/accounting/process_journal.js');
        main.include('/js/accounting/income_statement.js');
        main.include('/js/accounting/profit_statement.js');
        main.include('/js/accounting/cash_flow_statement.js');
        main.include('/js/accounting/stakeholders_equity_statement.js');
        main.include('/js/accounting/cash_book.js');
        main.include('/js/accounting/journal_mapping.js');
        main.include('/js/accounting/transaction.js');
        main.include('/js/accounting/voucher.js');
        main.include('/js/accounting/account.js');

        main.include('/js/prizebond/prizebond.js');

        main.include('/js/user_permission/user_permission.js');

        main.include('/js/inventory/pos.js');
        main.include('/js/server/server.js');
    },

    load: function() {
        if (localStorage.getItem("access_token") != null) {
            $("#div_menu").load('/html/layout/menu_tree.html');
            $("#div_menu").show();
            $("#div_content").load('/html/layout/dashboard.html');
            $('#div_content_fullscreen').hide();
            $("#btnPOS").show();
            $("#btnSignout").show();
            $("#btnChangePassword").show();
            $("#btnSignin").hide();
            $("#btnSignup").hide();
            $("#btnHome").hide();
            $("#btnLarosasoft").hide();
            $("#btnDashboard").show();
            $("#btnContactUs").hide();
            $("#btnUserProfile").show();
            $('#btnRobot').show();
            main.getUserwisePermissionList(0);
            main.clickMenu(1);
            main.clickMenu(2);
            main.clickMenu(3);
            main.clickMenu(4);
            main.clickMenu(5);
        } else {
            $("#div_menu").load('/html/content/clock_analog.html');
            // $("#div_clock").load('/html/content/clock_digital.html');
            $("#div_menu").show();
            $("#div_content").load('/html/layout/home.html');
            $('#div_content_fullscreen').hide();
            $("#btnPOS").hide();
            $("#btnSignout").hide();
            $("#btnChangePassword").hide();
            $("#btnSignin").show();
            $("#btnSignup").show();
            $("#btnLarosasoft").show();
            $("#btnHome").hide();
            $("#btnDashboard").hide();
            $("#btnContactUs").hide();
            $("#btnUserProfile").hide();
            $('#btnRobot').show();
        }
    },

    loadpage: function(url) {
        if (url == '/html/robot/robot.html' || url == '/html/pos/pos.html') {
            $('#div_content').hide();
            $('#div_content_fullscreen').show();
            $("#div_content_fullscreen").load(url);
            if (url == '/html/pos/pos.html') {
                $('#div_menu').hide();
                $('#btnRobot').hide();
            } else {
                $('#btnRobot').show();
            }
        } else {
            $('#div_content').show();
            $("#div_content").load(url);
            $('#div_content_fullscreen').hide();
            $('#btnRobot').show();
        }
        utility.isServerUp(localStorage.getItem("baseURL"), function(online) {
            if (!online) {
                if (url != '/index.html') {} else if (url != '/html/user/sign_up.html') {} else if (url != '/html/user/sign_in.html') {} else if (url != '/html/layout/newspaper.html') {} else if (url != '/html/robot/robot.html') {} else {
                    sign_in.signout();
                }
            }
        })
    },

    include: function(file) {
        var script = document.createElement('script');
        script.src = file;
        script.type = 'text/javascript';
        script.defer = true;
        document.head.appendChild(script);
        //main.print(file);
    },

    clickMenu: function(moduleId) {
        if (localStorage.getItem("access_token") != null) {
            $('#div_menu').show();
            main.loadMenu("#menu", moduleId);
        } else {
            $('#div_menu').hide();
            main.loadpage('/html/user/sign_in.html')
        }
    },

    errorMessage: function(exception) {
        if (localStorage.getItem("access_token") != null) {
            if (exception != null && exception.responseJSON != null) {
                console.error(exception.responseJSON);
                swal({
                    title: "Unable to perform due to technical difficulties. Reason: " + JSON.stringify(exception.responseJSON),
                    text: "",
                    icon: "error",
                    closeOnClickOutside: false
                });
            } else {
                sign_in.signout();
            }
        } else {
            sign_in.signout();
        }
    },

    print: function(fileName) {
        var msg = 'Loaded: ';
        console.log(msg + fileName);
    },

    getServerURL: function() {
        $.ajax({
            url: main.centralServerURL + '/AppServer/Get',
            type: 'POST',
            data: {},
            beforeSend: function() {
                $("#div_top").hide();
                $("#div_loader").show();
            },
            success: function(response) {
                if (response != null) {
                    localStorage.setItem('baseURL', response.URL);
                    localStorage.setItem('developedBy', response.DevelopedBy);
                    localStorage.setItem('developedYear', response.DevelopedYear);
                    var html_developedBy = localStorage.getItem("developedBy");
                    $('#lbl_developedBy').html(html_developedBy);
                    var html_developedYear = localStorage.getItem("developedYear");
                    $('#lbl_developedYear').html(html_developedYear);
                    main.load();
                }
            },
            error: function() {
                $("#btnLarosasoft").hide();
                $("#btnRobot").hide();
                $("#btnSignin").hide();
                $("#btnSignup").hide();
                $("#btnHome").hide();
                $("#btnDashboard").hide();
                $("#btnContactUs").hide();
                $("#div_content").load('/html/layout/Disconnected.html');
                $("#div_menu").load('/html/content/clock_analog.html');
                // $("#div_clock").load('/html/content/clock_digital.html');
                $("#div_menu").hide();
                $("#btnUserProfile").hide();
                $("#btnSignout").hide();
                $("#btnChangePassword").hide();
                $('#btnRobot').hide();
                $('#btnNewspaper').hide();
            },
            complete: function(data) {
                $("#div_loader").hide();
                $("#div_top").show();
            }
        });
    },

    getCurrency: function() {
        $.ajax({
            url: 'https://api.exchangerate-api.com/v4/latest/BDT',
            type: 'GET',
            data: {},
            success: function(response) {
                if (response != null) {
                    localStorage.setItem('BDT', response.rates.BDT);
                    localStorage.setItem('USD', response.rates.USD);
                    localStorage.setItem('KWD', response.rates.KWD);
                    localStorage.setItem('EUR', response.rates.EUR);
                    localStorage.setItem('AED', response.rates.AED);
                    transaction.LoadddlCurrency();
                }
            },
            error: function() {
                swal({
                    title: "Unable to connect with exchange server.",
                    text: "",
                    icon: "error",
                    closeOnClickOutside: false
                });
            }
        });
    },

    getMenuItem: function(itemData) {
        var item = $("<li>")
            .append(
                $("<label>", {
                    onclick: (itemData.Submenu != null ? '' : "main.loadpage('" + itemData.URL + "')"),
                    html: itemData.Title,
                    class: 'link'
                }));
        if (itemData.Submenu) {
            var subList = $("<ul>");
            $.each(itemData.Submenu, function() {
                subList.append(main.getMenuItem(this));
            });
            item.append(subList);
        }
        return item;
    },

    loadMenu: function(elementId, moduleId) {
        var menuList = main.getMenuList(moduleId);
        if (menuList != null) {
            //console.log(menuList); 
            var $menu = $(elementId);
            $menu.empty();
            $.each(menuList, function() {
                $menu.append(
                    main.getMenuItem(this)
                );
            });
            //$menu.menu();
        }
    },

    getMenuList: function(moduleId) {
        var menuList = null;
        if (localStorage.getItem("menuList_" + moduleId) != null) {
            menuList = JSON.parse(localStorage.getItem("menuList_" + moduleId));
        } else {
            main.getUserwisePermissionList(moduleId);
            menuList = JSON.parse(localStorage.getItem("menuList_" + moduleId));
        }
        return menuList;
    },

    getModuleItem: function(itemData) {
        var item = $('<div class="gallery col-md-3" onclick="main.clickMenu(' + itemData.Id + ')">');
        var subList = $("<a>");
        subList.append('<img src="/content/' + itemData.Id + '.jpg" alt="' + itemData.Title + '">');
        item.append(subList);
        item.append(
            $("<div>", {
                //onclick: "main.clickMenu('" + itemData.Id + "')",
                html: itemData.Title,
                class: 'description'
            }));
        return item;
    },

    loadNewspaper: function() {
        var folder = "content/newspaper/";
        $.ajax({
            url: folder,
            success: function(data) {
                $(data).find("a").attr("href", function(i, val) {
                    if (val.match(/\.(jpe?g|png|gif)$/)) {
                        const array = val.split(".jpg");
                        const url = array[0].split(folder);
                        var html = "<div class='gallery'>" +
                            "<a target = '_blank' href = 'http://" + url[1] + "'>" +
                            "<img src = '" + val + "'> </img>" +
                            "</a>" +
                            "</div>";
                        $("#div_newspaper").append(html);
                    }
                });
            }
        });
    },
    loadModule: function(elementId) {
        var moduleList = main.getModuleList();
        if (moduleList != null) {
            //console.log(moduleList); 
            var $module = $(elementId);
            $module.empty();
            $.each(moduleList, function() {
                $module.append(
                    main.getModuleItem(this)
                );
            });
        }
    },
    getModuleList: function() {
        var moduleList = null;
        if (localStorage.getItem("moduleList") != null) {
            moduleList = JSON.parse(localStorage.getItem("moduleList"));
        } else {
            main.getUserwisePermissionList(0);
            moduleList = JSON.parse(localStorage.getItem("moduleList"));
        }
        return moduleList;
    },

    getBranchList: function() {
        var branchList = null;
        if (localStorage.getItem("branchList") != null) {
            branchList = JSON.parse(localStorage.getItem("branchList"));
        } else {
            main.getUserwisePermissionList(0);
            branchList = JSON.parse(localStorage.getItem("branchList"));
        }
        return branchList;
    },

    getUserwisePermissionList: function(moduleId) {
        $.ajax({
            url: localStorage.getItem("baseURL") + '/UserPermission/GetUserwisePermissionList',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                ModuleId: moduleId
            },
            success: function(response) {
                if (response.IsSuccess = true) {
                    localStorage.setItem('name', response.Profile.Title);
                    if (moduleId > 0) {
                        localStorage.setItem("menuList_" + moduleId, JSON.stringify(response.MenuList));
                    }
                    localStorage.setItem("moduleList", JSON.stringify(response.ModuleList));
                    localStorage.setItem("branchList", JSON.stringify(response.BranchList));
                }
                main.loadModule("#div_module");
                main.clickMenu(2);
                var html = localStorage.getItem("name");
                $('#btnUserProfile').html(html);
            },
            error: function(exception) {
                sign_in.signout();
            }
        });
    }
};