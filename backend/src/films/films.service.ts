import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../repository/film.schema';

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findOne(id: string): Promise<Film> {
    const film = await this.filmModel.findOne({ id }).exec();
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }
    return film;
  }
}
