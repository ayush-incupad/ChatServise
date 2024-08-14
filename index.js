document.addEventListener("DOMContentLoaded", function () {
    function updateButtonPosition() {
        const screenWidth = window.innerWidth;

        if (screenWidth <= 768) {
            openDialogButton.style.bottom = '15px';
            openDialogButton.style.right = '30px';
            openDialogButtonImage.style.width = '25px';
            openDialogButtonImage.style.height = '25px';
        } else if (screenWidth <= 1024) {
            openDialogButton.style.bottom = '20px';
            openDialogButton.style.right = '50px';
            openDialogButtonImage.style.width = '30px';
            openDialogButtonImage.style.height = '30px';
        } else {
            openDialogButton.style.bottom = '20px';
            openDialogButton.style.right = '76px';
            openDialogButtonImage.style.width = '35px';
            openDialogButtonImage.style.height = '35px';
        }
    }
    const currentUrl = window.location.href;

    let serviceId;
    if (!getUrlParameter(currentUrl, 'service_id')) {
        serviceId = "orgcs_dd12d8";
    } else {
        serviceId = getUrlParameter(currentUrl, 'service_id');
    }
    let ChatBotServise;
    let chatBot = [
        {
            image: 'https://dev-portal.enterprise.tau.simplyfy.ai/media/organisation/1/profile/chat-bot-logo-design-concept-600nw-1938811039.webp',
            title: 'TAU Enterprise',
            introMsg: "Absolutely, let's dive in 🙏! 🌟 Feel free to ask anything on your mind, and we'll navigate through together! 🚀.",
            followupQuestions: []
        }
    ];
    const apiUrl = 'https://dev-portal.enterprise.tau.simplyfy.ai/api/v1/master/organisation/chat-service/chat/?is_testing=True';
    const firstRequestBody = {
        "service_id": `${serviceId}`,
        "data": [
            {
                "role": "user",
                "content": `${ChatBotServise}`
            }
        ]
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(firstRequestBody)
    })
        .then(response => response.json())
        .then(data => {
            if (typeof data.data.content === 'string') {
                chatBot[0].introMsg = data.data.content;
            } else if (Array.isArray(data.data.content) || typeof data.data.content === 'object') {
                chatBot[0].introMsg = data.data.content.answer;
            }
            chatBot[0].followupQuestions = data.example_prompts
        })
    console.log(chatBot[0],"AYush")

    fetch(`https://dev-portal.enterprise.tau.simplyfy.ai/api/v1/master/services/${serviceId}/detail/?is_testing=True`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update the chatBot array with the new image and title from the fetched data
            if (data && data.data) {
                chatBot[0].image = data.data.image;
                chatBot[0].title = data.data.title;
            }
            ChatBotServise = data.data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });



    const openDialogButton = document.createElement('button');
    openDialogButton.id = 'openDialogButton';
    openDialogButton.style.cssText = 'position: fixed;color: white; border: none; border-radius: 50%; padding: 10px 14px; cursor: pointer;';

    const openDialogButtonImage = document.createElement('img');
    openDialogButtonImage.src = chatBot[0].image;
    openDialogButtonImage.alt = 'Chat Icon';
    openDialogButtonImage.style.cssText = 'width: 35px; height: 35px;';

    openDialogButton.appendChild(openDialogButtonImage);

    document.body.appendChild(openDialogButton);

    openDialogButton.addEventListener('click', openDialog);
    updateButtonPosition();

    window.addEventListener('resize', updateButtonPosition);

    function getUrlParameter(url, name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(url);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    function openDialog() {
        openDialogButton.removeEventListener('click', openDialog);

        const dialog = document.createElement('div');
        dialog.id = 'dialog';
        dialog.style.cssText = "position: fixed; bottom: 20px; right: 20px; background-color: #FFFFFF; border: 1px solid #DFDFE1FF; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); display: none;  font-family:  ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica Neue, Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

        function adjustDialogSize() {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            if (screenWidth < 600) {
                dialog.style.width = '90%';
            } else if (screenWidth < 992) {
                dialog.style.width = '90%';
            } else {
                dialog.style.width = '400px';
            }
            if (screenHeight < 650) {
                dialog.style.height = '80%';
            } else {
                dialog.style.height = '590px';
            }
        }
        adjustDialogSize();

        window.addEventListener('resize', adjustDialogSize);

        const content = document.createElement('div');
        content.className = 'content';
        content.style.cssText = "display: flex; flex-direction: column;";

        const topRow = document.createElement('div');
        topRow.className = 'top-row';
        topRow.style.cssText = ' padding: 15px 15px 0px 15px; display: flex;  background: linear-gradient(to right, #93eefa, #5b5bc2); border-top-left-radius: 8px; border-top-right-radius: 8px; position: relative;';

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.style.marginRight = '15px';
        avatar.innerHTML = `<img src="${chatBot[0].image}" alt="${chatBot[0].title}" style="width: 32px; height: 32px;">`;

        const company = document.createElement('div');
        company.className = 'company';
        company.style.cssText = 'display: flex; flex-direction: column;padding-bottom: 8%;';

        const header = document.createElement('div');
        header.className = 'header';
        header.style.cssText = 'font-size: 24px; font-weight: 700; color: #000;';
        header.textContent = chatBot[0].title;

        const toggleButton = document.createElement('div');
        toggleButton.id = 'toggleButton';
        toggleButton.style.cssText = 'font-size: 10px; font-weight: 600; color: #000; margin-left: auto; cursor: pointer;top:0;height:0px;margin-left: 24%';

        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-star"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>`;
        const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;

        toggleButton.innerHTML = moonIcon;

        toggleButton.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                toggleButton.innerHTML = sunIcon;
            } else {
                toggleButton.innerHTML = moonIcon;
            }
        });

        const closeButton = document.createElement('div');
        closeButton.className = 'close';
        closeButton.style.cssText = 'font-size: 10px; font-weight: 600; color: #000; margin-left: auto; cursor: pointer;top:0';

        const closeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        closeIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        closeIcon.setAttribute("width", "18");
        closeIcon.setAttribute("height", "18");
        closeIcon.setAttribute("viewBox", "0 0 24 24");
        closeIcon.setAttribute("fill", "none");
        closeIcon.setAttribute("stroke", "currentColor");
        closeIcon.setAttribute("stroke-width", "2");
        closeIcon.setAttribute("stroke-linecap", "round");
        closeIcon.setAttribute("stroke-linejoin", "round");
        closeIcon.classList.add("lucide", "lucide-x");

        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M18 6 6 18");

        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "m6 6 12 12");

        closeIcon.appendChild(path1);
        closeIcon.appendChild(path2);

        closeButton.appendChild(closeIcon);

        const containerInner = document.createElement('div');
        containerInner.className = 'container-inner';
        containerInner.style.cssText = 'overflow-y: auto;padding: 10px 15px 4px 15px; display: flex; flex-direction: column;';
        function adjustContainerInnerSize() {
            const screenHeight = window.innerHeight;
            if (screenHeight < 650) {
                containerInner.style.height = '50%';
                containerInner.style.paddingBottom = '4%';
            } else {
                containerInner.style.height = '365px';
                containerInner.style.paddingBottom = '-4%';
            }
        }

        adjustContainerInnerSize();

        window.addEventListener('resize', adjustContainerInnerSize);

        const conversation = document.createElement('div');
        conversation.className = 'conversation';
        conversation.style.cssText = 'flex: 1; padding: 10px; border-radius: 8px; margin-bottom: 10px; height: 360px;';
        const screenHeight = window.innerHeight;

        if (screenHeight <= 600) {
            conversation.style.height = '200px';
        } else if (screenHeight <= 800) {
            conversation.style.height = '280px';
        } else {
            conversation.style.height = '360px';
        }

        const aiFirst = document.createElement('div');
        aiFirst.style.display = 'flex';
        aiFirst.style.flexDirection = 'column';
        aiFirst.style.alignItems = 'start';

        const avatarContainer = document.createElement('div');
        avatarContainer.style.display = 'flex';
        avatarContainer.style.alignItems = 'center';
        avatarContainer.style.marginBottom = '8px';
        avatarContainer.style.marginLeft = '-15px';

        const avatarImage = document.createElement('img');
        avatarImage.src = chatBot[0].image;
        avatarImage.alt = '';
        avatarImage.style.width = '24px';
        avatarImage.style.height = '24px';
        avatarImage.style.marginRight = '8px';

        const botName = document.createElement('div');
        botName.style.cssText = 'color: #666; font-size: 12px;';
        botName.textContent = chatBot[0].title;

        const message1 = document.createElement('div');
        message1.className = 'message left';
        message1.style.cssText = 'background-color: #E9E9EAFF; color: #333; float: left; align-self: flex-start;max-width: 85%;margin-bottom: 20px;padding: 10px;border-radius:2px 14px 14px 14px ;margin-left:10px';
        message1.textContent = chatBot[0].introMsg;

        avatarContainer.appendChild(avatarImage);
        avatarContainer.appendChild(botName);
        aiFirst.appendChild(avatarContainer);
        aiFirst.appendChild(message1);
        conversation.appendChild(aiFirst)

        const typing = document.createElement('div');
        typing.className = 'typing';
        typing.style.cssText = 'flex: 1; background-color: transparent; border-top: 1px solid transparent;display: flex; align-items: center; padding:8px; border-radius: 8px; position: absolute; bottom: 0; width: 90%;';

        const typingMessage = document.createElement('div');
        typingMessage.className = 'typing-message';
        typingMessage.style.cssText = 'margin-right: 10px;';

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Type your message here';
        inputField.style.cssText = 'flex: 1; padding: 5px; margin-right: 10px; border: 1px solid #DFDFE1FF; border-radius: 3px;';
        inputField.autofocus = true;

        const sendIcon = document.createElement('div');
        sendIcon.className = 'send-icon';
        sendIcon.style.cursor = 'pointer';
        sendIcon.style.width = '30px';
        sendIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve"><path fill="#007bff" d="M22,11.7V12h-0.1c-0.1,1-17.7,9.5-18.8,9.1c-1.1-0.4,2.4-6.7,3-7.5C6.8,12.9,17.1,12,17.1,12H17c0,0,0-0.2,0-0.2c0,0,0,0,0,0c0-0.4-10.2-1-10.8-1.7c-0.6-0.7-4-7.1-3-7.5C4.3,2.1,22,10.5,22,11.7z" /></svg>';

        company.appendChild(header);
        topRow.appendChild(avatar);
        topRow.appendChild(company);
        topRow.appendChild(toggleButton);
        topRow.appendChild(closeButton);
        content.appendChild(topRow);
        containerInner.appendChild(conversation);
        typing.appendChild(inputField);
        typing.appendChild(sendIcon);
        containerInner.appendChild(typing);
        dialog.appendChild(content);
        dialog.appendChild(containerInner);
        document.body.appendChild(openDialogButton);
        document.body.appendChild(dialog);

        openDialogButton.addEventListener('click', function () {
            dialog.style.display = 'block';
            containerInner.scrollTop = containerInner.scrollHeight;
            inputField.focus();
        });

        closeButton.addEventListener('click', function () {
            dialog.style.display = 'none';
        });

        sendIcon.addEventListener('click', function () {
            const messageContent = inputField.value.trim();
            sendMessage(messageContent);
            containerInner.scrollTop = containerInner.scrollHeight;
        });
        inputField.addEventListener('keypress', function (event) {
            if (event.key === 'Enter' && event.shiftKey) {
                event.preventDefault();
                inputField.value += '\n';
                containerInner.scrollTop = containerInner.scrollHeight;
            } else if (event.key === 'Enter') {
                const messageContent = inputField.value.trim();
                sendMessage(messageContent);
                containerInner.scrollTop = containerInner.scrollHeight;
            }
        });
        const followupQuestionsSection = document.createElement('div');
        followupQuestionsSection.className = 'follow-up';
        const connectMsg = document.createElement('div');
        const buttonPermission = document.createElement('div');
        connectMsg.style.cssText = 'mmargin-left:-15px;margin-bottom:8px;';

        const msg = document.createElement('div');
        msg.style.cssText = 'color: #666; font-size: 12px;margin-left:10px;display: flex;  ';

        buttonPermission.style.cssText = "display: inline;column-gap: 10px;row-gap: 10px;padding: 12px;"
        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.style.cssText = 'margin-left:4px;padding: 4px;border-radius: 8px;border:0;background-color: rgb(0, 123, 255);color: rgb(255, 255, 255);cursor: pointer;';
        yesButton.addEventListener('click', openCustomDialog);

        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.style.cssText = 'margin-left:10px;padding: 4px;border-radius: 8px;border:0;background-color:rgb(233, 233, 234);color: rgb(51, 51, 51);;cursor: pointer;';

        connectMsg.appendChild(msg);
        buttonPermission.appendChild(yesButton);
        buttonPermission.appendChild(noButton);

        connectMsg.appendChild(buttonPermission);
        let LeadSubmitDiloge;
        while (followupQuestionsSection.firstChild) {
            followupQuestionsSection.removeChild(followupQuestionsSection.firstChild);
        }
        followupQuestionsSection.style.cssText = 'display: flex; flex: 1; padding: 2px; min-height: 20px; margin: 0px; align-items: flex-start;  color: #333; overflow-x: auto; position: absolute; bottom: 0; margin-bottom:48px;width:92%';

        const followupQuestionsRow = document.createElement('div');
        followupQuestionsRow.style.cssText = 'display: flex; flex-direction: row;gap:2px';
        
        console.log(chatBot[0].followupQuestions)
        chatBot[0].followupQuestions.forEach((followQueItem, index) => {

            if (index < 4) {
                const followupQuestionItem = document.createElement('div');
                followupQuestionItem.style.cssText = 'min-width: 28%';
                const button = document.createElement('button');
                button.style.cssText = 'position: relative; white-space: nowrap; border-radius: 0.375rem; padding-top: 0.75rem; padding-right: 1rem; padding-bottom: 0.75rem; padding-left: 1rem;min-width:100px;border:0px;';
                button.addEventListener('click', () => {
                    // const messageContent = `${followQueItem.part1} ${followQueItem.part2}`;
                    const messageContent = `${followQueItem}`;
                    sendMessage(messageContent);
                    containerInner.scrollTop = containerInner.scrollHeight;
                });
                const flexContainer = document.createElement('div');
                flexContainer.style.cssText = 'display: flex; width: 100%;  align-items: center; justify-content: center;';

                const flexInnerContainer = document.createElement('div');
                flexInnerContainer.style.cssText = 'display: flex; width: 100%; align-items: center; justify-content: space-between;';

                const textContainer = document.createElement('div');
                textContainer.style.cssText = 'display: flex; flex-direction: column; overflow: hidden;';

                const truncatedPart1 = document.createElement('div');
                truncatedPart1.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';

                // truncatedPart1.textContent = followQueItem.part1;
                truncatedPart1.textContent = followQueItem;
                const truncatedPart2 = document.createElement('div');
                truncatedPart2.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: normal; opacity: 0.5;';
                // const truncatedText = followQueItem.part2.substring(0, 18);
                const truncatedText = followQueItem.substring(0, 18);

                // const truncatedContent = followQueItem.part2.length > 18 ? truncatedText + '...' : truncatedText;
                const truncatedContent = followQueItem.length > 18 ? truncatedText + '...' : truncatedText;

                truncatedPart2.textContent = truncatedContent;

                textContainer.appendChild(truncatedPart1);
                textContainer.appendChild(truncatedPart2);

                flexInnerContainer.appendChild(textContainer);

                flexContainer.appendChild(flexInnerContainer);
                button.appendChild(flexContainer);
                followupQuestionItem.appendChild(button);
                followupQuestionsRow.appendChild(followupQuestionItem);
            }
        });

        followupQuestionsSection.appendChild(followupQuestionsRow);
        containerInner.appendChild(followupQuestionsSection);
        function sendMessage(messageContent) {
            const userContainer = document.createElement('div');
            userContainer.style.display = 'flex';
            userContainer.style.alignItems = 'end';
            userContainer.style.marginBottom = '8px';
            userContainer.style.marginLeft = '-15px';

            const svgIcon = document.createElement('img');
            svgIcon.src = 'https://img.icons8.com/color/48/user.png';
            svgIcon.alt = '';
            svgIcon.style.width = '24px';
            svgIcon.style.height = '24px';
            svgIcon.style.marginRight = '8px';

            const userName = document.createElement('div');
            userName.style.cssText = 'color: #666; font-size: 12px;';
            userName.textContent = "Customer";

            userContainer.appendChild(svgIcon);
            userContainer.appendChild(userName);

            const responseUserContent = messageContent;

            conversation.style.display = 'flex';
            conversation.style.flexDirection = 'column';

            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'end';
            container.appendChild(userContainer);

            const responseUserMessage = document.createElement('div');
            responseUserMessage.className = 'message right';
            responseUserMessage.style.cssText = 'position: relative; background-color: #007bff; color: #fff; float: right; align-self: flex-end; max-width: 85%; margin-bottom: 10px; padding: 10px; border-radius:14px 2px 14px 14px;';
            responseUserMessage.textContent = responseUserContent;

            container.appendChild(responseUserMessage);
            conversation.appendChild(container);
            if (messageContent !== '') {
                inputField.value = '';

                const ai = document.createElement('div');
                ai.style.display = 'flex';
                ai.style.flexDirection = 'column';
                ai.style.alignItems = 'start';
                ai.style.marginBottom = '20px';


                const avatarContainer = document.createElement('div');
                avatarContainer.style.display = 'flex';
                avatarContainer.style.alignItems = 'center';
                avatarContainer.style.marginBottom = '8px';
                avatarContainer.style.marginLeft = '-15px';

                const avatarImage = document.createElement('img');
                avatarImage.src = chatBot[0].image;
                avatarImage.alt = '';
                avatarImage.style.width = '24px';
                avatarImage.style.height = '24px';
                avatarImage.style.marginRight = '8px';

                const botName = document.createElement('div');
                botName.style.cssText = 'color: #666; font-size: 12px;';
                botName.textContent = "TAU Chatbot";

                avatarContainer.appendChild(avatarImage);
                avatarContainer.appendChild(botName);


                const typingMessage = document.createElement('div');
                typingMessage.className = 'message left';
                typingMessage.style.cssText = `background-color: #E9E9EAFF; color: #333; float: left; align-self: flex-start;max-width: 85%;margin-bottom: 20px;padding: 10px;border-radius: 10px;animation: blinker 1.5s linear infinite;overflow-wrap: break-word;`;
                typingMessage.textContent = 'Typing...';
                conversation.appendChild(typingMessage);

                const style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `@keyframes blinker {50% { opacity: 0; }}`;

                document.head.appendChild(style);

                const apiUrl = 'https://dev-portal.enterprise.tau.simplyfy.ai/api/v1/master/organisation/chat-service/chat/?is_testing=True';
                const requestBody = {
                    "service_id": `${serviceId}`,
                    "messages": [
                        {
                            "role": "user",
                            "content": messageContent
                        }
                    ]
                };
                const responseTimeout = setTimeout(() => {
                    conversation.removeChild(typingMessage);
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'message left';
                    errorMessage.style.cssText = 'background-color: #E9E9EAFF; color: #333; float: left; align-self: flex-start;max-width: 85%;margin-bottom: 20px;padding: 10px;border-radius: 10px';
                    errorMessage.textContent = 'Response is taking too long. Please try again later.';
                    conversation.appendChild(errorMessage);
                }, 5000);
                console.log(requestBody);
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        conversation.removeChild(typingMessage);
                        let responseDataContent;
                        if (typeof data.data.content === 'string') {
                            responseDataContent = data.data.content;
                        } else if (Array.isArray(data.data.content) || typeof data.data.content === 'object') {
                            responseDataContent = data.data.content.answer;
                        }
                        const leadGenerationPitch = data.data.content.lead_generation_pitch

                        msg.textContent = leadGenerationPitch;


                        const responseMessage = document.createElement('div');
                        responseMessage.className = 'message left';
                        responseMessage.style.cssText = 'background-color: #E9E9EAFF; color: #333; float: left; align-self: flex-start;max-width: 85%;margin-bottom: 20px;padding: 10px;border-radius:2px 14px 14px 14px ;margin-left:10px';
                        ai.appendChild(avatarContainer);
                        ai.appendChild(responseMessage);
                        // if (data.data.content.can_handle === 1) { ai.appendChild(connectMsg); }
                        conversation.appendChild(ai);

                        // typeText(responseMessage, responseDataContent, 50);
                        typeText(responseMessage, responseDataContent, 50, () => {
                            if (data.data.content.can_handle === 1 && leadGenerationPitch) {
                                ai.appendChild(connectMsg);
                                LeadSubmitDiloge = true;
                            } else {
                                LeadSubmitDiloge = false;
                            }
                        })

                        console.log(LeadSubmitDiloge)
                        chatBot[0].followupQuestions = data.example_prompts;
                        chatBot[0].followupQuestions.forEach((followQueItem, index) => {
                
                            if (index < 4) {
                                const followupQuestionItem = document.createElement('div');
                                followupQuestionItem.style.cssText = 'min-width: 28%; ';
                
                                const button = document.createElement('button');
                                button.style.cssText = 'position: relative; white-space: nowrap; border-radius: 0.375rem; padding-top: 0.75rem; padding-right: 1rem; padding-bottom: 0.75rem; padding-left: 1rem;min-width:100px;border:0px;';
                                button.addEventListener('click', () => {
                                    // const messageContent = `${followQueItem.part1} ${followQueItem.part2}`;
                                    const messageContent = `${followQueItem}`;
                                    sendMessage(messageContent);
                                    containerInner.scrollTop = containerInner.scrollHeight;
                                });
                                const flexContainer = document.createElement('div');
                                flexContainer.style.cssText = 'display: flex; width: 100%;  align-items: center; justify-content: center;';
                
                                const flexInnerContainer = document.createElement('div');
                                flexInnerContainer.style.cssText = 'display: flex; width: 100%; align-items: center; justify-content: space-between;';
                
                                const textContainer = document.createElement('div');
                                textContainer.style.cssText = 'display: flex; flex-direction: column; overflow: hidden;';
                
                                const truncatedPart1 = document.createElement('div');
                                truncatedPart1.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
                
                                // truncatedPart1.textContent = followQueItem.part1;
                                truncatedPart1.textContent = followQueItem;
                                const truncatedPart2 = document.createElement('div');
                                truncatedPart2.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: normal; opacity: 0.5;';
                                // const truncatedText = followQueItem.part2.substring(0, 18);
                                const truncatedText = followQueItem.substring(0, 18);
                
                                // const truncatedContent = followQueItem.part2.length > 18 ? truncatedText + '...' : truncatedText;
                                const truncatedContent = followQueItem.length > 18 ? truncatedText + '...' : truncatedText;
                
                                truncatedPart2.textContent = truncatedContent;
                
                                textContainer.appendChild(truncatedPart1);
                                textContainer.appendChild(truncatedPart2);
                
                                flexInnerContainer.appendChild(textContainer);
                
                                flexContainer.appendChild(flexInnerContainer);
                                button.appendChild(flexContainer);
                                followupQuestionItem.appendChild(button);
                                followupQuestionsRow.appendChild(followupQuestionItem);
                            }
                        });
                        containerInner.scrollTop = containerInner.scrollHeight;

                    })
                    .catch(error => {
                        clearTimeout(responseTimeout);
                        console.error('Error:', error);
                    });

            }
        }

        function openCustomDialog() {
            const dialogBox = document.createElement('div');
            dialogBox.className = 'custom-dialog';
            const screenWidth = window.innerWidth;
            if (screenWidth < 768) {
                dialogBox.style.cssText = `
                    position: fixed;
                    inset: 50% 20% 19% 50%;
                    width: 50%;
                    transform: translate(-50%, -50%);
                    padding: 20px;
                    z-index: 9999;
                    background-color: rgb(255, 255, 255);
                    border: 1px solid rgb(223, 223, 225);
                    border-radius: 8px;
                    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px;
                    display: grid;
                    gap: 12px;
                `;
            } else {
                dialogBox.style.cssText = `
                    position: fixed;
                    inset: 50% 20% 19% 86%;     
                    width: 16%;     
                    transform: translate(-50%, -50%);
                    padding: 20px;
                    z-index: 9999;
                    background-color: rgb(255, 255, 255);
                    border: 1px solid rgb(223, 223, 225);
                    border-radius: 8px;
                    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px;
                    display: grid;
                    gap: 12px;
                `;
            }

            const headerRow = document.createElement('div');
            headerRow.style.cssText = "width:100%;display: flex;justify-content: space-between;align-items: center;";
            const modelHeading = document.createElement('div');
            modelHeading.style.cssText = `color:black;font-size:20px`;
            modelHeading.textContent = 'Please fill details:';

            const closeButtonSecond = document.createElement('div');
            closeButtonSecond.className = 'close-button';
            closeButtonSecond.style.cssText = `
                font-size: 10px;
                font-weight: 600;
                color: #000;
                margin-left: auto;
                cursor: pointer;
            `;
            const closeIconSecond = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            closeIconSecond.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            closeIconSecond.setAttribute("width", "18");
            closeIconSecond.setAttribute("height", "18");
            closeIconSecond.setAttribute("viewBox", "0 0 24 24");
            closeIconSecond.setAttribute("fill", "none");
            closeIconSecond.setAttribute("stroke", "currentColor");
            closeIconSecond.setAttribute("stroke-width", "2");
            closeIconSecond.setAttribute("stroke-linecap", "round");
            closeIconSecond.setAttribute("stroke-linejoin", "round");
            closeIconSecond.classList.add("lucide", "lucide-x");

            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path1.setAttribute("d", "M18 6 6 18");

            const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path2.setAttribute("d", "m6 6 12 12");

            closeIconSecond.appendChild(path1);
            closeIconSecond.appendChild(path2);

            closeButtonSecond.appendChild(closeIconSecond);

            const createRow = (labelText, inputType, inputPlaceholder) => {
                const row = document.createElement('div');
                row.style.cssText = "display: flex; justify-content: center; row-gap: 5px; column-gap: 12px; align-items: center;";

                const label = document.createElement('label');
                label.style.cssText = "color: black; width: 30%;";
                label.textContent = labelText;

                const input = document.createElement('input');
                input.type = inputType;
                input.placeholder = inputPlaceholder;
                input.style.cssText = "width: 70%; background-color: #FFFFFF; border: 1px solid #DFDFE1FF; padding: 4px 2px;";

                row.appendChild(label);
                row.appendChild(input);

                return { row, input };
            };

            const { row: nameRow, input: nameInput } = createRow('Name:', 'text', 'Enter your name');
            const { row: emailRow, input: emailInput } = createRow('Email:', 'email', 'Enter your email');
            const { row: numberRow, input: numberInput } = createRow('Number:', 'text', 'Enter your number');

            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = "color: red; display: none;";

            const submitButton = document.createElement('button');
            submitButton.style.cssText = "width: 100%; padding: 4px 3px; background: rgb(0, 123, 255); color: rgba(255, 255, 255, 1); border: 0; border-radius: 2px; font-weight: 600; font-size: medium;";
            submitButton.textContent = 'Submit';

            headerRow.appendChild(modelHeading);
            headerRow.appendChild(closeButtonSecond);
            dialogBox.appendChild(headerRow);
            dialogBox.appendChild(nameRow);
            dialogBox.appendChild(emailRow);
            dialogBox.appendChild(numberRow);
            dialogBox.appendChild(errorMessage);
            dialogBox.appendChild(submitButton);

            document.body.appendChild(dialogBox);

            submitButton.addEventListener('click', function () {
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const number = numberInput.value.trim();

                let isValid = true;
                let errorMsg = '';

                if (name.length < 3) {
                    isValid = false;
                    errorMsg = 'Name must be at least 3 characters long.';
                } else if (!/^\d{10}$/.test(number)) {
                    isValid = false;
                    errorMsg = 'Number must be exactly 10 digits long.';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    isValid = false;
                    errorMsg = 'Please enter a valid email address.';
                }

                if (isValid) {
                    const formData = {
                        organisation_id: 48,
                        name: name,
                        email: email,
                        phone_number: number
                    };


                    fetch('https://dev-portal.enterprise.tau.simplyfy.ai/api/v1/master/organisation/submit/lead/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    })
                        .then(response => response.json())
                        .then(data => {
                            // console.log('Success:', data);

                            headerRow.removeChild(modelHeading);
                            dialogBox.removeChild(nameRow);
                            dialogBox.removeChild(emailRow);
                            dialogBox.removeChild(numberRow);
                            dialogBox.removeChild(errorMessage);
                            dialogBox.removeChild(submitButton);

                            const thankMessage = document.createElement('div');
                            thankMessage.style.cssText = "color: black; text-align: center; font-size: 22px; align-items: center; display: grid; justify-items: center; ";

                            const checkIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                            checkIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                            checkIcon.setAttribute("width", "26");
                            checkIcon.setAttribute("height", "26");
                            checkIcon.setAttribute("viewBox", "0 0 24 24");
                            checkIcon.setAttribute("fill", "none");
                            checkIcon.setAttribute("stroke", "currentColor");
                            checkIcon.setAttribute("stroke-width", "2");
                            checkIcon.setAttribute("stroke-linecap", "round");
                            checkIcon.setAttribute("stroke-linejoin", "round");
                            checkIcon.classList.add("lucide", "lucide-check");
                            checkIcon.style.cssText = "background-color: aqua;padding: 3px;border-radius: 3px;";

                            const checkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                            checkPath.setAttribute("d", "M20 6 9 17l-5-5");

                            checkIcon.appendChild(checkPath);

                            thankMessage.appendChild(checkIcon);
                            const thankYouMessage = document.createElement('div');

                            thankYouMessage.appendChild(document.createTextNode(" Thanks for showing interest in our service. We will contact you soon."));
                            thankMessage.appendChild(thankYouMessage)
                            dialogBox.insertBefore(thankMessage, dialogBox.firstChild);
                            connectMsg.style.display = 'none';

                            LeadSubmitDiloge = false;

                            setTimeout(() => {
                                document.body.removeChild(dialogBox);
                            }, 6000);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                            errorMessage.textContent = 'An error occurred while submitting the form. Please try again later.';
                            errorMessage.style.display = 'block';
                        });
                } else {
                    errorMessage.textContent = errorMsg;
                    errorMessage.style.display = 'block';
                }
            });


            closeButtonSecond.addEventListener('click', function () {
                document.body.removeChild(dialogBox);
            });
        }
        // function typeText(element, text, speed) {
        //     let index = 0;
        //     function type() {
        //         if (index < text.length) {
        //             element.textContent += text.charAt(index);
        //             index++;
        //             setTimeout(type, speed);
        //         }
        //     }
        //     type();
        // }
        function typeText(element, text, speed, callback) {
            let index = 0;
            function type() {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, speed);
                } else if (callback) {
                    callback();
                }
            }
            type();
        }
        let darkMode = false;
        toggleButton.addEventListener('click', () => {
            darkMode = !darkMode;
            if (darkMode) {
                dialog.style.setProperty('--bg-color', '#171719FF');
                dialog.style.setProperty('--text-color', '#FFF');
                dialog.style.setProperty('--header-bg', 'linear-gradient(to right, #1e3c72, #2a5298)');
                // message1.style.backgroundColor = ('--message-bg-left','#575757fa');
                // message1.style.color = ('--message-color-left','#E9E9EAFF');
                // typingMessage.style.backgroundColor = ('--message-bg-left','#575757fa');
                // typingMessage.style.color = ('--message-color-left','#E9E9EAFF');

                toggleButton.style.backgroundColor = '#0056b3';
            } else {
                dialog.style.setProperty('--bg-color', '#FFFFFF');
                dialog.style.setProperty('--text-color', '#000');
                dialog.style.setProperty('--header-bg', 'linear-gradient(to right, #93eefa, #5b5bc2)');
                toggleButton.style.backgroundColor = '#007bff';
            }

            document.body.style.backgroundColor = 'var(--bg-color)';
            document.body.style.color = 'var(--text-color)';
            dialog.style.backgroundColor = 'var(--bg-color)';
            dialog.style.color = 'var(--text-color)';
            topRow.style.background = 'var(--header-bg)';
            // message1.style.backgroundColor = 'var(--message-bg-left)';
        });

        document.documentElement.style.setProperty('--bg-color', '#FFFFFF');
        document.documentElement.style.setProperty('--text-color', '#000');
        document.documentElement.style.setProperty('--header-bg', 'linear-gradient(to right, #93eefa, #5b5bc2)');
        document.documentElement.style.setProperty('--message-bg-left', '#E9E9EAFF');
        document.documentElement.style.setProperty('--message-color-left', '#333');
        // document.documentElement.style.setProperty('--message-bg-left-dark', '#38383A99');
        document.documentElement.style.setProperty('--message-bg-right', '#007bff');

        dialog.style.backgroundColor = 'var(--bg-color)';
        dialog.style.color = 'var(--text-color)';
        topRow.style.background = 'var(--header-bg)';
        // message1.style.backgroundColor = 'var(--message-bg-left)';
        // message1.style.color = 'var(--message-color-left)';

    }
    const style = document.createElement('style');
    style.textContent = `
     .container-inner::-webkit-scrollbar {
         width: 4px;
         height: 3px;
     }
     .container-inner::-webkit-scrollbar-track {
         border-radius: 8px;
     }
     .container-inner::-webkit-scrollbar-thumb {
         background-color: darkgrey;
         border-radius: 8px;
     }
     .follow-up::-webkit-scrollbar {
         width: 4px;
         height: 3px;
     }
     .follow-up::-webkit-scrollbar-track {
         border-radius: 8px;
     }
     .follow-up::-webkit-scrollbar-thumb {
         background-color: darkgrey;
         border-radius: 8px;
     }
 `;
    document.head.appendChild(style);
});
