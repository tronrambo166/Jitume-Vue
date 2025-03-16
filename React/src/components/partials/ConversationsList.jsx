import React from "react";

function ConversationsList({
    messages,
    selectedMessage,
    isMobileView,
    onSelectMessage,
}) {
    return (
        <div
            className={`w-full md:w-1/3 bg-white border-r overflow-y-auto ${
                isMobileView && selectedMessage ? "hidden" : ""
            }`}
        >
            <div className="p-4 border-b bg-white mt-6 sm:mt-0">
                <hr className="border-t border-gray-300 mb-4 sm:hidden"></hr>
                <h3 className="text-lg mb-[13px] font-bold">Conversations</h3>
            </div>

            {messages
                .sort((a, b) => {
                    const isNewA = a.new === 1 ? 1 : 0;
                    const isNewB = b.new === 1 ? 1 : 0;

                    if (isNewA !== isNewB) {
                        return isNewB - isNewA; // Prioritize new messages first
                    }

                    // If both messages have the same 'new' status, sort by the latest timestamp
                    const lastMsgA = a.messages?.length
                        ? new Date(a.messages[a.messages.length - 1].created_at)
                        : new Date(0);
                    const lastMsgB = b.messages?.length
                        ? new Date(b.messages[b.messages.length - 1].created_at)
                        : new Date(0);

                    return lastMsgB - lastMsgA; // Show the latest message first
                })
                .map((msg) => (
                    <ConversationItem
                        key={msg.id}
                        message={msg}
                        isSelected={selectedMessage?.id === msg.id}
                        onSelect={() => onSelectMessage(msg)}
                    />
                ))}
        </div>
    );
}

function ConversationItem({ message: msg, isSelected, onSelect }) {
    return (
        <div
            onClick={onSelect}
            className={`p-4 flex items-center cursor-pointer border-b ${
                isSelected ? "bg-slate-100 text-blue-900" : "hover:bg-gray-50"
            }`}
        >
            <img
                src={
                    msg.avatarUrl ||
                    "https://agri-soko-2-1.vercel.app/assets/default-BeD4CxIB.jpg"
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
                <h4 className="font-semibold">{msg.sender}</h4>
                <p
                    className={`text-sm ${
                        msg.messages &&
                        msg.messages[0] &&
                        msg.messages[0].new === 1
                            ? "bg-green-500 bg-opacity-20 text-black font-medium shadow-lg backdrop-blur-md border border-green-300 rounded-lg p-3 pr-16"
                            : "text-gray-600"
                    }`}
                    style={{
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {msg.messages &&
                        msg.messages[0] &&
                        msg.messages[0].new === 1 && (
                            <span className="absolute top-1 right-2 font-semibold text-xs text-green-600 animate-pulse">
                                New
                            </span>
                        )}
                    {msg.messages && msg.messages.length > 0
                        ? msg.messages[0].msg
                        : "No messages yet"}
                </p>
            </div>
        </div>
    );
}

export default ConversationsList;
