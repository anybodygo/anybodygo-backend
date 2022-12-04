import { Get, Controller, Res, HttpStatus } from '@nestjs/common';
import {LocationParserService} from "../providers/location-parser/location-parser.service";

@Controller({ path: 'locations' })
export class LocationsController {
    constructor(
        private readonly locationParserService: LocationParserService,
    ) {}

    @Get()
    parseLocations(@Res() response)
    {
        this.locationParserService.parse();
        response.status(HttpStatus.OK).send('Locations were parsed successfully.');
    }
}