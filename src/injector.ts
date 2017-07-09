function makeScreenshot(key) {
    let resolve;
    const className = `${makeid()}-flash`;

    function makeid() {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        for (var i = 0; i < 15; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    function getFlashEl() {
        return document.querySelector('.component-browser-flash');
    }

    function addStyle(str) {
        if (getFlashEl()) return;
        const node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }

    function flash() {
        let node = getFlashEl()
        if (!node) {
            node = document.createElement('div');
            node.className = className;
            document.body.appendChild(node)
        }
        node.className = `${className} active`;
        setTimeout(() => {
            node.className = className;
        }, 200)
    }

    function keyPressed(event) {
        if (event.key == key) {
            flash();
            document.removeEventListener('keydown', keyPressed)
            resolve();
        }
    }

    addStyle(`
        @keyframes ${className}-animation {
            0%   {opacity: 0}
            50%  {opacity: 1}
            100% {opacity: 0}
        }
        
        .${className} {
            position: fixed;
            background: white;
            z-index: 10000000;
            width: 100vw;
            height: 1000vh;
            opacity: 0;
            left: 0;
            top: 0;
        }

        .${className}.active {
            animation-name: ${className}-animation;
            animation-duration: 0.2s;
        }
    `);

    return new Promise((res, rej) => {
        resolve = res;
        document.addEventListener('keydown', keyPressed)
    })
}