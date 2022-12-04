import {
    Column, Entity,
    Generated, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {Request} from '../../requests/entities/request.entity';
import {Country} from "../../countries/entities/country.entity";

@Entity({ name: 'request_directions' })
export class RequestDirection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 'name': 'guid' })
    @Generated('uuid')
    guid: string;

    @Column({ 'name': 'from_country_id', 'type': 'int' })
    fromCountryId: number;

    @Column({ 'name': 'from_city_id', 'type': 'int', 'default': null })
    fromCityId: number;

    @Column({ 'name': 'to_country_id', 'type': 'int' })
    toCountryId: number;

    @Column({ 'name': 'to_city_id', 'type': 'int', 'default': null })
    toCityId: number;

    @ManyToOne(() => Request, (request) => request.directions)
    @JoinColumn({ name: "request_id" })
    request: Request;
}
