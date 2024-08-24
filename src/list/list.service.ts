import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { Receipt } from './models/Receipt';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) { }

  async create(createListDto: CreateListDto, userID: string) {
    const itemsData = createListDto.items.map(item => ({
      product: item.product,
      quantity: item.quantity,
      priceUnity: item.priceUnity,
    }));

    const data: Prisma.ListCreateInput = {
      id: uuidv4(),
      createdat: new Date(),
      description: createListDto.description,
      statuslist: createListDto.statuslist,
      createdby: userID,
      items: itemsData,
    };

    const createdList = await this.prisma.list.create({ data });
    return createdList;
  }

  findAll(createdby: string) {
    return this.prisma.list.findMany({
      where: {
        createdby,
      }
    });
  }

  async findOne(id: string, createdby: string) {
    const data = await this.prisma.list.findUnique({
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

  async findOpenOne(createdby: string) {
    console.log('hereee====')
    const data = await this.prisma.list.findFirst({
      where: {
        statuslist: false,
        createdby,
      }
    });

    if (data === null) {
      throw new NotFoundException('List Not Found')
    }
    return data
  }

  async update(id: string, updateListDto: UpdateListDto, createdby: string) {
    const listExists = await this.prisma.list.findUnique({
      where: { id },
    });

    if (!listExists) {
      throw new NotFoundException('List Not Found');
    }

    if (listExists.createdby !== createdby) {
      throw new NotFoundException('User Not Authorized');
    }

    if (!updateListDto.items && !updateListDto.receipt) {
      const updatedData = {
        description: updateListDto.description,
        statuslist: updateListDto.statuslist,
      };
      return await this.prisma.list.update({
        data: updatedData,
        where: { id },
      });
    }

    if (updateListDto.receipt) {
      const newReceipt = {
        id: uuidv4(),
        createdat: new Date(),
        image: updateListDto.receipt,
        description: listExists.description,
        createdby: createdby
      }

      const createdReceipt = await this.prisma.receipt.create({ data: newReceipt });

      const updatedData = {
        description: updateListDto.description,
        statuslist: updateListDto.statuslist,
        receipt: createdReceipt.id,
      };

      return await this.prisma.list.update({
        data: updatedData,
        where: { id },
      });
    }

    const itemsData = updateListDto.items.map(item => ({
      product: item.product,
      quantity: item.quantity,
      priceUnity: item.priceUnity,
    }));

    const updatedData = {
      description: updateListDto.description,
      statuslist: updateListDto.statuslist,
      items: itemsData,
    };

    return await this.prisma.list.update({
      data: updatedData,
      where: { id },
    });
  }

  async remove(id: string, createdby: string) {
    const listExists = await this.prisma.list.findUnique({
      where: {
        id,
      }
    })

    if (!listExists) {
      throw new NotFoundException('List Not Found')
    }

    if (listExists.createdby !== createdby) {
      throw new NotFoundException('List Not Found')
    }

    return await this.prisma.list.delete({
      where: {
        id
      }
    })
  }
}
