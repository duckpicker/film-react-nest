import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../entities/film.entity';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
  ) {}

  async findAll() {
    const films = await this.filmRepository.find();
    return {
      items: films,
      total: films.length,
    };
  }

  async findOne(id: string) {
    const film = await this.filmRepository.findOne({ where: { id } });
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    return {
      items: [film],
      total: 1,
    };
  }

  async findSchedule(id: string) {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });

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
