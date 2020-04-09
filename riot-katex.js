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

    const math_config = [
        {left: "$$", right: "$$", display: true},
        {left: "\\(", right: "\\)", display: false},
        {left: "\\[", right: "\\]", display: true}
    ]

    function init() {
        const header = document.querySelector('.mx_RoomList');
        let chat_observer = listen_on_chat_element();
        function listen_on_chat_element() {
            const chat_elem = document.querySelector('.mx_RoomView_MessageList');
            renderMathInElement(chat_elem, math_config);

            const config = { attributes: true, childList: true, subtree: true };
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
            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(callback);

            // Start observing the target node for configured mutations
            observer.observe(chat_elem, config);
            return observer;
        }

        function change_chat_element(mutationsList, observer) {
            if (chat_observer) {
                chat_observer.disconnect();
            }

            chat_observer = listen_on_chat_element();
        }

        const header_obs = new MutationObserver(change_chat_element)
        const config = { attributes: true, childList: true, subtree: true };
        header_obs.observe(header, config);
    }

    let  = window.wrappedJSObject;

    function wait_for_matrix() {
        if(!('matrixChat' in window.wrappedJSObject
             && window.wrappedJSObject.matrixChat.firstSyncComplete))
            return setTimeout(wait_for_matrix, 500);

        init();
    }

    wait_for_matrix();
})();
