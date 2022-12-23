import { Injectable, NotFoundException, MessageEvent } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProduct } from '../types';
import { uuidv4 } from '../utils';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ProductsService {
  private readonly products: Map<string, IProduct> = new Map();
  private readonly productEvent$ = new Subject<MessageEvent>();

  create(createProductDto: CreateProductDto): IProduct {
    const id = uuidv4();
    const product: IProduct = { id, ...createProductDto };

    this.products.set(id, product);

    this.productEvent$.next({
      data: JSON.stringify(product),
      type: 'product-created',
      id,
      retry: 0,
    });

    return product;
  }

  findAll(): IProduct[] {
    return Array.from(this.products.values());
  }

  findOne(id: string): IProduct {
    const product = this.products.get(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto): IProduct {
    const product = this.findOne(id);

    const updatedProduct: IProduct = { ...product, ...updateProductDto };

    this.products.set(id, updatedProduct);

    this.productEvent$.next({
      data: JSON.stringify(updatedProduct),
      type: 'product-updated',
      id,
      retry: 0,
    });

    return updatedProduct;
  }

  remove(id: string): IProduct {
    const product = this.findOne(id);

    this.products.delete(id);

    this.productEvent$.next({
      data: JSON.stringify(product),
      type: 'product-deleted',
      id,
      retry: 0,
    });

    return product;
  }

  getProductEvent(): Observable<MessageEvent> {
    return this.productEvent$.asObservable();
  }
}
