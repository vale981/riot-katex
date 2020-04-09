(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    /**
     * Set up math delimiters.
     */
    const math_config = [
        {left: "$$", right: "$$", display: true},
        {left: "\\(", right: "\\)", display: false},
        {left: "\\[", right: "\\]", display: true}
    ]

    /**
     * Initialize Extension as soon as matrix has been loaded.
     */
    function init() {
        // render with KaTeX as soon as the message appears
        function listen_on_chat_element() {
            const chat_elem = document.querySelector('.mx_RoomView_MessageList');
            renderMathInElement(chat_elem, math_config);

            const callback = function(mutationsList, observer) {
                // Use traditional 'for loops' for IE 11
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for(let node of mutation.addedNodes) {
                            renderMathInElement(node, math_config);
                        }
                    }
                }
            };

            const observer = new MutationObserver(callback);
            observer.observe(chat_elem, { attributes: true, childList: true, subtree: true });
            return observer;
        }

        // when changing the chat room, we have to create a new listener
        function change_chat_element(mutationsList, observer) {
            if (chat_observer) {
                chat_observer.disconnect();
            }

            chat_observer = listen_on_chat_element();
        }

        // start listening
        let chat_observer = listen_on_chat_element();

        // start listening on the header as well
        const header = document.querySelector('.mx_RoomList');
        const header_obs = new MutationObserver(change_chat_element)
        header_obs.observe(header, { attributes: true, childList: true, subtree: true });
    }

    // a clever hack to check if riot has been loaded yet
    function wait_for_matrix() {
        if(!('matrixChat' in window.wrappedJSObject
             && window.wrappedJSObject.matrixChat.firstSyncComplete))
            return setTimeout(wait_for_matrix, 500);

        init();
    }

    wait_for_matrix();
})();
