import {Get, Controller, Res, HttpStatus, Req, Param} from '@nestjs/common';
import {LocationParserService} from "../providers/location-parser/location-parser.service";
import {LocationService} from "../providers/location/location.service";

@Controller({ path: 'locations' })
export class LocationsController {
    constructor(
        private readonly locationParserService: LocationParserService,
        private readonly locationService: LocationService,
    ) {}

    @Get()
    parseLocations(@Res() response)
    {
        this.locationParserService.parse();
        response.status(HttpStatus.OK).send('Locations were parsed successfully.');
    }

    @Get(':prefix/:name')
    getLocation(@Param('prefix') prefix: string, @Param('name') name: string)
    {
        return this.locationService.getLocation(prefix, name);
    }
}