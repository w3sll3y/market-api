import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReceiptService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createReceiptDto: CreateReceiptDto) {
    const data: Prisma.ReceiptCreateInput = {
      id: uuidv4(),
      createdat: new Date(),
      createdby: createReceiptDto.createdby,
      description: createReceiptDto.description,
      image: createReceiptDto.image
    }
    const receiptCreated = await this.prisma.receipt.create({ data });
    return receiptCreated;
  }

  findAll(createdby: string) {
    return this.prisma.receipt.findMany({
      where: {
        createdby,
      }
    });
  }

  async findOne(id: string, createdby: string) {
    const data = await this.prisma.receipt.findUnique({
      where: {
        id,
        createdby,
      }
    });

    if (data === null) {
      throw new NotFoundException('List Not Found')
    }
    return data
  }

  async update(id: string, updateReceiptDto: UpdateReceiptDto, createdby: string) {
    const receiptExists = await this.prisma.receipt.findUnique({
      where: {
        id,
      }
    })

    if (!receiptExists) {
      throw new NotFoundException('User Not Found')
    }

    if (receiptExists.createdby !== createdby) {
      throw new NotFoundException('User Not Found')
    }

    return await this.prisma.receipt.update({
      data: {
        image: updateReceiptDto.image
      },
      where: {
        id
      }
    })
  }

  async remove(id: string, createdby: string) {
    const receiptExists = await this.prisma.receipt.findUnique({
      where: { id },
    });

    if (!receiptExists || receiptExists.createdby !== createdby) {
      throw new NotFoundException('Receipt Not Found');
    }

    await this.prisma.list.updateMany({
      where: { receipt: id },
      data: { receipt: null },
    });

    return await this.prisma.receipt.delete({
      where: { id },
    });
  }
}
