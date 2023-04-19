import { User } from '../entities';

export class IAuthDetail {
  public currentUser: User;

  public ip: string;
}

export class IAuthPayload {
  public email: string;

  public id: number;
}
