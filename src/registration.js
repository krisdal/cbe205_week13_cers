// Deliberately defective starter: fix duplicate and capacity checks.
// In-memory repository is NOT safe for concurrent production requests.
export function register({ event, studentId, registrations }) {
  if (!studentId) return { ok: false, reason: "UNAUTHENTICATED" };
  if (event.status !== "RegistrationOpen")
    return { ok: false, reason: "CLOSED" };
  // TODO: reject duplicate (event.id, studentId) registration.
  // for (let i = registrations.length - 1; i >= 0; i -= 1) {
  //   const registration = registrations[i];
  //   if (registration.eventId === event.id && registration.studentId === studentId)
  //     return { ok: false, reason: "DUPLICATE" };
  // }
  // TODO: reject registration when registrations for this event >= capacity.
  // let eventRegistrationCount = 0;
  // for (let i = registrations.length - 1; i >= 0; i -= 1) {
  //   if (registrations[i].eventId === event.id) {
  //     eventRegistrationCount += 1;
  //     if (eventRegistrationCount >= event.capacity)
  //       return { ok: false, reason: "FULL" };
  //   }
  // }
  // Initially, there's no need to extra check here. 
  // if (eventRegistrationCount >= event.capacity)
  //   return { ok: false, reason: "FULL" };

  const record = { eventId: event.id, studentId };
  registrations.push(record);
  return { ok: true, confirmation: record };
}
