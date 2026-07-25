import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/film.entity';
import { Schedule } from '../films/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.find({ relations: ['schedules'] });
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });
  }

  async findOneWithSchedule(id: string): Promise<Film | null> {
    return this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });
  }

  async addTakenSeat(
    filmId: string,
    scheduleId: string,
    seatKey: string,
  ): Promise<boolean> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId, film: { id: filmId } },
    });

    if (!schedule) return false;

    const takenArray = schedule.taken
      ? schedule.taken.split(',').filter(Boolean)
      : [];

    if (takenArray.includes(seatKey)) return false;

    takenArray.push(seatKey);
    schedule.taken = takenArray.join(',');

    await this.scheduleRepository.save(schedule);
    return true;
  }
}
