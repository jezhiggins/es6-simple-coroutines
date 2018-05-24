#!/usr/bin/env node

function* lucas_sequence() {
    let a = 2, b = 1;
    yield a;
    while (true) {
	yield b;
	[a, b] = [b, a + b];
    }
} // lucas_sequence

function* int_range(from, to) {
    for (let i = from; i <= to; ++i)
	yield i;
} // int_range

function* async_search(iterable, async_predicate) {
    for (const item of iterable)
	if (yield* async_predicate(item))
	    return item;
    return null;
} // async_search

function* async_is_prime(x) {
    if (x < 2)
	return false;
    for (const i of int_range(2, Math.sqrt(x) + 1)) {
	if (x % i == 0)
	    return false;
	yield* async_sleep(0);
    }
    return true;
} // async_is_prime

function* async_print_matches(iterable, async_predicate) {
    for (const item of iterable) {
	const matches = yield* async_predicate(item);
	if (matches)
	    console.log(`Found ${item}`)
    }
} // async_print_matches

function* async_repetitive_message(message, interval_seconds) {
    while (true) {
	yield* async_sleep(interval_seconds);
	console.log(message);
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

function* async_message_after(message, interval_seconds) {
    yield* async_sleep(interval_seconds);
    console.log(message);
    return `I said "${message}"`;
} // async_message_after

///////////////////////////////////
class scheduler {
    constructor() {
	this.id_ = 0;
	this.tasks_ = []
	this.monitor_ = null;
    }

    add_task(generator) {
	this.tasks_.push({id: this.id_++, worker: generator});
    }
    set_monitor(generator) {
	this.monitor_ = generator;
    }

    run() {
	let done = false;
	while (this.tasks_.length != 0) {
	    const task = this.tasks_[0];
	    this.tasks_ = this.tasks_.slice(1);

	    const step = !done ? task.worker.next() : task.worker.return();
	    if (step.done)
		console.log(`Task ${task.id} completed with exit value: ${step.value}`);
	    else
		this.tasks_.push(task);

	    if (this.monitor_)
		done = this.monitor_.next().done;
	} // while
    } // run
} // scheduler

const loop = new scheduler();
loop.add_task(async_repetitive_message("Unexpected item in the bagging area", 2));
loop.add_task(async_print_matches(lucas_sequence(), async_is_prime));
loop.add_task(async_message_after("GETTING A BIT BORED NOW", 18));
loop.set_monitor(async_message_after("SCREW THIS!", 25));
loop.run();
