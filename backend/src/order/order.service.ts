import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../repository/film.schema';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async createOrder(orderDto: OrderDto) {
    const film = await this.filmModel.findOne({ id: orderDto.filmId }).exec();
    if (!film) {
      throw new BadRequestException('Фильм не найден');
    }

    const scheduleItem = film.schedule.find(
      (s) => s.id === orderDto.scheduleId,
    );
    if (!scheduleItem) {
      throw new BadRequestException('Сеанс не найден');
    }

    const taken = scheduleItem.taken || [];

    for (const seat of orderDto.seats) {
      if (taken.includes(seat)) {
        throw new BadRequestException(`Место ${seat} уже занято`);
      }
    }

    const newTaken = [...taken, ...orderDto.seats];

    await this.filmModel.updateOne(
      { id: film.id, 'schedule.id': scheduleItem.id },
      { $set: { 'schedule.$.taken': newTaken } },
    );

    return {
      success: true,
      message: 'Билеты забронированы',
      seats: orderDto.seats,
    };
  }
}
