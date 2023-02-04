export const getChat = async (_this, chatId) => {
    return await _this.chatsRepository.findOneBy({ chatId });
}

export const createChat = async (_this, chatId) => {
    const newChat: any = await _this.chatsRepository.create({ chatId });
    return await _this.chatsRepository.save(newChat);
}

export const updateChat = async (_this, chatId, action) => {
    const chat: any = await getChat(_this, chatId);
    return await _this.chatsRepository.save({ ...chat, action });
}

export const handleAction = async (_this, chatId, context, message, options = {}) => {
    let chat: any = await getChat(_this, chatId);
    if (!chat) {
        chat = await createChat(_this, chatId);
    }
    if (chat) {
        console.debug(chat);
        const response: any = await updateChat(_this, chatId, context);
        if (response) {
            console.debug(response);
            await _this.bot.sendMessage(chatId, message, options);
        }
    }
}