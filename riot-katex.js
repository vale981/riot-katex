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

    const chat_class =  '.mx_RoomView_MessageList';
    const chat_item_class = '.mx_MTextBody';

    /**
     * Set up math delimiters.
     */
    const math_config = {
        delimiters :[
            {left: "$$$", right: "$$$", display: true},
            {left: "$$", right: "$$", display: false}
        ],
    }

    /**
     * Render math in a node if it hasn't already be done
     * and register an event on the edit button.
     */
    function renderMath(node) {
        if (!node)
            return;

        let li = node.closest('li');

        let contentNodes = li.querySelectorAll('.mx_EventTile_body');

        if (!content) {
            return;
        }

        for (let content of contentNodes) {
            if(content.getAttribute('originalContent') || content.getAttribute('editing'))  // already rendered
                continue;

            let og_content = (' ' + content.textContent).slice(1);
            //content.setAttribute('originalContent', og_content);
            renderMathInElement(content, math_config);
        }
    }

    /**
     * Initialize Extension as soon as matrix has been loaded.
     */
    function init() {
        // render with KaTeX as soon as the message appears
        function listen_on_chat_element() {
            let chat_elem = document.querySelector(chat_class);
            let chat_items = chat_elem.querySelectorAll(chat_item_class);

            for(let node of chat_items) {
                renderMath(node);
            }

            const callback = function(mutationsList, observer) {
                for(let mutation of mutationsList) {
                    if(mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        let node = mutation.target.querySelector(chat_item_class);
                        renderMath(node);
                    }

                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for(let node of mutation.addedNodes) {
                            node = node.querySelector(chat_item_class);
                            renderMath(node);
                        }
                    }
                }
            };

            const observer = new MutationObserver(callback);
            observer.observe(chat_elem, { attributes: true, childList: true, subtree: true });
            return observer;
        }

        const header = document.querySelector('title');

        // start listening
        let chat_observer = listen_on_chat_element();

        // when changing the chat room, we have to create a new listener
        function change_chat_element(mutationsList, observer) {
            if (chat_observer) {
                chat_observer.disconnect();
            }

            chat_observer = listen_on_chat_element();
        }

        // start listening on the header as well
        const header_obs = new MutationObserver(change_chat_element)
        header_obs.observe(header, { attributes: true, childList: true, subtree: true });
    }

    // a clever hack to check if riot has been loaded yet
    function wait_for_matrix() {
        if(!('matrixChat' in window.wrappedJSObject
             && window.wrappedJSObject.matrixChat.firstSyncComplete
             && document.querySelector(chat_class)))
            return setTimeout(wait_for_matrix, 500);

        init();
    }

    // detect Riot
    let app_name_meta = document.head.querySelector('meta[name="application-name"]');
    if (app_name_meta && app_name_meta.content === 'Riot')
        wait_for_matrix();
})();
