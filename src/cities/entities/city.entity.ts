import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Country} from "../../countries/entities/country.entity";

@Entity({ name: 'cities' })
export class City {
    @PrimaryColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @ManyToOne(() => Country, (country) => country.cities)
    @JoinColumn({ name: "country_id" })
    country: Country;
}
