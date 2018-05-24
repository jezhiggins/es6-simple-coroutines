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

async function search(iterable, predicate) {
    for (const item of iterable)
	if (await predicate(item))
	    return item;
    return null;
} // search

async function is_prime(x) {
    if (x < 2)
	return false;
    for (const i of int_range(2, Math.sqrt(x) + 1)) {
	if (x % i == 0)
	    return false;
	await sleep(0);
    }
    return true;
} // is_prime

async function print_matches(iterable, predicate) {
    for (const item of iterable) {
	const matches = await predicate(item);
	if (matches)
	    console.log(`Found ${item}`)
    }
} // print_matches

async function repetitive_message(message, interval_seconds) {
    while (true) {
	await sleep(interval_seconds);
	console.log(message);
    } //
} // repetitive_message

async function sleep(interval_seconds) {
  const delayPromise = new Promise(resolve =>
    setTimeout(resolve, interval_seconds*1000)
  );
  return delayPromise;
} // sleep

async function message_after(message, interval_seconds) {
    await sleep(interval_seconds);
    console.log(message);
    return `I said "${message}"`;
} // message_after

///////////////////////////////////
class scheduler {
    constructor() {
	this.tasks_ = []
    }

    add_task(promise) {
	this.tasks_.push(promise);
    }

    async run() {
      const results = await Promise.all(this.tasks_)
      for (const r in results)
	console.log(`Task ${r}:\t ${results[r]}`)
    } // run
} // scheduler

const loop = new scheduler();
loop.add_task(repetitive_message("Unexpected item in the bagging area", 2));
loop.add_task(print_matches(lucas_sequence(), is_prime));
loop.add_task(message_after("GETTING A BIT BORED NOW", 18));
loop.run();
