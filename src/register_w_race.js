import test from "node:test";
import assert from "node:assert/strict";

function barrier(parties) {
    let arrivals = 0;
    let release;

    const gate = new Promise((resolve) => {
        release = resolve;
    });

    return async () => {
        arrivals += 1;
        if (arrivals === parties) release();
        await gate;
    };
}

async function registerWithRace({
    event,
    studentId,
    registrations,
    waitForOtherRequest,
}) {
    const count = registrations.filter(
        (registration) => registration.eventId === event.id,
    ).length;

    if (count >= event.capacity) {
        return { ok: false, reason: "FULL" };
    }

    // Simulates a database/network delay between checking and writing.
    await waitForOtherRequest();

    const record = { eventId: event.id, studentId };
    registrations.push(record);
    return { ok: true, confirmation: record };
}

test("demonstrates the capacity race", async () => {
    const event = {
        id: "E1",
        capacity: 1,
        status: "RegistrationOpen",
    };
    const registrations = [];
    const waitForOtherRequest = barrier(2);

    const results = await Promise.all([
        registerWithRace({
            event,
            studentId: "S1",
            registrations,
            waitForOtherRequest,
        }),
        registerWithRace({
            event,
            studentId: "S2",
            registrations,
            waitForOtherRequest,
        }),
    ]);

    assert.equal(results[0].ok, true);
    assert.equal(results[1].ok, true);
    assert.equal(registrations.length, 2);
    assert.ok(registrations.length > event.capacity);
    console.log(`Number of registrations is ${registrations.length}.`);
    console.log(`Event capacity is ${event.capacity}.`);
});