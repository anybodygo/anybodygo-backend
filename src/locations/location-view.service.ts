import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {LocationView} from "../views/location.view";

@Injectable()
export class LocationViewService {
    constructor(
        @InjectRepository(LocationView)
        private locationViewRepository: Repository<LocationView>,
    ) {}

    findAll(query: string)
    {
        return this.locationViewRepository
            .createQueryBuilder("location")
            .where("location.name LIKE :name", { name: `%${query}%` })
            .orWhere("location.parent LIKE :parent", { parent: `%${query}%` })
            .getMany();
    }
}
