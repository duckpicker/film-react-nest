import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmDto } from './dto/films.dto';
import { Film } from './film.entity';

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

    const schedules = film.schedules.map((item) => ({
      id: item.id,
      film: id,
      daytime: item.daytime,
      day: '',
      time: '',
      hall: item.hall,
      rows: item.rows,
      seats: item.seats,
      price: item.price,
      taken: item.taken ? item.taken.split(',').filter(Boolean) : [],
    }));

    return {
      items: schedules,
      total: schedules.length,
    };
  }

  private mapToDto(film: Film): FilmDto {
    let tags: string[];
    if (typeof film.tags === 'string') {
      try {
        tags = JSON.parse(film.tags);
      } catch {
        tags = [film.tags];
      }
    } else {
      tags = film.tags;
    }

    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    };
  }
}
