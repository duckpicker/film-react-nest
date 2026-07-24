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
        throw new BadRequestException(`Фильм с id ${ticket.film} не найден`);
      }

      const scheduleItem = film.schedule.find(
        (s) => s.id === ticket.session,
      );
      if (!scheduleItem) {
        throw new BadRequestException(`Сеанс с id ${ticket.session} не найден`);
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
        id: `${ticket.film}-${ticket.session}-${ticket.row}-${ticket.seat}`,
        film: ticket.film,
        session: ticket.session,
        daytime: scheduleItem.daytime,
        day: ticket.day,
        time: ticket.time,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price,
      });
    }

    return {
      items: results,
      total: results.length,
    };
  }
}