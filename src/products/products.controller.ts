import {
  MessageEvent,
  Controller,
  Delete,
  Param,
  Patch,
  Body,
  Post,
  Get,
  Sse,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Observable } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Sse('mutation')
  mutation(): Observable<MessageEvent> {
    return this.productsService.getProductEvent();
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
