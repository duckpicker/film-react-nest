export class TicketDto {
  film: string;
  session: string;
  daytime: string;
  day: string;
  time: string;
  row: number;
  seat: number;
  price: number;
}

export class OrderDto {
  email: string;
  phone: string;
  tickets: Array<{
    film: string;
    session: string;
    daytime: string;
    row: number;
    seat: number;
    price: number;
  }>;
}
