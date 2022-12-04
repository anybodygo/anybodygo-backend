import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {City} from "../../cities/entities/city.entity";

@Entity({ name: 'countries' })
export class Country {
    @PrimaryColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'flag' })
    flag: string;

    @OneToMany(() => City, (city) => city.country)
    cities: City[];
}
