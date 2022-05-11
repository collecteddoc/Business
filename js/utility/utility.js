$(document).ready(function() {
    window.onload = utility.changeImage();
});

var utility = {
    // getDirectoryFileName: function(directory) {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             var fileNames = new Array();
    //             $.ajax({
    //                 url: directory,
    //                 success: function(data) {
    //                     console.log(data);
    //                     for (var i = 1; i < $(data).find('li span.name').length; i++) {
    //                         var elem = $(data).find('li span.name')[i];
    //                         fileNames.push(elem.innerHTML);
    //                     }
    //                     return resolve(fileNames);
    //                 }
    //             });
    //         } catch (ex) {
    //             return reject(new Error(ex));
    //         }
    //     });
    // },

    i: 0,
    images: [],
    time: 15000,
    changeImage: function() {
        var directory = '/content/';
        var pic = '';
        // utility.getDirectoryFileName(directory)
        //     .then((data) => {
        //         for (i = 0; i < data.length; i++) {
        //             pic = 'url(' + directory + data[i] + ')';
        //             this.images[i] = pic;
        //             console.log('directory: ' + directory + ' & pic: ' + data[i]);
        //         }
        //     })
        //     .catch((error) => {
        //         console.log('Directory files could not be loaded. please check console for details');
        //         console.error(error);
        //     });

        this.images[0] = 'url(' + directory + 'pic1.jpg' + ')';
        this.images[1] = 'url(' + directory + 'pic2.jpg' + ')';
        this.images[2] = 'url(' + directory + 'pic3.jpg' + ')';

        var el = document.getElementById('bg');
        if (el != null) {
            el.style.backgroundImage = this.images[this.i];
            if (this.i < this.images.length - 1) {
                this.i++;
            } else {
                this.i = 0;
            }
            console.log("Pic changed to " + this.images[this.i]);
        }
        setTimeout('utility.changeImage()', this.time);
    },

    exportTableToExcel: function(tableId, filename = '') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableId);
        if (tableSelect != null) {
            var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

            // Specify file name
            filename = filename ? filename + '.xls' : 'excel_data.xls';

            // Create download link element
            downloadLink = document.createElement("a");

            document.body.appendChild(downloadLink);

            if (navigator.msSaveOrOpenBlob) {
                var blob = new Blob(['\ufeff', tableHTML], {
                    type: dataType
                });
                navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                // Create a link to the file
                downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

                // Setting the file name
                downloadLink.download = filename;

                //triggering the function
                downloadLink.click();
            }
        } else {
            swal({
                title: "Nothing to export.",
                text: "",
                icon: 'info',
                closeOnClickOutside: false
            });
        }
    },

    convertDateFormat: function(date) {
        return new Date(date).getDate() + "/" + (parseInt(new Date(date).getMonth()) + 1) + "/" + new Date(date).getFullYear();
    },

    getUrlQueryString: function(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    //loaderAnimation: "<img src=" + baseUrl + "Content/loader.gif /> <br/> Wait a moment...",

    matchCustom: function(params, data) {
        // If there are no search terms, return all of the data
        if ($.trim(params.term) === '') {
            return data;
        }

        // Do not display the item if there is no 'text' property
        if (typeof data.text === 'undefined') {
            return null;
        }

        // `params.term` should be the term that is used for searching
        // `data.text` is the text that is displayed for the data object
        if (data.text.toLowerCase().indexOf(params.term.toLowerCase()) > -1) {
            var modifiedData = $.extend({}, data, true);
            modifiedData.text;

            // You can return modified objects from here
            // This includes matching the `children` how you want in nested data sets
            return modifiedData;
        }
        // Return `null` if the term should not be displayed
        return null;
    },
    isServerUp: function(url, callback) {
        // try to load favicon
        var timer = setTimeout(function() {
            // timeout after 2 seconds
            callback(false);
        }, 2000)

        var img = document.createElement("img");
        img.onload = function() {
            clearTimeout(timer);
            callback(true);
        }
        img.onerror = function() {
            swal({
                title: main.serverDownMessage,
                text: "",
                icon: "error",
                closeOnClickOutside: false
            });
            main.baseURL = main.getServerURL();
            clearTimeout(timer);
            callback(false);
        }

        img.src = url + "/favicon.ico";
    },
    printDiv: function(divId) {
        var divToPrint = document.getElementById(divId);
        newWin = window.open("");
        newWin.document.write(divToPrint.innerHTML);
        newWin.print();
        newWin.close();
    }
}