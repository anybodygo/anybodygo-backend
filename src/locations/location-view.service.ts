import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {LocationView} from "../views/location.view";

const LIMIT: number = 5;

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
            .where("LOWER(location.name) LIKE :name", { name: `${query}%` })
            .orWhere("LOWER(location.parent) LIKE :parent", { parent: `${query}%` })
            .limit(LIMIT)
            .getMany();
    }
}
