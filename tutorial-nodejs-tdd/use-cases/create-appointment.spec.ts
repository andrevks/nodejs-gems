import { describe, it, expect } from 'vitest'
import { CreateAppointment } from './create-appointment'
import { Appointment } from '../src/entities/appointment'
import { getFutureDate } from '../src/tests/utils/get-future-date'

describe('create appointment', () => {
  it('should be able to create an appointment', () => {
    const startsAt = getFutureDate('2023-06-15')
    const endsAt = getFutureDate('2023-06-17')

    // System Under Test
    const sut = new CreateAppointment()

    expect(sut.execute({
      customer: 'Jack Chan',
      startsAt,
      endsAt
    })).resolves.toBeInstanceOf(Appointment)
  })
})
