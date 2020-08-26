/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class Conversation {
    conversationContainer = document.createElement("div");
    messagesContainer = document.createElement("div");

    constructor() {
        this.conversationContainer.classList.add("container", "h-100", "w-100");
        this.conversationContainer.id = "conversation";

        const conversation = document.createElement("div");
        conversation.classList.add(
            "col-12",
            "row",
            "h-100",
            "justify-content-center",
            "align-items-center"
        );

        const chatBoxContainer = document.createElement("div");
        chatBoxContainer.classList.add(
            "rounded-lg",
            "overflow-hidden",
            "shadow",
            "chat-box-container"
        );
        const chatBox = document.createElement("div");
        chatBox.classList.add("col-12", "px-0");
        this.messagesContainer = document.createElement("div");
        this.messagesContainer.classList.add(
            "px-4",
            "py-5",
            "chat-box",
            "bg-white"
        );

        chatBox.appendChild(this.messagesContainer);
        chatBoxContainer.appendChild(chatBox);

        conversation.appendChild(chatBoxContainer);
        this.conversationContainer.appendChild(conversation);
    }

    /**
     * Appends a regular message to the conversation
     * @param {*} sender is the message receiver or sender
     * @param {*} text that the sender/receiver is saying
     * @param {*} avatarImg of the user 
     */
    appendMessage(sender, text, avatarImg) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("media", "w-50", "mb-3");

        const avatar = document.createElement("img");
        if (avatarImg != undefined) {
            avatar.src = avatarImg;
        } else {
            avatar.src =
                "https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg";
        }
        avatar.width = 50;
        avatar.classList.add("rounded-circle");

        const messageDivContainer = document.createElement("div");
        messageDivContainer.classList.add("media-body");
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("rounded", "py-2", "px-3", "mb-2");
        const message = document.createElement("p");
        message.classList.add("text-small", "mb-0");
        message.innerText = text;
        messageDiv.appendChild(message);
        messageDivContainer.appendChild(messageDiv);

        if (sender) {
            messageDivContainer.classList.add("ml-3");
            messageDiv.classList.add("bg-light");
            message.classList.add("text-muted");
            messageContainer.append(avatar, messageDivContainer);
        } else {
            messageContainer.classList.add("ml-auto");
            messageDivContainer.classList.add("mr-3");
            messageDiv.classList.add("bg-primary");
            message.classList.add("text-white");
            messageContainer.append(messageDivContainer, avatar);
        }

        this.messagesContainer.appendChild(messageContainer);
    }

    /**
     * Appends the search message to the conversation based on what the user looks up
     * @param {*} results results of the news search
     * @param {*} messageText that the nest hub says
     */
    appendSearchMessage(results, messageText) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("media", "w-50", "mb-3");

        const avatar = document.createElement("img");
        avatar.src =
            "https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg";
        avatar.width = 50;
        avatar.classList.add("rounded-circle");

        const messageDivContainer = document.createElement("div");
        messageDivContainer.classList.add("media-body", "ml-3");
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("rounded", "py-2", "px-3", "mb-2", "bg-light");

        const message = document.createElement("p");
        message.classList.add("text-small", "mb-0", "text-muted");
        message.innerText = messageText;
        messageDiv.appendChild(message);

        for (var i = 0; i < results.length; i++) {
            const article = document.createElement("p");
            article.classList.add(
                "text-small",
                "mb-0",
                "text-muted",
                "news-title"
            );
            article.innerText = `Article ${i + 1}`;

            const result = results[i];
            const title = document.createElement("h6");
            title.innerText = result.title;

            const img = document.createElement("img");
            img.classList.add("news-img");
            img.src = result.img;

            messageDiv.append(article, title, img);
        }

        messageDivContainer.appendChild(messageDiv);
        messageContainer.append(avatar, messageDivContainer);
        this.messagesContainer.appendChild(messageContainer);
    }

    /**
     * Returns the game session container
     */
    getConversation() {
        return this.conversationContainer;
    }
}
