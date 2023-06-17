import { describe, it, expect } from 'vitest'
import { CreateAppointment } from './create-appointment'
import { Appointment } from '../entities/appointment'
import { getFutureDate } from '../tests/utils/get-future-date'
import { InMemoryAppointmentsRepository } from '../repositories/in-memory/in-memory-appointments'

describe('create appointment', () => {
  it('should be able to create an appointment', () => {
    const startsAt = getFutureDate('2023-06-15')
    const endsAt = getFutureDate('2023-06-17')

    // System Under Test
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const sut = new CreateAppointment(appointmentsRepository)

    expect(sut.execute({
      customer: 'Jack Chan',
      startsAt,
      endsAt
    })).resolves.toBeInstanceOf(Appointment)
  })

  it('should NOT be able to create an appointment with overlapping dates   ', async () => {
    const startsAt = getFutureDate('2023-06-10')
    const endsAt = getFutureDate('2023-06-15')

    // System Under Test
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const sut = new CreateAppointment(appointmentsRepository)

    await sut.execute({
      customer: 'Jack Chan',
      startsAt,
      endsAt
    })

    expect(sut.execute({
      customer: 'Jack Chan',
      startsAt: getFutureDate('2023-06-14'),
      endsAt: getFutureDate('2023-06-18')
    })).rejects.toBeInstanceOf(Error)

    expect(sut.execute({
      customer: 'Jack Chan',
      startsAt: getFutureDate('2023-06-08'),
      endsAt: getFutureDate('2023-06-12')
    })).rejects.toBeInstanceOf(Error)

    expect(sut.execute({
      customer: 'Jack Chan',
      startsAt: getFutureDate('2023-06-08'),
      endsAt: getFutureDate('2023-06-12')
    })).rejects.toBeInstanceOf(Error)

    expect(sut.execute({
      customer: 'Jack Chan',
      startsAt: getFutureDate('2023-06-08'),
      endsAt: getFutureDate('2023-06-17')
    })).rejects.toBeInstanceOf(Error)

    expect(sut.execute({
      customer: 'Jack Chan',
      startsAt: getFutureDate('2023-06-11'),
      endsAt: getFutureDate('2023-06-12')
    })).rejects.toBeInstanceOf(Error)
  })
})
