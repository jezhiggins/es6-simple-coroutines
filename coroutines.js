
function* lucas_sequence() {
    let a = 2, b = 1;
    yield a;
    while (true) {
	yield b;
	[a, b] = [b, a + b];
    }
} // lucas_sequence

function* async_is_prime(x) {
    if (x < 2)
	return false;
    for (let i = 2; i <= Math.sqrt(x) + 1; ++i) {
	if (x % i == 0)
	    return false;
	yield* async_sleep(0);
    }
    return true;
} // async_is_prime

function* async_search(iterable, async_predicate) {
    for (const item of iterable)
	if (yield* async_predicate(item))
	    return item;
    return null;
} // async_search

function* async_print_matches(iterable, async_predicate) {
    for (const item of iterable) {
	const matches = yield* async_predicate(item);
	if (matches)
	    console.log(`Found ${item}`)
    }
} // async_print_matches

function* async_message_after(message, interval_seconds) {
    yield* async_sleep(interval_seconds);
    console.log(message);
    return `I said "${message}"`;
} // async_message_after

function* async_repetitive_message(message, interval_seconds) {
    while (true) {
	console.log(message);
	yield* async_sleep(interval_seconds);
    } //
} // async_repetitive_message

function* async_sleep(interval_seconds) {
    const expiry = Date.now() + (interval_seconds * 1000);
    while (true) {
	yield;
	const now = Date.now();
	if (now >= expiry)
	    break;
    }
} // async_sleep


///////////////////////////////////
class task {
    constructor(iterable) {
	this.iterable_ = iterable;
	this.id = task.next_id.next().value;
    }

    next() {
	return this.iterable_.next();
    } // next
}
task.next_id_gen = function*() {
    let id = 0;
    while (true)
	yield id++;
} // next_id_gen
task.next_id = task.next_id_gen();


class scheduler {
    constructor() {
	this.tasks_ = []
    }

    add_task(generator) {
	this.tasks_.push(new task(generator));
    }

    run() {
	while (this.tasks_.length != 0) {
	    const task = this.tasks_[0];
	    this.tasks_ = this.tasks_.slice(1);
	    const step = task.next();
	    if (step.done)
		console.log(`Task ${task.id} completed with exit value: ${step.value}`);
	    else
		this.tasks_ = this.tasks_.concat([task]);
	} // while
    } // run
} // scheduler

const loop = new scheduler();
loop.add_task(async_repetitive_message("Unexpected item in the bagging area", 2));
loop.add_task(async_print_matches(lucas_sequence(), async_is_prime));
loop.add_task(async_message_after("SCREW THIS!", 5));
loop.run();
