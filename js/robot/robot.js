var robot = {
    sendMessage: function(message) {
        $.blockUI({ message: main.loaderAnimation });
        $.ajax({
            url: main.centralServerURL + '/Robot/SendMessage',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {
                Message: message
            },
            success: function(response) {
                $(':input').val('');
                $(document).ajaxStop($.unblockUI);
            },
            error: function(exception) {
                $(document).ajaxStop($.unblockUI);
                main.errorMessage(exception);
            }
        });
    },

    getRemainingMessage: function() {
        console.log("Getting remaining message...");
        $.ajax({
            url: main.centralServerURL + '/Robot/GetRemainingMessage',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                var html = "";
                for (i = 0; i < response.length; i++) {
                    html = html + response[i] + '<br />';
                }
                document.getElementById("lblRemainingMessage").innerHTML = html;
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    },
    speak: function(message) {
        const utterance = new SpeechSynthesisUtterance(message)
        window.speechSynthesis.speak(utterance);
    },
    getMessage: function() {
        console.log("Getting message...");
        $.ajax({
            url: main.centralServerURL + '/Robot/GetMessage',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
            },
            data: {},
            success: function(response) {
                if (response.Message != "") {
                    console.log("Message: " + response.Message)
                }
                robot.speak(response.Message);
            },
            error: function(exception) {
                main.errorMessage(exception);
            }
        });
    }
};