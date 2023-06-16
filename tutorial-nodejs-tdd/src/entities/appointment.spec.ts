import { test, expect } from 'vitest'
import { Appointment } from './appointment'

test('create an appointment', () => {
  const startsAt = new Date()
  const endsAt = new Date()

  startsAt.setDate(startsAt.getDate() + 1)
  endsAt.setDate(endsAt.getDate() + 2)

  const appointment = new Appointment({
    customer: 'Jack Chan',
    startsAt,
    endsAt
  })

  expect(appointment).toBeInstanceOf(Appointment)
  expect(appointment.customer).toEqual('Jack Chan')
})

test('cannot have an end date before start date', () => {
  const startsAt = new Date()
  const endsAt = new Date()

  startsAt.setDate(startsAt.getDate() + 2)
  endsAt.setDate(endsAt.getDate() + 1)

  expect(() => {
    return new Appointment({
      customer: 'Jack Chan',
      startsAt,
      endsAt
    })
  }).toThrow('Invalid end date')
})

test('cannot have an start date before now', () => {
  const startsAt = new Date()
  const endsAt = new Date()

  startsAt.setDate(startsAt.getDate() - 1)
  endsAt.setDate(endsAt.getDate() + 2)

  expect(() => {
    return new Appointment({
      customer: 'Jack Chan',
      startsAt,
      endsAt
    })
  }).toThrow('Invalid start date')
})
