import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll() {
    const films = await this.filmsRepository.findAll();
    return {
      items: films.map((film) => this.mapToDto(film)),
      total: films.length,
    };
  }

  async findOne(id: string) {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    return {
      items: [this.mapToDto(film)],
      total: 1,
    };
  }

  async findSchedule(id: string) {
    const film = await this.filmsRepository.findOneWithSchedule(id);
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

  private mapToDto(film: any): FilmDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...filmData } = film.toObject ? film.toObject() : film;
    return filmData as FilmDto;
  }
}
