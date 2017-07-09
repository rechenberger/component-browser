import { config } from './config';
import { Observable } from 'rxjs';
export function inject(client) {
    const { Runtime } = client;

    const first = Observable.fromPromise(firstInject(Runtime));
    const call = callInjectedFunction(Runtime)

    return first
        .switchMap(() => {
            console.log("injected");
            return call
            // return Observable.of(true)
            // .concat(call)
            // .concat(call)
            // .concat(call)
            // .concat(call)
            // .concat(call)
            // .concat(call)
            // .concat(call)
        })
}

function firstInject(Runtime) {
    return Runtime.evaluate({
        expression: `${makeScreenshot}`
    })
}

function callInjectedFunction(Runtime) {
    return new Observable(oberver => {

        const expression = `makeScreenshot('${config.screenshotKey}')`
        console.log('expression', expression);
        Runtime.evaluate({
            expression,
            awaitPromise: true
        }).then((data) => {
            console.log("data", data);
            oberver.next()
            oberver.complete()
        }).catch((err) => {
            oberver.error(err)
        })
    })
}

// Injected Stuff
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
        return document.querySelector(className);
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

    return new window.__zone_symbol__Promise((res, rej) => {
        resolve = res;
        document.addEventListener('keydown', keyPressed)
    })
}