const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
    foo() {
        this.emit('test', this);
    }
}
const myEmitter = new MyEmitter();
myEmitter.on('test', (dados) => console.log('Yay, it works!', dados));
myEmitter.emit('ola', 'Dadps');
myEmitter.foo();
myEmitter.foo();

