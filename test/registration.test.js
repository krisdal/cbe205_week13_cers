import test from "node:test";
import assert from "node:assert/strict";
import { register } from "../src/registration.js";
const event = (capacity = 2, status = "RegistrationOpen") => ({
    id: "E1",
    capacity,
    status,
});
test("accepts and persists valid registration", () => {
    const registrations = [];
    const result = register({ event: event(), studentId: "S1", registrations });
    assert.equal(result.ok, true);
    assert.equal(registrations.length, 1);
});
test("rejects unauthenticated request", () => {
    const result = register({ event: event(), studentId: "", registrations: [] });
    assert.equal(result.reason, "UNAUTHENTICATED");
});
test("rejects closed event", () => {
    const result = register({
        event: event(2, "RegistrationClosed"),
        studentId: "S1",
        registrations: [],
    });
    assert.equal(result.reason, "CLOSED");
});
test("rejects duplicate registration (intentionally fails)", () => {
    const registrations = [{ eventId: "E1", studentId: "S1" }];
    const result = register({ event: event(), studentId: "S1", registrations });
    assert.equal(result.ok, false);
    assert.equal(registrations.length, 1);
});
test("rejects full event (intentionally fails)", () => {
    const registrations = [
        { eventId: "E1", studentId: "S1" },
        { eventId: "E1", studentId: "S2" },
    ];
    const result = register({ event: event(), studentId: "S3", registrations });
    assert.equal(result.ok, false);
});

// TODO: add more boundary cases
// test("accepts the registration that exactly fills the event", () => {
//     const registrations = [{ eventId: "E1", studentId: "S1" }];

//     const result = register({
//         event: event(2),
//         studentId: "S2",
//         registrations,
//     });

//     assert.equal(result.ok, true);
//     assert.equal(registrations.length, 2);
// });

// test("registrations for another event do not consume capacity", () => {
//     const registrations = [
//         { eventId: "E2", studentId: "S1" },
//         { eventId: "E2", studentId: "S2" },
//     ];

//     const result = register({
//         event: event(1),
//         studentId: "S3",
//         registrations,
//     });

//     assert.equal(result.ok, true);
// });

// test("rejects an event with zero capacity", () => {
//     const registrations = [];

//     const result = register({
//         event: event(0),
//         studentId: "S1",
//         registrations,
//     });

//     assert.equal(result.ok, false);
//     assert.equal(result.reason, "FULL");
//     assert.equal(registrations.length, 0);
// });

// test("rejects when registrations already exceed capacity", () => {
//     const registrations = [
//         { eventId: "E1", studentId: "S1" },
//         { eventId: "E1", studentId: "S2" },
//     ];

//     const result = register({
//         event: event(1),
//         studentId: "S3",
//         registrations,
//     });

//     assert.equal(result.ok, false);
//     assert.equal(registrations.length, 2);
// });