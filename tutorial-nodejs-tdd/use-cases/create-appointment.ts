import { Appointment } from '../src/entities/appointment'

interface CreateAppointmentRequest {
  customer: string
  startsAt: Date
  endsAt: Date
}

type CreateAppointmentResponse = Appointment

export class CreateAppointment {
  async execute ({
    customer,
    startsAt,
    endsAt
  }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const newAppointment = new Appointment({
      customer, startsAt, endsAt
    })

    return newAppointment
  }
}
