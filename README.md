# es6-simple-coroutines
Simple example of using ES6 generators to implement cooperative multitasking.

```javascript
const loop = new scheduler();

loop.add_task(a_generator_instance);
loop.add_task(another_generator_instance);
loop.add_task(and_so_on);

loop.run();
```

That's it!

---

Lifted almost directly from Python examples presented by [Robert Smallshire](http://twitter.com/robsmallshire) of [Sixty North](http://sixty-north.com/) at [ACCU 2017](https://conference.accu.org/).  Many thanks!
