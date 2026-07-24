import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../repository/film.schema';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async createOrder(orderDto: OrderDto) {
    const results = [];

    for (const ticket of orderDto.tickets) {
      const film = await this.filmModel.findOne({ id: ticket.film }).exec();
      if (!film) {
        throw new BadRequestException('Фильм не найден');
      }

      const scheduleItem = film.schedule.find(
        (s) => s.id === ticket.session,
      );
      if (!scheduleItem) {
        throw new BadRequestException('Сеанс не найден');
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      const taken = scheduleItem.taken || [];

      if (taken.includes(seatKey)) {
        throw new BadRequestException(`Место ${seatKey} уже занято`);
      }

      const newTaken = [...taken, seatKey];

      await this.filmModel.updateOne(
        { id: film.id, 'schedule.id': scheduleItem.id },
        { $set: { 'schedule.$.taken': newTaken } },
      );

      results.push({
        filmId: ticket.film,
        scheduleId: ticket.session,
        row: ticket.row,
        seat: ticket.seat,
      });
    }

    return {
      items: results,
      total: results.length,
    };
  }
}