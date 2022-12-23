import { Injectable } from '@nestjs/common';
import { IProduct } from './types';

@Injectable()
export class AppService {
  private readonly products: Map<string, IProduct> = new Map();

  getHello(): string {
    return 'Hello World!';
  }
}
