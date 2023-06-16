import { describe, it, expect } from 'vitest'
import { CreateAppointment } from './create-appointment'
import { Appointment } from '../src/entities/appointment'

describe('create appointment', () => {
  it('should be able to create an appointment', () => {
    // System Under Test
    const sut = new CreateAppointment()

    const startsAt = new Date()
    const endsAt = new Date()

    startsAt.setDate(startsAt.getDate() + 1)
    endsAt.setDate(endsAt.getDate() + 2)

    expect(sut.execute({
      customer: 'Jack Chan',
      startsAt,
      endsAt
    })).resolves.toBeInstanceOf(Appointment)
  })
})
