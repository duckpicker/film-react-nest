import { Injectable, BadRequestException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { OrderDto } from './dto/order.dto';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  private generateId(): string {
    return crypto.randomUUID();
  }

  async createOrder(orderDto: OrderDto) {
    const results = [];

    for (const ticket of orderDto.tickets) {
      const film = await this.filmsRepository.findById(ticket.film);
      if (!film) {
        throw new BadRequestException('Фильм не найден');
      }

      const scheduleItem = film.schedule.find((s) => s.id === ticket.session);
      if (!scheduleItem) {
        throw new BadRequestException('Сеанс не найден');
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      const taken = scheduleItem.taken || [];

      if (taken.includes(seatKey)) {
        throw new BadRequestException(`Место ${seatKey} уже занято`);
      }

      const newTaken = [...taken, seatKey];

      await this.filmsRepository.updateTakenSeats(
        ticket.film,
        ticket.session,
        newTaken,
      );

      results.push({
        id: this.generateId(),
        film: ticket.film,
        session: ticket.session,
        daytime: ticket.daytime || scheduleItem.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price || scheduleItem.price,
      });
    }

    return {
      items: results,
      total: results.length,
    };
  }
}
