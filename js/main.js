$(document).ready(() => {
    console.log(ab);

    $('#connect').click(function() {
        ab.connect(
            'ws://live-api.pride.network:48884',
            (session) => {
                $(this).prop('disabled', true);
                console.log(session);

                let uri = 'messenger/chat_room/b4b8358b-adca-4f0b-a036-64ac5f26eefc';
                let messageList = $('#message-list');

                session.subscribe(uri, function (uri, response) {
                    console.log(response);

                    if (!response.action) {
                        return;
                    }

                    if (response.action === 'chat_message_send' && response.success === true) {
                        messageList.append(
                            '<li data-message="' + response.data.chat_message_uuid + '" class="list-group-item text-right">' +
                            response.data.chat_message_text +
                            '</li>'
                        );
                    }

                    if (response.action === 'chat_message_receive') {
                        messageList.append(
                            '<li data-message="' + response.data.chat_message_uuid + '" class="list-group-item">' +
                            response.data.chat_message_text +
                            '</li>'
                        );

                        session.publish(uri, {
                            action: 'chat_message_read',
                            chat_message_uuid: response.data.chat_message_uuid,
                            token: $('#token').val()
                        })
                    }

                    if (response.action === 'chat_message_read') {
                        let message = $('li[data-message="' + response.data.chat_message_uuid + '"]');
                        message.css("background-color", "green")
                    }
                });

                $('#send').click(function() {
                    session.publish(uri, {
                        action: 'chat_message_send',
                        text: $('#text').val(),
                        token: $('#token').val()
                    })
                });
            },
            (code, reason) => {
                console.log("Disconnected for " + reason + " with code " + code);
            }
        )
    });
});
