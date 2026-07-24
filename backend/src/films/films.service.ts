import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../repository/film.schema';

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll() {
    const films = await this.filmModel.find().exec();
    return {
      items: films,
      total: films.length,
    };
  }

  async findOne(id: string) {
    const film = await this.filmModel.findOne({ id }).exec();
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    return {
      items: [film],
      total: 1,
    };
  }

  async findSchedule(id: string) {
    const film = await this.filmModel.findOne({ id }).exec();
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    const schedule = film.schedule.map((item) => ({
      id: item.id,
      film: id,
      daytime: item.daytime,
      day: '',
      time: '',
      hall: item.hall,
      rows: item.rows,
      seats: item.seats,
      price: item.price,
      taken: item.taken || [],
    }));

    return {
      items: schedule,
      total: schedule.length,
    };
  }
}