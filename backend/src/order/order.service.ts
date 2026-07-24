import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async createOrder(orderDto: OrderDto) {
    const results = [];

    for (const ticket of orderDto.tickets) {
      const film = await this.filmRepository.findOne({
        where: { id: ticket.film },
      });
      if (!film) {
        throw new BadRequestException('Фильм не найден');
      }

      const scheduleItem = await this.scheduleRepository.findOne({
        where: { id: ticket.session, filmId: ticket.film },
      });
      if (!scheduleItem) {
        throw new BadRequestException('Сеанс не найден');
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      const taken = scheduleItem.taken || [];

      if (taken.includes(seatKey)) {
        throw new BadRequestException(`Место ${seatKey} уже занято`);
      }

      taken.push(seatKey);

      await this.scheduleRepository.update({ id: ticket.session }, { taken });

      results.push({
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
